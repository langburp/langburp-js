import React from 'react';
import { AppBaseButton, AppBaseButtonProps } from './app-base-button';

export interface SlackButtonProps extends Omit<AppBaseButtonProps, 'children'> {
  colorTheme?: 'light' | 'aubergine' | 'dark';
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
  text?: string;
}

export const SlackButton: React.FC<SlackButtonProps> = ({
  iconOnly = false,
  size = 'default',
  colorTheme = 'light',
  corners = 'default',
  onClick,
  className,
  style,
  iconClassName,
  iconStyle,
  text = 'Add to Slack',
}) => {
  const getThemeStyles = () => {
    return colorTheme === 'light'
      ? { backgroundColor: '#fff', color: '#000', borderColor: '#ddd' }
      : colorTheme === 'dark'
        ? { backgroundColor: '#292929', color: '#fff', borderColor: '#616161' }
        : { backgroundColor: '#4A154B', color: '#fff', borderColor: '#4A154B' };
  };

  const SlackIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={iconClassName}
      style={{
        height: size === 'small' ? '16px' : size === 'large' ? '24px' : '20px',
        width: size === 'small' ? '16px' : size === 'large' ? '24px' : '20px',
        marginRight: iconOnly ? '0' : '12px',
        ...iconStyle,
      }}
      viewBox="0 0 122.8 122.8"
    >
      <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a" />
      <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0" />
      <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d" />
      <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e" />
    </svg>
  );

  return (
    <AppBaseButton
      onClick={onClick}
      style={{ ...getThemeStyles(), ...style }}
      className={className}
      size={size}
      corners={corners}
      iconOnly={iconOnly}
    >
      <SlackIcon />
      {!iconOnly && text}
    </AppBaseButton>
  );
};
