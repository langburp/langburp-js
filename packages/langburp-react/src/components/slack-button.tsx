import React from 'react';
import { AppBaseButton, AppBaseButtonProps } from './app-base-button';
import { ProviderKinds } from '../utils/provider-metadata';
import { SlackIcon } from './icons';

export interface SlackButtonProps extends Omit<AppBaseButtonProps, 'children' | 'providerKind'> {
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

  return (
    <AppBaseButton
      providerKind={ProviderKinds.SlackApp}
      onClick={onClick}
      style={{ ...getThemeStyles(), ...style }}
      className={className}
      size={size}
      corners={corners}
      iconOnly={iconOnly}
    >
      <SlackIcon
        className={iconClassName}
        style={{
          height: size === 'small' ? '16px' : size === 'large' ? '24px' : '20px',
          width: size === 'small' ? '16px' : size === 'large' ? '24px' : '20px',
          marginRight: iconOnly ? '0' : '12px',
          ...iconStyle,
        }}
      />
      {!iconOnly && text}
    </AppBaseButton>
  );
};
