import { createHmac, timingSafeEqual } from 'node:crypto';

const verifyErrorPrefix = 'Failed to verify webhook authenticity';

export type LangburpWebhookVerificationHeaders = {
  'x-webhook-signature'?: string;
  'x-webhook-timestamp'?: string;
  'x-webhook-version'?: string;
} | {
  get(name: string): string | null | undefined;
};

export interface LangburpWebhookVerificationOptions {
  signingSecret: string;
  body: string;
  headers: LangburpWebhookVerificationHeaders;
  nowSeconds?: number;
}

/**
 * Verifies the signature of an incoming webhook from Langburp.
 * If the webhook is invalid, this method throws an exception with the error details.
 */
export function mustVerifyLangburpWebhook(options: LangburpWebhookVerificationOptions): void {
  const timestamp = 'get' in options.headers ? options.headers.get('x-webhook-timestamp') : options.headers['x-webhook-timestamp'];
  const signature = 'get' in options.headers ? options.headers.get('x-webhook-signature') : options.headers['x-webhook-signature'];
  const version = 'get' in options.headers ? options.headers.get('x-webhook-version') : options.headers['x-webhook-version'];

  if (!timestamp || !signature || !version) {
    throw new Error(`${verifyErrorPrefix}: missing required headers`);
  }

  // Validate version
  if (version !== '1.0') {
    throw new Error(`${verifyErrorPrefix}: unsupported webhook version ${version}`);
  }

  // Parse timestamp
  const timestampSec = parseInt(timestamp, 10);
  if (Number.isNaN(timestampSec)) {
    throw new Error(
      `${verifyErrorPrefix}: header x-webhook-timestamp was not a valid number (${timestamp})`
    );
  }

  // Calculate time-dependent values
  const nowSec = options.nowSeconds ?? Math.floor(Date.now() / 1000);
  const maxDeltaMin = 5;
  const fiveMinutesAgoSec = nowSec - (60 * maxDeltaMin);

  // Check for stale requests
  if (timestampSec < fiveMinutesAgoSec) {
    throw new Error(
      `${verifyErrorPrefix}: x-webhook-timestamp must differ from current time by no more than ${maxDeltaMin} minutes`
    );
  }

  // Separate parts of signature
  const [signatureVersion, signatureHash] = signature.split('=');

  // Validate signature version
  if (signatureVersion !== 'v1') {
    throw new Error(`${verifyErrorPrefix}: unsupported signature version ${signatureVersion}`);
  }

  // Create signature base string using version, timestamp and body
  const sigBaseString = `v1:${timestamp}:${options.body}`;

  // Generate HMAC SHA-256 signature
  const expectedSignature = createHmac('sha256', options.signingSecret)
    .update(sigBaseString)
    .digest('hex');

  // Compare signatures using constant-time comparison
  if (!signatureHash || !timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedSignature))) {
    throw new Error(`${verifyErrorPrefix}: signature mismatch`);
  }
}

/**
 * Verifies the signature of an incoming webhook from Langburp.
 * If the webhook is invalid, this method returns false.
 */
export function isVerifiedLangburpWebhook(options: LangburpWebhookVerificationOptions): boolean {
  try {
    mustVerifyLangburpWebhook(options);
    return true;
  } catch (error) {
    console.debug(`Webhook signature verification error: ${error}`);
    return false;
  }
}
