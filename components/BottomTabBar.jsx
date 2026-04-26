// components/BottomTabBar.jsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { label: 'Accueil',    icon: 'home',          iconActive: 'home',           route: '/'          },
  { label: 'Lire',       icon: 'book-outline',  iconActive: 'book',           route: '/lire'       },
  { label: 'Rechercher', icon: 'search-outline',iconActive: 'search',         route: '/rechercher' },
  { label: 'Favoris',   icon: 'bookmark-outline',iconActive: 'bookmark',      route: '/favoris'    },
  { label: 'Plan',       icon: 'calendar-outline',iconActive: 'calendar',     route: '/plan'       },
];

export default function BottomTabBar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  function isActive(route) {
    if (route === '/') return pathname === '/' || pathname === '/index';
    return pathname.startsWith(route);
  }

  return (
    <View style={[styles.bar, {
      backgroundColor: colors.tabBackground,
      borderTopColor:  colors.border,
    }]}>
      {TABS.map(tab => {
        const active = isActive(tab.route);
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            onPress={() => router.push(tab.route)}
          >
            <Ionicons
              name={active ? tab.iconActive : tab.icon}
              size={24}
              color={active ? colors.tabActive : colors.tabInactive}
            />
            <Text style={[styles.label, {
              color: active ? colors.tabActive : colors.tabInactive,
              fontWeight: active ? '700' : '500',
            }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar:   { flexDirection: 'row', borderTopWidth: 1,
           height: 70, paddingBottom: 8, paddingTop: 6 },
  tab:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, marginTop: 3 },
});