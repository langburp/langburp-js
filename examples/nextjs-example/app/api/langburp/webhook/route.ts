import { NextResponse } from 'next/server';
import { LangburpWebhookResponder } from '@langburp/webhook';

export async function POST(request: Request) {
  // Get the raw body text for signature verification
  const rawBody = await request.text();

  const responder = new LangburpWebhookResponder({
    secretApiKey: process.env.LANGBURP_SECRET_API_KEY!,
    publicApiKey: process.env.NEXT_PUBLIC_LANGBURP_PUBLIC_API_KEY!,
    apiBaseUrl: process.env.NEXT_PUBLIC_LANGBURP_API_BASE_URL!,
  });

  responder.message(/.*/, async ({ payload, respond }) => {
    console.log('Message received:', payload.text);
    await respond('Hello!');
  });

  try {
    // Parse, verify, and handle the webhook
    await responder.handle({
      rawBody,
      headers: request.headers
    });

    // Return a 200 response to Langburp to confirm receipt of the webhook
    return NextResponse.json({ message: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);

    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
