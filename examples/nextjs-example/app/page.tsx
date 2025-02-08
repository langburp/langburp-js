"use client";

import { useLangburpConnect } from "@langburp/react";
import { authorizeEndUserForLangburp } from "./_actions/langburp";
import { SlackButton, MsTeamsButton } from "@langburp/react";

export default function Home() {
  const { integrations, result, isLoading, connect } = useLangburpConnect({
    onAuthorize: async (state) => {
      const res = await authorizeEndUserForLangburp(state);
      return res;
    },
  });

  return (
    <div className={""} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
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
      
      <br/>
      <br/>

      <SlackButton
        onClick={() => connect('slack_app')}
        iconOnly={false}
        size="default"
        colorTheme="dark"
        corners="default"
      />

      <br/>
      <br/>

      <MsTeamsButton
        onClick={() => connect('ms_teams_app')}
        iconOnly={false}
        size="default"
        colorTheme="dark"
        corners="default"
      />
    </div>
  );
}
