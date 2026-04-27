import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function BottomTabBar() {
  const router     = useRouter();
  const pathname   = usePathname();
  const { colors } = useTheme();
  const { t }      = useLanguage();

  // Onglets avec labels traduits dynamiquement
  const TABS = [
    { label: t.home,      icon: 'home-outline',     iconActive: 'home',      route: '/'           },
    { label: t.read,      icon: 'book-outline',     iconActive: 'book',      route: '/lire'       },
    { label: t.search,    icon: 'search-outline',   iconActive: 'search',    route: '/rechercher' },
    { label: t.favorites, icon: 'bookmark-outline', iconActive: 'bookmark',  route: '/favoris'    },
    { label: t.plan,      icon: 'calendar-outline', iconActive: 'calendar',  route: '/plan'       },
  ];

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
              color:      active ? colors.tabActive : colors.tabInactive,
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
  bar: { flexDirection: 'row', borderTopWidth: 1,
         height: 70, paddingBottom: 8, paddingTop: 6 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, marginTop: 3 },
});