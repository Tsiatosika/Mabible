// app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

function TabIcon({ emoji, label, focused, colors }) {
  return (
    <View style={styles.tabItem}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>
      <Text style={[styles.label, { color: focused ? colors.tabActive : colors.tabInactive }]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.tabBackground,
          borderTopColor: colors.border,
          height: 70,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Accueil" focused={focused} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="lire"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📖" label="Lire" focused={focused} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="rechercher"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔍" label="Rechercher" focused={focused} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoris"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔖" label="Favoris" focused={focused} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📅" label="Plan" focused={focused} colors={colors} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center' },
  label:   { fontSize: 10, marginTop: 2, fontWeight: '600' },
});