import 'server-only';
import { LangburpClient } from '@langburp/langburp-js';

if (!process.env.NEXT_PUBLIC_LANGBURP_PUBLIC_API_KEY) {
  throw new Error('NEXT_PUBLIC_LANGBURP_PUBLIC_API_KEY is not set');
}

if (!process.env.LANGBURP_SECRET_API_KEY) {
  throw new Error('LANGBURP_SECRET_API_KEY is not set');
}

const langburpClient = new LangburpClient({
  publicApiKey: process.env.NEXT_PUBLIC_LANGBURP_PUBLIC_API_KEY,
  secretApiKey: process.env.LANGBURP_SECRET_API_KEY,
  apiBaseUrl: process.env.NEXT_PUBLIC_LANGBURP_API_BASE_URL,
})

// TODO User and org data
export const authorizeEndUser = async (state?: string) => {
  return await langburpClient.endUserAuth.authorizeEndUser({
    authorizeEndUserSchema: {
      state,
    },
  });
};
