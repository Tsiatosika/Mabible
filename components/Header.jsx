// components/Header.jsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export default function Header({
  title,
  subtitle,
  showBack = false,
  rightComponent = null,
}) {
  const router     = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      {showBack ? (
        <TouchableOpacity style={styles.side} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.side} />
      )}

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.side}>
        {rightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header:   { flexDirection: 'row', alignItems: 'center',
              paddingTop: 16, paddingBottom: 16, paddingHorizontal: 12 },
  side:     { width: 44, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 26 },
  center:   { flex: 1, alignItems: 'center' },
  title:    { color: '#fff', fontSize: 20, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
});