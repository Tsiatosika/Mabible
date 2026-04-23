// context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSettings, saveSettings } from '../utils/storage';

const ThemeContext = createContext();

export const THEMES = {
  light: {
    primary:        '#6B2D0E',
    primaryLight:   '#8B3A0F',
    background:     '#FAF6F0',
    surface:        '#FFFFFF',
    surfaceWarm:    '#F5EDE0',
    textPrimary:    '#1A0A00',
    textSecondary:  '#6B5B4E',
    textLight:      '#9C8878',
    textOnPrimary:  '#FFFFFF',
    accent:         '#C97C2E',
    accentLight:    '#F0C070',
    favorite:       '#FFF3C4',
    favoriteBorder: '#F0C070',
    border:         '#E8DDD0',
    divider:        '#EDE5D8',
    placeholder:    '#B0A090',
    tabBackground:  '#FFFFFF',
    tabActive:      '#6B2D0E',
    tabInactive:    '#9C8878',
  },
  dark: {
    primary:        '#8B3A0F',
    primaryLight:   '#A04A1F',
    background:     '#1A1210',
    surface:        '#2A1F1C',
    surfaceWarm:    '#231814',
    textPrimary:    '#F5EDE0',
    textSecondary:  '#C4A882',
    textLight:      '#8B7355',
    textOnPrimary:  '#FFFFFF',
    accent:         '#D4923E',
    accentLight:    '#F0C070',
    favorite:       '#3D2E00',
    favoriteBorder: '#8B6914',
    border:         '#3D2A22',
    divider:        '#2E1E18',
    placeholder:    '#6B5040',
    tabBackground:  '#1A1210',
    tabActive:      '#D4923E',
    tabInactive:    '#6B5040',
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