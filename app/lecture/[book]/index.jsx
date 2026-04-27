import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BIBLE_STRUCTURE } from '../../../constants/bibleStructure';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import BottomTabBar from '../../../components/BottomTabBar';

const ALL_BOOKS_FLAT = [
  ...BIBLE_STRUCTURE.ancienTestament.categories.flatMap(c => c.livres),
  ...BIBLE_STRUCTURE.nouveauTestament.categories.flatMap(c => c.livres),
];

export default function ChapitresScreen() {
  const { book }    = useLocalSearchParams();
  const router      = useRouter();
  const { colors }  = useTheme();
  const { t, isFr } = useLanguage();

  const bookInfo = ALL_BOOKS_FLAT.find(b => b.abrev === book);

  // Nom du livre selon la langue
  const bookName = bookInfo
    ? (isFr ? bookInfo.nom : bookInfo.nomEn)
    : book;

  if (!bookInfo) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={styles.center}>
          <Ionicons name="book-outline" size={48} color={colors.textLight} />
          <Text style={{ color: colors.textSecondary, fontSize: 16, marginTop: 12 }}>
            {t.notFound}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.primary }]}
          >
            <View style={styles.backBtnRow}>
              <Ionicons name="arrow-back" size={15} color="#fff" />
              <Text style={styles.backBtnText}> {t.back}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <BottomTabBar />
      </SafeAreaView>
    );
  }

  const chapitres = Array.from({ length: bookInfo.chapitres }, (_, i) => i + 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{bookName}</Text>
          <Text style={styles.headerSub}>
            {t.chapters(bookInfo.chapitres)}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Titre section */}
        <View style={styles.sectionTitleRow}>
          <Ionicons name="list-outline" size={15} color={colors.textSecondary} />
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {'  '}{t.chooseChapter}
          </Text>
        </View>

        {/* Grille chapitres */}
        <View style={styles.grid}>
          {chapitres.map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.chapBtn, {
                backgroundColor: colors.surface,
                borderColor:     colors.border,
              }]}
              onPress={() => router.push(`/lecture/${book}/${num}`)}
            >
              <Text style={[styles.chapNum, { color: colors.primary }]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center:          { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:          { flexDirection: 'row', alignItems: 'center',
                     paddingTop: 14, paddingBottom: 14, paddingHorizontal: 12 },
  headerBack:      { width: 40, justifyContent: 'center' },
  headerCenter:    { flex: 1, alignItems: 'center' },
  headerTitle:     { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub:       { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  scroll:          { padding: 16, paddingBottom: 40 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center',
                     justifyContent: 'center', marginBottom: 16 },
  sectionTitle:    { fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  grid:            { flexDirection: 'row', flexWrap: 'wrap', gap: 10,
                     justifyContent: 'center' },
  chapBtn:         { width: 56, height: 56, borderRadius: 12, justifyContent: 'center',
                     alignItems: 'center', borderWidth: 1, shadowColor: '#000',
                     shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  chapNum:         { fontWeight: '700', fontSize: 18 },
  backBtn:         { marginTop: 20, paddingHorizontal: 24,
                     paddingVertical: 12, borderRadius: 10 },
  backBtnRow:      { flexDirection: 'row', alignItems: 'center' },
  backBtnText:     { color: '#fff', fontWeight: '600', fontSize: 15 },
});