// components/BottomTabBar.jsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const TABS = [
  { label: 'Accueil',    emoji: '🏠', route: '/'           },
  { label: 'Lire',       emoji: '📖', route: '/lire'        },
  { label: 'Rechercher', emoji: '🔍', route: '/rechercher'  },
  { label: 'Favoris',    emoji: '🔖', route: '/favoris'     },
  { label: 'Plan',       emoji: '📅', route: '/plan'        },
];

export default function BottomTabBar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  // Détecter l'onglet actif
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
            <Text style={[styles.emoji, { opacity: active ? 1 : 0.4 }]}>
              {tab.emoji}
            </Text>
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
  emoji: { fontSize: 20 },
  label: { fontSize: 10, marginTop: 2 },
});