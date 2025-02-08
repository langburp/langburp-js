import { useContext, useEffect, useMemo, useState } from "react";
import { LangburpContext } from "../contexts/langburp-context";
import { LangburpClient } from "@langburp/langburp-js";
import { ProviderKinds } from "../utils/provider-metadata";
import type { LangburpContextType } from "../contexts/langburp-context";

type LangburpConnectResult = {
  success: boolean;
  connectionId?: string;
  connectionUserId?: string;
  openAppUrl?: string;
  openBrowserUrl?: string;
  error?: string;
} | null;

export const useLangburpConnect = (hookContext: Partial<LangburpContextType>) => {
  const contextFromProvider = useContext(LangburpContext);
  if (!contextFromProvider) {
    throw new Error("useLangburpConnect must be used within a LangburpProvider");
  }

  const context = useMemo(() => ({
    ...contextFromProvider,
    ...hookContext,
  }), [contextFromProvider, hookContext]);

  const apiClient = useMemo(() => new LangburpClient({
    apiBaseUrl: context.apiBaseUrl,
    publicApiKey: context.publicApiKey,
  }), [context.apiBaseUrl, context.publicApiKey]);

  const [integrations, setIntegrations] = useState<Awaited<ReturnType<typeof apiClient.connect.getAvailableIntegrations>>['integrations']>([]);
  const [slackIntegration, setSlackIntegration] = useState<Awaited<ReturnType<typeof apiClient.connect.getAvailableIntegrations>>['integrations'][number] | null>(null);
  const [msTeamsIntegration, setMsTeamsIntegration] = useState<Awaited<ReturnType<typeof apiClient.connect.getAvailableIntegrations>>['integrations'][number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<LangburpConnectResult>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : null;

  const mustAuthorizeEndUser = async (state?: string) => {
    if (!context.onAuthorize) {
      throw new Error("onAuthorize is required");
    }
    try {
      return await context.onAuthorize(state)
    } catch (error) {
      console.error(error)
      throw new Error('An error occurred while attempting to authorize the end user. Please try again.')
    }
  }

  const connect = async (integrationKindOrId: string) => {
    let integrationId = integrationKindOrId;
    if ((Object.values(ProviderKinds) as string[]).includes(integrationKindOrId)) {
      integrationId = integrations.find(integration => integration.provider === integrationKindOrId)?.id ?? (() => {
        throw new Error(`No integration found for provider kind ${integrationKindOrId}`)
      })();
    }
    try {
      let authResp;
      if (context.onAuthorize) {
        authResp = await mustAuthorizeEndUser();
      } else {
        authResp = {}
      }
      const connectResp = await apiClient.connect.connectIntegration({
        integrationId: integrationId,
        connectIntegrationSchema: {
          ...authResp,
          redirectUrl: window.location.href
        }
      })

      if (connectResp.installUrl) {
        if (!connectResp.userWillReturn) {
          window.open(connectResp.installUrl, '_blank')
        } else {
          window.location.href = connectResp.installUrl
        }
      } else {
        throw new Error('Failed to connect to integration')
      }
    } catch (error) {
      console.error(error)
      throw new Error('Failed to connect to integration')
    }
  }

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const { integrations } = await apiClient.connect.getAvailableIntegrations()

        setIntegrations(integrations)
        setSlackIntegration(integrations.find(integration => integration.provider === ProviderKinds.SlackApp) ?? null)
        setMsTeamsIntegration(integrations.find(integration => integration.provider === ProviderKinds.MsTeamsApp) ?? null)
      } catch (error) {
        console.error(error);
        throw new Error('Failed to load integrations. Please refresh the page.')
      } finally {
        setIsLoading(false);
      }
    }
    fetchIntegrations()
  }, [])

  useEffect(() => {
    if (!currentUrl) return;

    try {
      const urlObj = new URL(currentUrl);
      const params = new URLSearchParams(urlObj.search);

      if (params.get('_langburp') !== 'true') return;

      const success = params.get('success') === 'true';

      if (success) {
        setResult({
          success: true,
          connectionId: params.get('connectionId') || undefined,
          connectionUserId: params.get('connectionUserId') || undefined,
          openAppUrl: params.get('openAppUrl') ? decodeURIComponent(params.get('openAppUrl')!) : undefined,
          openBrowserUrl: params.get('openBrowserUrl') ? decodeURIComponent(params.get('openBrowserUrl')!) : undefined,
        });
      } else {
        setResult({
          success: false,
          error: params.get('error') || 'Connection failed',
        });
      }
    } catch (error) {
      console.error('Failed to parse URL:', error);
    }
  }, [currentUrl]);

  return {
    integrations,
    slackIntegration,
    msTeamsIntegration,
    isLoading,
    connect,
    result,
  };
}; 