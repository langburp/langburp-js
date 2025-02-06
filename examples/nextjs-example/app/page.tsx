"use client";

import { useLangburpConnect } from "@langburp/react";
import { authorizeEndUserForLangburp } from "./_actions/langburp";

export default function Home() {
  const { integrations, isLoading, connect } = useLangburpConnect({
    onAuthorize: async (state) => {
      const res = await authorizeEndUserForLangburp(state);
      return res;
    },
  });

  return (
    <div className={""}>
      <main className={""}>
        {integrations.map((integration) => (
          <button
            key={integration.id}
            className={""}
            onClick={() => connect(integration.id)}
          >
            Connect {integration.provider}
          </button>
        ))}
      </main>
    </div>
  );
}
