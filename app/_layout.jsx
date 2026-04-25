import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '../context/ThemeContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider>
      <StatusBar style="light" backgroundColor="#6B2D0E" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="lecture/[book]/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="lecture/[book]/[chapter]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="parametres"
          options={{ headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}