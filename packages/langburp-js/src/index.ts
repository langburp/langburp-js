import { ConnectApi, ConnectionsApi, ConversationsApi, EndUserAuthApi, MessagesApi, Configuration, WebhookCallbackApi } from "./langburpapi_client";
import * as ApiClient from "./langburpapi_client";

export type * from "./langburpapi_client";
export { ApiClient };

export type LangburpClientParams = {
  publicApiKey: string;
  secretApiKey?: string;
  endUserToken?: string;

  apiBaseUrl?: string;
}

export class LangburpClient {
  public connect: ConnectApi;
  public connections: ConnectionsApi;
  public conversations: ConversationsApi;
  public endUserAuth: EndUserAuthApi;
  public messages: MessagesApi;
  public webhookCallbackApi: WebhookCallbackApi;
  public webhookCallback;

  constructor(params: LangburpClientParams) {
    const baseUrl = params.apiBaseUrl || "https://api.langburp.com";
    const config = new Configuration({
      basePath: baseUrl,
      apiKey: (name: string) => {
        if (name === "x-api-key") {
          return params.publicApiKey;
        }
        if (name === "x-secret-key") {
          if (!params.secretApiKey) {
            throw new Error("Secret API key is not set, but is required for this operation");
          }
          return params.secretApiKey;
        }
        if (name === "x-end-user-token") {
          if (!params.endUserToken) {
            throw new Error("End user token is not set, but is required for this operation");
          }
          return params.endUserToken;
        }
        throw new Error(`Invalid API key name requested by client: ${name}`);
      },
    });
    this.connect = new ConnectApi(config);
    this.connections = new ConnectionsApi(config);
    this.conversations = new ConversationsApi(config);
    this.endUserAuth = new EndUserAuthApi(config);
    this.messages = new MessagesApi(config);
    this.webhookCallbackApi = new WebhookCallbackApi(config);
    this.webhookCallback = (webhookReq: {
      connection: {
        id: string;
      }
      callbackContext: string | null;
    }, callbackBody: any) => {
      if (!webhookReq.connection.id || !webhookReq.callbackContext) {
        console.warn("Webhook callback URL or context is not set, skipping webhook callback call");
        return;
      }
      this.webhookCallbackApi.webhookCallback({
        connectionId: webhookReq.connection.id,
        xWebhookCallbackContext: webhookReq.callbackContext,
        body: callbackBody,
      });
      return 
    }
  }
}
