import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function EmptyState({
  emoji = '📖',
  title,
  subtitle,
  buttonLabel,
  onButtonPress,
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textLight }]}>{subtitle}</Text>
      )}
      {buttonLabel && onButtonPress && (
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={onButtonPress}
        >
          <Text style={styles.btnText}>{buttonLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
  emoji:     { fontSize: 56, marginBottom: 16 },
  title:     { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle:  { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  btn:       { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  btnText:   { color: '#fff', fontWeight: '700', fontSize: 15 },
});