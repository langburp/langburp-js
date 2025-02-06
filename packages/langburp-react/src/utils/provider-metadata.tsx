import { PiMicrosoftTeamsLogo, PiSlackLogo } from "react-icons/pi";

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}

export const ProviderIcons: Record<string, React.FC<IconBaseProps>> = {
  slack_app: PiSlackLogo,
  ms_teams_app: PiMicrosoftTeamsLogo,
}

export const ProviderKinds = {
  SlackApp: 'slack_app',
  MsTeamsApp: 'ms_teams_app',
} as const

export const ProviderKindDisplayNames: { [key: string]: string } = {
  slack_app: 'Slack',
  ms_teams_app: 'Teams',
}
