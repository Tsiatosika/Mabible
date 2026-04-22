import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>
      <Text style={[styles.label, { color: focused ? '#6B2D0E' : '#9C8878' }]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: styles.bar }}>
      <Tabs.Screen name="index"      options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Accueil"    focused={focused} /> }} />
      <Tabs.Screen name="lire"       options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📖" label="Lire"       focused={focused} /> }} />
      <Tabs.Screen name="rechercher" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" label="Rechercher" focused={focused} /> }} />
      <Tabs.Screen name="favoris"    options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔖" label="Favoris"    focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar:      { backgroundColor: '#fff', borderTopColor: '#E8DDD0', height: 70, paddingBottom: 8 },
  tabItem:  { alignItems: 'center' },
  label:    { fontSize: 10, marginTop: 2, fontWeight: '600' },
});