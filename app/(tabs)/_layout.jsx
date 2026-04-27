import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function TabIcon({ iconName, iconActive, label, focused, colors }) {
  return (
    <View style={styles.tabItem}>
      <Ionicons
        name={focused ? iconActive : iconName}
        size={24}
        color={focused ? colors.tabActive : colors.tabInactive}
      />
      <Text style={[styles.label, {
        color:      focused ? colors.tabActive : colors.tabInactive,
        fontWeight: focused ? '700' : '500',
      }]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t }      = useLanguage();

  const TAB_BAR_STYLE = {
    backgroundColor: colors.tabBackground,
    borderTopColor:  colors.border,
    height:          70,
    paddingBottom:   8,
    paddingTop:      6,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown:    false,
        tabBarShowLabel:false,
        tabBarStyle:    TAB_BAR_STYLE,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="home-outline"
              iconActive="home"
              label={t.home}
              focused={focused}
              colors={colors}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="lire"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="book-outline"
              iconActive="book"
              label={t.read}
              focused={focused}
              colors={colors}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rechercher"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="search-outline"
              iconActive="search"
              label={t.search}
              focused={focused}
              colors={colors}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favoris"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="bookmark-outline"
              iconActive="bookmark"
              label={t.favorites}
              focused={focused}
              colors={colors}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconName="calendar-outline"
              iconActive="calendar"
              label={t.plan}
              focused={focused}
              colors={colors}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  label:   { fontSize: 10, marginTop: 3 },
});