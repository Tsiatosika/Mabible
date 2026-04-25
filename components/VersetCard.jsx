// components/VersetCard.jsx
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function VersetCard({
  book,
  chapter,
  verse,
  text,
  isFavorite,
  onPress,
  onLongPress,
  fontSize = 16,
}) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.row,
        isFavorite && {
          backgroundColor: colors.favorite,
          borderLeftWidth: 3,
          borderLeftColor: colors.favoriteBorder,
        },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.num, { color: colors.accent }]}>{verse}</Text>
      <Text style={[styles.text, { fontSize, color: colors.textPrimary }]}>
        {text}
      </Text>
      {isFavorite && <Text style={styles.icon}>🔖</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row:  { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 6,
          borderRadius: 8, marginBottom: 4 },
  num:  { fontWeight: '700', fontSize: 13, width: 28, marginTop: 2 },
  text: { flex: 1, lineHeight: 26, fontFamily: 'serif' },
  icon: { fontSize: 14, marginLeft: 6, marginTop: 4 },
});