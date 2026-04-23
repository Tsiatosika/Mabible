// app/lecture/[book]/index.jsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BIBLE_STRUCTURE } from '../../../constants/bibleStructure';
import Colors from '../../../constants/colors';

const ALL_BOOKS_FLAT = [
  ...BIBLE_STRUCTURE.ancienTestament.categories.flatMap(c => c.livres),
  ...BIBLE_STRUCTURE.nouveauTestament.categories.flatMap(c => c.livres),
];

export default function ChapitresScreen() {
  const { book } = useLocalSearchParams();
  const router   = useRouter();

  const bookInfo = ALL_BOOKS_FLAT.find(b => b.abrev === book);

  if (!bookInfo) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Livre introuvable</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const chapitres = Array.from({ length: bookInfo.chapitres }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{bookInfo.nom}</Text>
          <Text style={styles.headerSub}>{bookInfo.chapitres} chapitres</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Choisissez un chapitre</Text>
        <View style={styles.grid}>
          {chapitres.map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.chapBtn}
              onPress={() => router.push(`/lecture/${book}/${num}`)}
            >
              <Text style={styles.chapNum}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.background },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText:    { color: Colors.textSecondary, fontSize: 16, marginBottom: 16 },

  header:       { backgroundColor: Colors.primary, flexDirection: 'row',
                  alignItems: 'center', paddingTop: 14, paddingBottom: 14,
                  paddingHorizontal: 12 },
  headerBack:   { width: 40, justifyContent: 'center' },
  headerBackText:{ color: '#fff', fontSize: 24 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub:    { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },

  scroll:       { padding: 16, paddingBottom: 40 },
  sectionTitle: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600',
                  marginBottom: 16, textAlign: 'center', letterSpacing: 1 },

  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10,
                  justifyContent: 'center' },
  chapBtn:      { width: 56, height: 56, borderRadius: 12,
                  backgroundColor: Colors.surface, justifyContent: 'center',
                  alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
                  shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4,
                  elevation: 2 },
  chapNum:      { color: Colors.primary, fontWeight: '700', fontSize: 18 },

  backBtn:      { backgroundColor: Colors.primary, paddingHorizontal: 24,
                  paddingVertical: 12, borderRadius: 10 },
  backBtnText:  { color: '#fff', fontWeight: '600', fontSize: 15 },
});