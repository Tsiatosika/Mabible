import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Modal, Pressable, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBible } from '../../../hooks/useBible';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { saveLastPosition, addToHistory } from '../../../utils/storage';
import { BIBLE_STRUCTURE } from '../../../constants/bibleStructure';
import Colors from '../../../constants/colors';

// Liste plate de tous les livres dans l'ordre biblique
const ALL_BOOKS_FLAT = [
  ...BIBLE_STRUCTURE.ancienTestament.categories.flatMap(c => c.livres),
  ...BIBLE_STRUCTURE.nouveauTestament.categories.flatMap(c => c.livres),
];

export default function LectureScreen() {
  const { book, chapter }         = useLocalSearchParams();
  const router                    = useRouter();
  const { getChapter, loading }   = useBible();
  const { toggle, isFavorite }    = useBookmarks();

  const [chapData,    setChapData]    = useState(null);
  const [bookInfo,    setBookInfo]    = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [fontSize,    setFontSize]    = useState(17);

  const chapterNum = Number(chapter);

  useEffect(() => {
    // Trouver les infos du livre
    const info = ALL_BOOKS_FLAT.find(b => b.abrev === book);
    setBookInfo(info || null);

    // Charger le chapitre
    const data = getChapter(book, chapterNum);
    setChapData(data);

    // Sauvegarder position + historique
    if (info) {
      saveLastPosition(info.nom, chapterNum);
      addToHistory(info.nom, chapterNum);
    }
  }, [book, chapter]);

  function goChapter(delta) {
    const newChap = chapterNum + delta;
    if (!bookInfo) return;
    if (newChap < 1 || newChap > bookInfo.chapitres) return;
    router.replace(`/lecture/${book}/${newChap}`);
  }

  function handleToggleFavorite(verset) {
    if (!bookInfo || !chapData) return;
    toggle({
      id:        `${book}-${chapterNum}-${verset.numero}`,
      book:      bookInfo.nom,
      bookAbrev: book,
      chapter:   chapterNum,
      verse:     verset.numero,
      text:      verset.texte,
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!chapData) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Chapitre introuvable</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{bookInfo?.nom || book}</Text>
          <Text style={styles.headerSub}>Chapitre {chapterNum} / {bookInfo?.chapitres || '?'}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Navigation chapitres */}
      <View style={styles.chapNav}>
        <TouchableOpacity
          style={[styles.chapBtn, chapterNum <= 1 && styles.chapBtnDisabled]}
          onPress={() => goChapter(-1)}
          disabled={chapterNum <= 1}
        >
          <Text style={styles.chapBtnText}>‹ Ch. {chapterNum - 1}</Text>
        </TouchableOpacity>
        <Text style={styles.chapCurrent}>Chapitre {chapterNum} / {bookInfo?.chapitres}</Text>
        <TouchableOpacity
          style={[styles.chapBtn, chapterNum >= (bookInfo?.chapitres || 1) && styles.chapBtnDisabled]}
          onPress={() => goChapter(1)}
          disabled={chapterNum >= (bookInfo?.chapitres || 1)}
        >
          <Text style={styles.chapBtnText}>Ch. {chapterNum + 1} ›</Text>
        </TouchableOpacity>
      </View>

      {/* Versets */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {chapData.titre && (
          <Text style={styles.chapTitle}>{chapData.titre}</Text>
        )}
        {chapData.versets.map((verset) => {
          const favori = isFavorite(`${book}-${chapterNum}-${verset.numero}`);
          return (
            <TouchableOpacity
              key={verset.numero}
              style={[styles.versetRow, favori && styles.versetRowFavori]}
              onPress={() => handleToggleFavorite(verset)}
              activeOpacity={0.7}
            >
              <Text style={styles.versetNum}>{verset.numero}</Text>
              <Text style={[styles.versetText, { fontSize }]}>{verset.texte}</Text>
              {favori && <Text style={styles.favIcon}>🔖</Text>}
            </TouchableOpacity>
          );
        })}

        {/* Boutons navigation en bas */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.bottomBtn, chapterNum <= 1 && styles.bottomBtnDisabled]}
            onPress={() => goChapter(-1)}
            disabled={chapterNum <= 1}
          >
            <Text style={styles.bottomBtnText}>← Chapitre précédent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomBtn, chapterNum >= (bookInfo?.chapitres || 1) && styles.bottomBtnDisabled]}
            onPress={() => goChapter(1)}
            disabled={chapterNum >= (bookInfo?.chapitres || 1)}
          >
            <Text style={styles.bottomBtnText}>Chapitre suivant →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bouton options flottant */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowOptions(true)}>
        <Text style={styles.fabText}>Aa</Text>
      </TouchableOpacity>

      {/* Modal options */}
      <Modal visible={showOptions} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowOptions(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Taille du texte</Text>
            <View style={styles.fontRow}>
              <TouchableOpacity
                style={styles.fontBtn}
                onPress={() => setFontSize(s => Math.max(13, s - 1))}
              >
                <Text style={styles.fontBtnText}>A−</Text>
              </TouchableOpacity>
              <Text style={styles.fontSizeLabel}>{fontSize}px</Text>
              <TouchableOpacity
                style={styles.fontBtn}
                onPress={() => setFontSize(s => Math.min(26, s + 1))}
              >
                <Text style={styles.fontBtnText}>A+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: Colors.background },
  center:           { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText:      { color: Colors.textSecondary, fontSize: 16 },

  // Header
  header:           { backgroundColor: Colors.primary, flexDirection: 'row',
                      alignItems: 'center', paddingTop: 14, paddingBottom: 14, paddingHorizontal: 12 },
  headerBack:       { width: 40, justifyContent: 'center' },
  headerBackText:   { color: '#fff', fontSize: 24 },
  headerCenter:     { flex: 1, alignItems: 'center' },
  headerTitle:      { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub:        { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },

  // Navigation chapitres
  chapNav:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                      backgroundColor: Colors.surfaceWarm, paddingHorizontal: 14, paddingVertical: 10,
                      borderBottomWidth: 1, borderBottomColor: Colors.border },
  chapBtn:          { paddingHorizontal: 10, paddingVertical: 4 },
  chapBtnDisabled:  { opacity: 0.3 },
  chapBtnText:      { color: Colors.accent, fontWeight: '600', fontSize: 14 },
  chapCurrent:      { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },

  // Versets
  scroll:           { padding: 16, paddingBottom: 100 },
  chapTitle:        { color: Colors.accent, fontSize: 18, fontWeight: '700',
                      marginBottom: 16, fontStyle: 'italic' },
  versetRow:        { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 6,
                      borderRadius: 8, marginBottom: 4 },
  versetRowFavori:  { backgroundColor: Colors.favorite,
                      borderLeftWidth: 3, borderLeftColor: Colors.favoriteBorder },
  versetNum:        { color: Colors.accent, fontWeight: '700', fontSize: 13,
                      width: 28, marginTop: 2 },
  versetText:       { flex: 1, color: Colors.textPrimary, lineHeight: 26, fontFamily: 'serif' },
  favIcon:          { fontSize: 14, marginLeft: 6, marginTop: 4 },

  // Navigation bas
  bottomNav:        { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 8 },
  bottomBtn:        { flex: 1, backgroundColor: Colors.primary, borderRadius: 10,
                      paddingVertical: 13, alignItems: 'center' },
  bottomBtnDisabled:{ backgroundColor: Colors.surfaceWarm },
  bottomBtnText:    { color: '#fff', fontWeight: '600', fontSize: 14 },

  // FAB
  fab:              { position: 'absolute', bottom: 24, right: 20, width: 52, height: 52,
                      borderRadius: 26, backgroundColor: Colors.primary,
                      justifyContent: 'center', alignItems: 'center',
                      shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  fabText:          { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Modal
  modalOverlay:     { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBox:         { backgroundColor: Colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
                      padding: 28, paddingBottom: 40 },
  modalTitle:       { color: Colors.textPrimary, fontSize: 17, fontWeight: '700',
                      textAlign: 'center', marginBottom: 20 },
  fontRow:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  fontBtn:          { backgroundColor: Colors.surfaceWarm, paddingHorizontal: 22, paddingVertical: 12,
                      borderRadius: 10 },
  fontBtnText:      { color: Colors.primary, fontWeight: '700', fontSize: 18 },
  fontSizeLabel:    { color: Colors.textPrimary, fontSize: 20, fontWeight: '700', minWidth: 55, textAlign: 'center' },

  backBtn:          { marginTop: 20, padding: 12 },
  backBtnText:      { color: Colors.accent, fontSize: 16 },
});