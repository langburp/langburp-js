"use client";

import { useLangburpConnect } from "@langburp/react";
import { authorizeEndUserForLangburp } from "./_actions/langburp";
import { SlackButton, MsTeamsButton } from "@langburp/react";
import { ButtonConfigurator, type ButtonConfig } from "./components/ButtonConfigurator";
import { useState } from "react";
import styles from './styles/Home.module.css';

export default function Home() {
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>({
    iconOnly: false,
    size: 'default',
    corners: 'default',
    slackColorTheme: 'light',
    teamsColorTheme: 'light'
  });

  const { slackIntegration, msTeamsIntegration, result, connect } = useLangburpConnect({
    onAuthorize: async (state) => {
      const res = await authorizeEndUserForLangburp(state);
      return res;
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.configLayout}>
        <ButtonConfigurator
          config={buttonConfig}
          onChange={setButtonConfig}
        />

        <div className={styles.buttonContainer}>
          {result && result.success && (<div className={""}>
            <p>Connection successful</p>
            <p>Connection ID: {result.connectionId}</p>
            <p>Connection User ID: {result.connectionUserId}</p>
            <p>Open App URL: {result.openAppUrl}</p>
            <p>Open Browser URL: {result.openBrowserUrl}</p>
          </div>)}

          {result && !result.success && (<div className={""}>
            <p>An error occurred while connecting:</p>
            <p>{result.error}</p>
          </div>)}

          {slackIntegration && (<SlackButton
            onClick={connect}
            iconOnly={buttonConfig.iconOnly}
            size={buttonConfig.size}
            colorTheme={buttonConfig.slackColorTheme}
            corners={buttonConfig.corners}
          />)}

          {msTeamsIntegration && (<MsTeamsButton
            onClick={connect}
            iconOnly={buttonConfig.iconOnly}
            size={buttonConfig.size}
            colorTheme={buttonConfig.teamsColorTheme}
            corners={buttonConfig.corners}
          />)}

          {!slackIntegration && !msTeamsIntegration && (<div className={""}>
            <p>No integrations found. Please check your Langburp project to make sure you have at least one integration configured and in the "Ready" state.</p>

            <br />
            <br />
            <p>To learn how to get started, please refer to the <a href="https://langburp.com/docs" target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 500 }}>Langburp docs</a>.</p>
          </div>)}
        </div>
      </div>
    </div>
  );
}
