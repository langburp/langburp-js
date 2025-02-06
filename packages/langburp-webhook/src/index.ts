import type {
  WebhookMessageReceivedBodySchema,
  WebhookSlashCommandReceivedBodySchema,
  WebhookConnectionConnectedBodySchema,
  WebhookConnectionUserConnectedBodySchema,
  WebhookRequestBodySchema
} from "@langburp/langburp-js";

import { verifyLangburpWebhook } from "./verify-webhook";

export type WebhookHandlers = {
  onMessage?: (event: WebhookMessageReceivedBodySchema) => Promise<void> | void;
  onSlashCommand?: (event: WebhookSlashCommandReceivedBodySchema) => Promise<void> | void;
  onConnectionConnected?: (event: WebhookConnectionConnectedBodySchema) => Promise<void> | void;
  onConnectionUserConnected?: (event: WebhookConnectionUserConnectedBodySchema) => Promise<void> | void;
};

export class LangburpWebhook {
  private handlers: WebhookHandlers;

  constructor(handlers: WebhookHandlers) {
    this.handlers = handlers;
  }

  async handleWebhook(body: WebhookRequestBodySchema): Promise<void> {
    switch (body.event) {
      case 'message':
        if (this.handlers.onMessage) {
          await this.handlers.onMessage(body);
        }
        break;
      case 'slash_command':
        if (this.handlers.onSlashCommand) {
          await this.handlers.onSlashCommand(body);
        }
        break;
      case 'connection.connected':
        if (this.handlers.onConnectionConnected) {
          await this.handlers.onConnectionConnected(body);
        }
        break;
      case 'connection_user.connected':
        if (this.handlers.onConnectionUserConnected) {
          await this.handlers.onConnectionUserConnected(body);
        }
        break;
      default:
        throw new Error(`Unhandled webhook event: ${(body as any).event}`);
    }
  }

  static createHandler(handlers: WebhookHandlers) {
    const webhook = new LangburpWebhook(handlers);
    return async (body: WebhookRequestBodySchema) => {
      await webhook.handleWebhook(body);
    };
  }
}

export type * from "@langburp/langburp-js"; 