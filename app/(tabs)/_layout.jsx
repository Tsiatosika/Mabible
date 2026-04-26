// app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const TAB_ICONS = {
  index:      { icon: 'home-outline',     iconActive: 'home'           },
  lire:       { icon: 'book-outline',     iconActive: 'book'           },
  rechercher: { icon: 'search-outline',   iconActive: 'search'         },
  favoris:    { icon: 'bookmark-outline', iconActive: 'bookmark'       },
  plan:       { icon: 'calendar-outline', iconActive: 'calendar'       },
};

function TabIcon({ name, focused, color, label }) {
  return (
    <View style={styles.tabItem}>
      <Ionicons name={name} size={24} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
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
      {[
        { name: 'index',      label: 'Accueil'    },
        { name: 'lire',       label: 'Lire'       },
        { name: 'rechercher', label: 'Rechercher' },
        { name: 'favoris',    label: 'Favoris'    },
        { name: 'plan',       label: 'Plan'       },
      ].map(({ name, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                name={focused ? TAB_ICONS[name].iconActive : TAB_ICONS[name].icon}
                focused={focused}
                color={focused ? colors.tabActive : colors.tabInactive}
                label={label}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center' },
  label:   { fontSize: 10, marginTop: 2, fontWeight: '600' },
});