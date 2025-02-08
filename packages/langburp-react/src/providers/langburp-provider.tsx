import React from "react";
import { withMaxAllowedInstancesGuard } from "../utils/use-max-allowed-instances";
import { LangburpContext } from "../contexts/langburp-context";
import type { LangburpContextType } from "../contexts/langburp-context";

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

// TODO Fix this causes type errors with React 18 in local testing
// const multipleLangburpProvidersError = 
//   "Multiple LangburpProvider instances detected. Only one instance can be used at a time.";

// const LangburpProvider = withMaxAllowedInstancesGuard(
//   LangburpProviderBase,
//   'LangburpProvider',
//   multipleLangburpProvidersError
// );

// LangburpProvider.displayName = 'LangburpProvider';

// export { LangburpProvider }; 

export { LangburpProviderBase as LangburpProvider };
