  import { createContext, useContext, useState, useEffect, useCallback } from 'react';
  import { getSettings, saveSettings } from '../utils/storage';

  const ThemeContext = createContext();

  export const THEMES = {
    light: {
      primary         : '#1E3A5F',
      primaryLight    : '#1D4ED8',
      primaryDark     : '#172D4A',
      background      : '#F5F8FF',
      surface         : '#FFFFFF',
      surfaceWarm     : '#EFF6FF',
      textPrimary     : '#0D1F3C',
      textSecondary   : '#2D4A7A',
      textLight       : '#6E8CB8',
      textOnPrimary   : '#FFFFFF',
      accent          : '#3B82F6',
      accentLight     : '#BFDBFE',
      favorite        : '#DBEAFE',
      favoriteBorder  : '#60A5FA',
      border          : '#DBEAFE',
      divider         : '#E8F2FF',
      placeholder     : '#93AECE',
      tabBackground   : '#FFFFFF',
      tabActive       : '#1E3A5F',
      tabInactive     : '#6E8CB8',
    },
    dark: {
      primary         : '#1D4ED8',
      primaryLight    : '#3B82F6',
      primaryDark     : '#1E3A5F',
      background      : '#060D1F',
      surface         : '#0D1A35',
      surfaceWarm     : '#0A1528',
      textPrimary     : '#DBEAFE',
      textSecondary   : '#60A5FA',
      textLight       : '#2D4A7A',
      textOnPrimary   : '#FFFFFF',
      accent          : '#60A5FA',
      accentLight     : '#3B82F6',
      favorite        : '#0C1D4D',
      favoriteBorder  : '#1D4ED8',
      border          : '#1A2E5C',
      divider         : '#101E3D',
      placeholder     : '#2D4A7A',
      tabBackground   : '#060D1F',
      tabActive       : '#60A5FA',
      tabInactive     : '#2D4A7A',
    },
  };

  export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(false);
    const colors = isDark ? THEMES.dark : THEMES.light;

    useEffect(() => {
      getSettings().then(s => setIsDark(s.theme === 'dark'));
    }, []);

    const toggleTheme = useCallback(async () => {
      const newVal = !isDark;
      setIsDark(newVal);
      const s = await getSettings();
      await saveSettings({ ...s, theme: newVal ? 'dark' : 'light' });
    }, [isDark]);

    return (
      <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  export function useTheme() {
    return useContext(ThemeContext);
  }