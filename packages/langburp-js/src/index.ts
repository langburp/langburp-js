import { ConnectApi, ConnectionsApi, ConversationsApi, EndUserAuthApi, MessagesApi, Configuration, ConfigurationParameters } from "./langburpapi_client";
import * as ApiClient from "./langburpapi_client";

export type * from "./langburpapi_client";
export { ApiClient };

export type LangburpClientParams = {
  publicApiKey: string;
  secretApiKey?: string;

  apiBaseUrl?: string;
}

export class LangburpClient {
  public connect: ConnectApi;
  public connections: ConnectionsApi;
  public conversations: ConversationsApi;
  public endUserAuth: EndUserAuthApi;
  public messages: MessagesApi;

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
        throw new Error(`Invalid API key name requested by client: ${name}`);
      },
    });
    this.connect = new ConnectApi(config);
    this.connections = new ConnectionsApi(config);
    this.conversations = new ConversationsApi(config);
    this.endUserAuth = new EndUserAuthApi(config);
    this.messages = new MessagesApi(config);
  }
}
