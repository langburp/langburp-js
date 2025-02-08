"use client";

import { useLangburpConnect } from "@langburp/react";
import { authorizeEndUserForLangburp } from "./_actions/langburp";
import { usePathname, useSearchParams } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { integrations, result, isLoading, connect } = useLangburpConnect({
    currentUrl: `${window.location.origin}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
    onAuthorize: async (state) => {
      const res = await authorizeEndUserForLangburp(state);
      return res;
    },
  });

  return (
    <div className={""}>
      {!result && (<main className={""}>
        {integrations.map((integration) => (
          <button
            key={integration.id}
            className={""}
            onClick={() => connect(integration.id)}
          >
            Connect {integration.provider}
          </button>
        ))}
      </main>)}
      {result && result.success && (<main className={""}>
        <p>Connection successful</p>
        <p>Connection ID: {result.connectionId}</p>
        <p>Connection User ID: {result.connectionUserId}</p>
        <p>Open App URL: {result.openAppUrl}</p>
        <p>Open Browser URL: {result.openBrowserUrl}</p>
      </main>)}
      {result && !result.success && (<main className={""}>
        <p>An error occurred while connecting:</p>
        <p>{result.error}</p>
      </main>)}
    </div>
  );
}
