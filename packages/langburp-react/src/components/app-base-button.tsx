"use client";

import { CSSProperties, ReactNode } from "react";

export interface AppBaseButtonProps {
  children: ReactNode;
  className?: string;
  providerKind: string;
  onClick?: (providerKind: string) => void | Promise<void>;
  style?: CSSProperties;
  size?: 'small' | 'default' | 'large';
  corners?: 'default' | 'maximum';
  iconOnly?: boolean;
}

export const getSizeStyles = (size: AppBaseButtonProps['size'], iconOnly = false) => {
  switch (size) {
    case 'small':
      return { height: '44px', width: iconOnly ? '44px' : '204px', fontSize: '14px' };
    case 'large':
      return { height: '56px', width: iconOnly ? '56px' : '276px', fontSize: '18px' };
    default:
      return { height: '48px', width: iconOnly ? '48px' : '236px', fontSize: '16px' };
  }
};

export const AppBaseButton = ({
  children,
  className,
  onClick,
  style,
  size = 'default',
  corners = 'default',
  iconOnly = false,
  providerKind,
}: AppBaseButtonProps) => {
  const baseStyles: CSSProperties = {
    alignItems: 'center',
    border: '1px solid',
    borderRadius: corners === 'default' ? '4px' : '56px',
    display: 'inline-flex',
    fontFamily: 'Lato, sans-serif',
    fontWeight: 600,
    justifyContent: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    ...getSizeStyles(size, iconOnly),
    ...style,
  };

  return (
    <button onClick={() => onClick?.(providerKind)} style={baseStyles} className={className}>
      {children}
    </button>
  );
};
