import { createContext } from "react";
import type { AuthorizeEndUserSuccessResponse } from "@langburp/langburp-js";

export interface LangburpContextType {
  publicApiKey: string;
  onAuthorize?: (state?: string) => Promise<AuthorizeEndUserSuccessResponse>;

  apiBaseUrl?: string;
}

export const LangburpContext = createContext<LangburpContextType | null>(null);
