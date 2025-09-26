import React from 'react';
import { useTheme, Theme } from './ThemeProvider';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const handleToggle = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '🖥️';
      default: return '☀️';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'Light';
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="theme-toggle"
      title={`Current: ${getThemeLabel()} (${actualTheme})`}
      aria-label={`Toggle theme (current: ${getThemeLabel()})`}
    >
      <span className="theme-icon" role="img" aria-hidden="true">
        {getThemeIcon()}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggle;
