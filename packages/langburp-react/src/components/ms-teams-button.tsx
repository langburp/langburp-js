import React from 'react';
import { AppBaseButton, AppBaseButtonProps } from './app-base-button';
import { ProviderKinds } from '../utils/provider-metadata';
import { MsTeamsIcon } from './icons';

export interface MsTeamsButtonProps extends Omit<AppBaseButtonProps, 'children' | 'providerKind'> {
  colorTheme?: 'light' | 'dark';
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
  text?: string;
}

export const MsTeamsButton: React.FC<MsTeamsButtonProps> = ({
  iconOnly = false,
  size = 'default',
  colorTheme = 'light',
  corners = 'default',
  onClick,
  className,
  style,
  iconClassName,
  iconStyle,
  text = 'Add to Teams',
}) => {
  const getThemeStyles = () => {
    return colorTheme === 'light'
      ? { backgroundColor: '#fff', color: '#000', borderColor: '#ddd' }
      : { backgroundColor: '#292929', color: '#fff', borderColor: '#616161' };
  };

  return (
    <AppBaseButton
      providerKind={ProviderKinds.MsTeamsApp}
      onClick={onClick}
      style={{ ...getThemeStyles(), ...style }}
      className={className}
      size={size}
      corners={corners}
      iconOnly={iconOnly}
    >
      <MsTeamsIcon
        className={iconClassName}
        style={{
          height: size === 'small' ? '22px' : size === 'large' ? '30px' : '26px',
          width: size === 'small' ? '22px' : size === 'large' ? '30px' : '26px',
          marginRight: iconOnly ? '0' : '12px',
          position: 'relative',
          top: '0px',
          left: iconOnly ? '0px' : '3px',
          ...iconStyle,
        }}
      />
      {!iconOnly && text}
    </AppBaseButton>
  );
}; 