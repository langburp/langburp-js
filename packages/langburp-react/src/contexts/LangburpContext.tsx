import { createContext } from "react";

export interface LangburpContextType {
  publicApiKey: string;
}

export const LangburpContext = createContext<LangburpContextType>({
  publicApiKey: '',
}); 