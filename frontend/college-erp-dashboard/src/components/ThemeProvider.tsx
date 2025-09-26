import React, { createContext, useContext, useEffect, useState } from 'react';

// Theme types
export type Theme = 'light' | 'dark' | 'system';
export type Role = 'admin' | 'faculty' | 'student';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  role: Role;
  setRole: (role: Role) => void;
  actualTheme: 'light' | 'dark'; // resolved theme (system preference resolved)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultRole?: Role;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultRole = 'admin'
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const [role, setRole] = useState<Role>(defaultRole);

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateActualTheme = () => {
      const resolved = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      setActualTheme(resolved);

      // Apply to document root
      document.documentElement.setAttribute('data-color-scheme', resolved);
      document.documentElement.setAttribute('data-role', role);
    };

    updateActualTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateActualTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, role]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, role, setRole, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
