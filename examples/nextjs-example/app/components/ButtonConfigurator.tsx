import { useState } from 'react';
import { useTheme } from 'next-themes';

export type ButtonConfig = {
  iconOnly: boolean;
  size: 'small' | 'default' | 'large';
  corners: 'default' | 'maximum';
  slackColorTheme: 'light' | 'aubergine' | 'dark';
  teamsColorTheme: 'light' | 'dark';
};

type ButtonConfiguratorProps = {
  config: ButtonConfig;
  onChange: (config: ButtonConfig) => void;
};

export function ButtonConfigurator({ config, onChange }: ButtonConfiguratorProps) {
  const { theme, setTheme } = useTheme();
  const handleChange = (key: keyof ButtonConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="button-configurator" style={{ 
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      marginBottom: '20px',
      width: '100%',
      maxWidth: '320px',
      fontFamily: 'Lato, sans-serif',
    }}>
      <h3 style={{ 
        fontSize: '16px',
        fontWeight: 700,
        marginBottom: '20px'
      }}>Button Configuration</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ 
          fontSize: '14px',
          fontWeight: 700,
          marginBottom: '8px'
        }}>Page Theme</h4>
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="pageTheme"
            value="light"
            checked={theme === 'light'}
            onChange={(e) => setTheme(e.target.value)}
          />
          {' '}Light
        </label>
        <br />
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="pageTheme"
            value="dark"
            checked={theme === 'dark'}
            onChange={(e) => setTheme(e.target.value)}
          />
          {' '}Dark
        </label>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ 
          fontSize: '14px',
          fontWeight: 700,
          marginBottom: '8px'
        }}>Appearance</h4>
        <label style={{ fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={config.iconOnly}
            onChange={(e) => handleChange('iconOnly', e.target.checked)}
          />
          {' '}Icon only
        </label>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ 
          fontSize: '14px',
          fontWeight: 700,
          marginBottom: '8px'
        }}>Size</h4>
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="size"
            value="small"
            checked={config.size === 'small'}
            onChange={(e) => handleChange('size', e.target.value)}
          />
          {' '}Small
        </label>
        <br />
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="size"
            value="default"
            checked={config.size === 'default'}
            onChange={(e) => handleChange('size', e.target.value)}
          />
          {' '}Default
        </label>
        <br />
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="size"
            value="large"
            checked={config.size === 'large'}
            onChange={(e) => handleChange('size', e.target.value)}
          />
          {' '}Large
        </label>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ 
          fontSize: '14px',
          fontWeight: 700,
          marginBottom: '8px'
        }}>Corners</h4>
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="corners"
            value="default"
            checked={config.corners === 'default'}
            onChange={(e) => handleChange('corners', e.target.value)}
          />
          {' '}Default
        </label>
        <br />
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="corners"
            value="maximum"
            checked={config.corners === 'maximum'}
            onChange={(e) => handleChange('corners', e.target.value)}
          />
          {' '}Maximum
        </label>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ 
          fontSize: '14px',
          fontWeight: 700,
          marginBottom: '8px'
        }}>Slack Color Theme</h4>
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="slackColor"
            value="light"
            checked={config.slackColorTheme === 'light'}
            onChange={(e) => handleChange('slackColorTheme', e.target.value)}
          />
          {' '}Light
        </label>
        <br />
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="slackColor"
            value="dark"
            checked={config.slackColorTheme === 'dark'}
            onChange={(e) => handleChange('slackColorTheme', e.target.value)}
          />
          {' '}Dark
        </label>
        <br />
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="slackColor"
            value="aubergine"
            checked={config.slackColorTheme === 'aubergine'}
            onChange={(e) => handleChange('slackColorTheme', e.target.value)}
          />
          {' '}Aubergine
        </label>
      </div>

      <div>
        <h4 style={{ 
          fontSize: '14px',
          fontWeight: 700,
          marginBottom: '8px'
        }}>Teams Color Theme</h4>
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="teamsColor"
            value="light"
            checked={config.teamsColorTheme === 'light'}
            onChange={(e) => handleChange('teamsColorTheme', e.target.value)}
          />
          {' '}Light
        </label>
        <br />
        <label style={{ fontSize: '14px' }}>
          <input
            type="radio"
            name="teamsColor"
            value="dark"
            checked={config.teamsColorTheme === 'dark'}
            onChange={(e) => handleChange('teamsColorTheme', e.target.value)}
          />
          {' '}Dark
        </label>
      </div>
    </div>
  );
} 