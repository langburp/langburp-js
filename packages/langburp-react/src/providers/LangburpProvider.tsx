import React from "react";
import { withMaxAllowedInstancesGuard } from "../utils/useMaxAllowedInstances";
import { LangburpContext } from "../contexts/LangburpContext";
import type { LangburpContextType } from "../contexts/LangburpContext";

interface LangburpProviderProps extends LangburpContextType {
  children: React.ReactNode;
}

// Base provider component
const LangburpProviderBase = ({ children, publicApiKey, apiBaseUrl, onAuthorize }: LangburpProviderProps) => {
  return (
    <LangburpContext.Provider value={{ publicApiKey, apiBaseUrl, onAuthorize }}>
      {children}
    </LangburpContext.Provider>
  );
};

const multipleLangburpProvidersError = 
  "Multiple LangburpProvider instances detected. Only one instance can be used at a time.";

const LangburpProvider = withMaxAllowedInstancesGuard(
  LangburpProviderBase,
  'LangburpProvider',
  multipleLangburpProvidersError
);

LangburpProvider.displayName = 'LangburpProvider';

export { LangburpProvider }; 