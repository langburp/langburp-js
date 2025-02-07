import { useContext, useEffect, useMemo, useState } from "react";
import { LangburpContext } from "../contexts/LangburpContext";
import { LangburpClient } from "@langburp/langburp-js";
import { ProviderKinds } from "../utils/provider-metadata";
import type { LangburpContextType } from "../contexts/LangburpContext";

export const useLangburpConnect = (hookContext: Partial<LangburpContextType>) => {
  const context = useContext(LangburpContext);
  if (!context) {
    throw new Error("useLangburpConnect must be used within a LangburpProvider");
  }

  const apiClient = useMemo(() => new LangburpClient({
    apiBaseUrl: context.apiBaseUrl,
    publicApiKey: context.publicApiKey,
  }), [context.apiBaseUrl, context.publicApiKey]);

  const onAuthorize = hookContext.onAuthorize || context.onAuthorize;

  const [integrations, setIntegrations] = useState<Awaited<ReturnType<typeof apiClient.connect.getAvailableIntegrations>>['integrations']>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mustAuthorizeEndUser = async (state?: string) => {
    if (!onAuthorize) {
      throw new Error("onAuthorize is required");
    }
    try {
      return await onAuthorize(state)
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
      if (onAuthorize) {
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
      } catch (error) {
        console.error(error);
        throw new Error('Failed to load integrations. Please refresh the page.')
      } finally {
        setIsLoading(false);
      }
    }
    fetchIntegrations()
  }, [])


  return {
    integrations,
    isLoading,
    connect,
  };
}; 