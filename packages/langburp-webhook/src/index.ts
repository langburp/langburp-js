import type {
  WebhookMessageReceivedBodySchema,
  WebhookSlashCommandReceivedBodySchema,
  WebhookConnectionConnectedBodySchema,
  WebhookConnectionUserConnectedBodySchema,
  WebhookRequestBodySchema,
  LangburpClientParams,
} from "@langburp/langburp-js";
import { LangburpClient } from "@langburp/langburp-js";
import { isVerifiedLangburpWebhook, LangburpWebhookVerificationHeaders } from "./verify-webhook";

type HandlerMessageRespondFn = (message: string | { message: { text: string } }) => Promise<void>;

type HandlerArgs = {
  client: LangburpClient;
}

type MessageHandlerArgs = {
  respond: HandlerMessageRespondFn;
} & HandlerArgs & WebhookMessageReceivedBodySchema

type MessageHandler = (body: MessageHandlerArgs) => Promise<void>;

type SlashCommandHandler = (body: WebhookSlashCommandReceivedBodySchema) => Promise<void>;

type ConnectionHandler = (body: WebhookConnectionConnectedBodySchema) => Promise<void>;

type ConnectionUserHandler = (body: WebhookConnectionUserConnectedBodySchema) => Promise<void>;

export class LangburpWebhookResponder {
  private client: LangburpClient;
  private secretApiKey: string;
  private publicApiKey: string;
  private messageHandlers: Array<{ pattern: string | RegExp; handler: MessageHandler }> = [];
  private commandHandlers: Array<{ pattern: string | RegExp; handler: SlashCommandHandler }> = [];
  private connectionHandlers: ConnectionHandler[] = [];
  private connectionUserHandlers: ConnectionUserHandler[] = [];

  constructor(params: LangburpClientParams) {
    if (!params.secretApiKey) {
      throw new Error("secretApiKey is required");
    }
    if (!params.publicApiKey) {
      throw new Error("publicApiKey is required");
    }
    this.secretApiKey = params.secretApiKey;
    this.publicApiKey = params.publicApiKey;
    this.client = new LangburpClient(params);
  }

  // Message listener
  message(pattern: string | RegExp, handler: MessageHandler): this {
    this.messageHandlers.push({ pattern, handler });
    return this;
  }

  // Slash command listener
  command(pattern: string | RegExp, handler: SlashCommandHandler): this {
    this.commandHandlers.push({ pattern, handler });
    return this;
  }

  // Connection listener
  connection(handler: ConnectionHandler): this {
    this.connectionHandlers.push(handler);
    return this;
  }

  // Connection user listener
  connectionUser(handler: ConnectionUserHandler): this {
    this.connectionUserHandlers.push(handler);
    return this;
  }

  async handle({
    rawBody,
    headers
  }: {
    rawBody: string;
    headers: LangburpWebhookVerificationHeaders;
  }): Promise<Promise<void>[]> {
    const body = JSON.parse(rawBody) as WebhookRequestBodySchema;
    if (!isVerifiedLangburpWebhook({
      signingSecret: this.secretApiKey,
      body: rawBody,
      headers
    })) {
      throw new Error("Invalid webhook signature");
    }
    return this.processVerifiedWebhook(body);
  }

  processVerifiedWebhook(body: WebhookRequestBodySchema): Promise<void>[] {
    const promises: Promise<void>[] = [];
    switch (body.event) {
      case 'message':
        for (const { pattern, handler } of this.messageHandlers) {
          if (typeof pattern === 'string' ? pattern === body.payload.text : pattern.test(body.payload.text)) {
            promises.push(handler({
              ...body,
              client: this.client,
              respond: async (message: string | { message: { text: string } }) => {
                await this.client.webhookCallback(body, typeof message === 'string' ? {
                  message: {
                    text: message,
                  },
                } : {
                  message: message.message,
                });
              },
            }));
          }
        }
        break;
      case 'slash_command':
        for (const { pattern, handler } of this.commandHandlers) {
          if (typeof pattern === 'string' ? pattern === body.payload.command : pattern.test(body.payload.command)) {
            promises.push(handler(body));
          }
        }
        break;
      case 'connection.connected':
        for (const handler of this.connectionHandlers) {
          promises.push(handler(body));
        }
        break;
      case 'connection_user.connected':
        for (const handler of this.connectionUserHandlers) {
          promises.push(handler(body));
        }
        break;
      default:
        throw new Error(`Unknown webhook event: ${(body as any).event}`);
    }
    return promises;
  }
}

export type * from "@langburp/langburp-js";
export * from "./verify-webhook";
