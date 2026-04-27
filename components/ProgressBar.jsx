import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ProgressBar({ value = 0, max = 100, showLabel = true }) {
  const { colors }  = useTheme();
  const pourcentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <View style={styles.container}>
      <View style={[styles.bg, { backgroundColor: colors.border }]}>
        <View style={[styles.fill, {
          backgroundColor: colors.primary,
          width: `${pourcentage}%`,
        }]} />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {value}/{max} — {pourcentage}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  bg:        { height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 6 },
  fill:      { height: 10, borderRadius: 5 },
  label:     { fontSize: 12, textAlign: 'center' },
});