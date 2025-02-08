import React from 'react';

export interface SlackButtonProps {
  iconOnly?: boolean;
  size?: 'small' | 'default' | 'large';
  colorTheme?: 'light' | 'aubergine';
  corners?: 'default' | 'maximum';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
}

export const SlackButton: React.FC<SlackButtonProps> = ({
  iconOnly = false,
  size = 'small',
  colorTheme = 'light',
  corners = 'default',
  onClick,
  className,
  style,
  iconClassName,
  iconStyle,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { height: '44px', width: iconOnly ? '44px' : '204px', fontSize: '14px' };
      case 'large':
        return { height: '56px', width: iconOnly ? '56px' : '276px', fontSize: '18px' };
      default:
        return { height: '48px', width: iconOnly ? '48px' : '236px', fontSize: '16px' };
    }
  };

  const getThemeStyles = () => {
    return colorTheme === 'light'
      ? { backgroundColor: '#fff', color: '#000', borderColor: '#ddd' }
      : { backgroundColor: '#4A154B', color: '#fff', borderColor: '#4A154B' };
  };

  const baseStyles: React.CSSProperties = {
    alignItems: 'center',
    border: '1px solid',
    borderRadius: corners === 'default' ? '4px' : '56px',
    display: 'inline-flex',
    fontFamily: 'Lato, sans-serif',
    fontWeight: 600,
    justifyContent: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    ...getSizeStyles(),
    ...getThemeStyles(),
    ...style,
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
    <button onClick={onClick} style={baseStyles} className={className}>
      <SlackIcon />
      {!iconOnly && 'Add to Slack'}
    </button>
  );
};
