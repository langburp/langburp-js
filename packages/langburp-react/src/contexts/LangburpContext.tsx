import { createContext } from "react";
import type { AuthorizeEndUserSuccessResponseSchema } from "@langburp/langburp-js";

export interface LangburpContextType {
  publicApiKey: string;
  onAuthorize?: (state?: string) => Promise<AuthorizeEndUserSuccessResponseSchema>;

  apiBaseUrl?: string;
  currentUrl?: string;
}

export const LangburpContext = createContext<LangburpContextType | null>(null);
