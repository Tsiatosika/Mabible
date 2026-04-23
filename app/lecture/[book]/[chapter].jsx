// app/lecture/[book]/[chapter].jsx
import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Modal, Pressable, Share
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBible } from '../../../hooks/useBible';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { saveLastPosition, addToHistory } from '../../../utils/storage';
import { BIBLE_STRUCTURE } from '../../../constants/bibleStructure';
import { useTheme } from '../../../context/ThemeContext';

const ALL_BOOKS_FLAT = [
  ...BIBLE_STRUCTURE.ancienTestament.categories.flatMap(c => c.livres),
  ...BIBLE_STRUCTURE.nouveauTestament.categories.flatMap(c => c.livres),
];

export default function LectureScreen() {
  const { book, chapter }              = useLocalSearchParams();
  const router                         = useRouter();
  const { bible, loading, getChapter } = useBible();
  const { toggle, isFavorite }         = useBookmarks();
  const { colors, isDark, toggleTheme } = useTheme();

  const [chapData,    setChapData]    = useState(null);
  const [bookInfo,    setBookInfo]    = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [fontSize,    setFontSize]    = useState(17);

  const chapterNum = Number(chapter);

  useEffect(() => {
    if (!bible) return;

    const info = ALL_BOOKS_FLAT.find(b => b.abrev === book);
    setBookInfo(info || null);

    const data = getChapter(book, chapterNum);
    setChapData(data);

    if (info) {
      saveLastPosition(info.nom, chapterNum);
      addToHistory(info.nom, chapterNum);
    }
  }, [book, chapter, bible]);

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

  async function handleShare(verset) {
    try {
      await Share.share({
        message: `"${verset.texte}"\n\n— ${bookInfo?.nom} ${chapterNum}:${verset.numero}\n\n📖 Ma Bible`,
      });
    } catch (e) {
      console.error(e);
    }
  }

  // ── Chargement ─────────────────────────────────────────────────────────────
  if (loading || !bible) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Chargement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Chapitre introuvable ────────────────────────────────────────────────────
  if (!chapData) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
            <Text style={styles.headerBackText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{bookInfo?.nom || book}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.center}>
          <Text style={styles.errorEmoji}>📖</Text>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Chapitre introuvable
          </Text>
          <Text style={[styles.errorSub, { color: colors.textLight }]}>
            Livre : {book} | Chapitre : {chapter}
          </Text>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>← Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Écran principal ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{bookInfo?.nom || book}</Text>
          <Text style={styles.headerSub}>
            Chapitre {chapterNum} / {bookInfo?.chapitres || '?'}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Navigation chapitres */}
      <View style={[styles.chapNav, {
        backgroundColor: colors.surfaceWarm,
        borderBottomColor: colors.border,
      }]}>
        <TouchableOpacity
          style={[styles.chapBtn, chapterNum <= 1 && styles.chapBtnDisabled]}
          onPress={() => goChapter(-1)}
          disabled={chapterNum <= 1}
        >
          <Text style={[styles.chapBtnText, { color: colors.accent }]}>
            ‹ Ch. {chapterNum - 1}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.chapCurrent, { color: colors.textSecondary }]}>
          Chapitre {chapterNum} / {bookInfo?.chapitres}
        </Text>

        <TouchableOpacity
          style={[
            styles.chapBtn,
            chapterNum >= (bookInfo?.chapitres || 1) && styles.chapBtnDisabled,
          ]}
          onPress={() => goChapter(1)}
          disabled={chapterNum >= (bookInfo?.chapitres || 1)}
        >
          <Text style={[styles.chapBtnText, { color: colors.accent }]}>
            Ch. {chapterNum + 1} ›
          </Text>
        </TouchableOpacity>
      </View>

      {/* Versets */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Astuce première fois */}
        <View style={[styles.tipBox, { backgroundColor: colors.surfaceWarm,
          borderColor: colors.border }]}>
          <Text style={[styles.tipText, { color: colors.textLight }]}>
            💡 Appuyez sur un verset pour l'ajouter aux favoris · Appui long pour partager
          </Text>
        </View>

        {chapData.titre && (
          <Text style={[styles.chapTitle, { color: colors.accent }]}>
            {chapData.titre}
          </Text>
        )}

        {chapData.versets.map((verset) => {
          const favori = isFavorite(`${book}-${chapterNum}-${verset.numero}`);
          return (
            <TouchableOpacity
              key={verset.numero}
              style={[
                styles.versetRow,
                favori && {
                  backgroundColor: colors.favorite,
                  borderLeftWidth: 3,
                  borderLeftColor: colors.favoriteBorder,
                },
              ]}
              onPress={() => handleToggleFavorite(verset)}
              onLongPress={() => handleShare(verset)}
              activeOpacity={0.7}
            >
              <Text style={[styles.versetNum, { color: colors.accent }]}>
                {verset.numero}
              </Text>
              <Text style={[styles.versetText, { fontSize, color: colors.textPrimary }]}>
                {verset.texte}
              </Text>
              {favori && <Text style={styles.favIcon}>🔖</Text>}
            </TouchableOpacity>
          );
        })}

        {/* Navigation bas de page */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[
              styles.bottomBtn,
              { backgroundColor: colors.primary },
              chapterNum <= 1 && { backgroundColor: colors.surfaceWarm },
            ]}
            onPress={() => goChapter(-1)}
            disabled={chapterNum <= 1}
          >
            <Text style={[
              styles.bottomBtnText,
              chapterNum <= 1 && { color: colors.textLight },
            ]}>
              ← Chapitre précédent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.bottomBtn,
              { backgroundColor: colors.primary },
              chapterNum >= (bookInfo?.chapitres || 1) && { backgroundColor: colors.surfaceWarm },
            ]}
            onPress={() => goChapter(1)}
            disabled={chapterNum >= (bookInfo?.chapitres || 1)}
          >
            <Text style={[
              styles.bottomBtnText,
              chapterNum >= (bookInfo?.chapitres || 1) && { color: colors.textLight },
            ]}>
              Chapitre suivant →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bouton options flottant */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setShowOptions(true)}
      >
        <Text style={styles.fabText}>Aa</Text>
      </TouchableOpacity>

      {/* Modal options */}
      <Modal visible={showOptions} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowOptions(false)}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>

            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Options d'affichage
            </Text>

            {/* Taille du texte */}
            <Text style={[styles.modalSubTitle, { color: colors.textSecondary }]}>
              Taille du texte
            </Text>
            <View style={styles.fontRow}>
              <TouchableOpacity
                style={[styles.fontBtn, { backgroundColor: colors.surfaceWarm }]}
                onPress={() => setFontSize(s => Math.max(13, s - 1))}
              >
                <Text style={[styles.fontBtnText, { color: colors.primary }]}>A−</Text>
              </TouchableOpacity>

              <Text style={[styles.fontSizeLabel, { color: colors.textPrimary }]}>
                {fontSize}px
              </Text>

              <TouchableOpacity
                style={[styles.fontBtn, { backgroundColor: colors.surfaceWarm }]}
                onPress={() => setFontSize(s => Math.min(26, s + 1))}
              >
                <Text style={[styles.fontBtnText, { color: colors.primary }]}>A+</Text>
              </TouchableOpacity>
            </View>

            {/* Mode sombre/clair */}
            <Text style={[styles.modalSubTitle, { color: colors.textSecondary, marginTop: 24 }]}>
              Thème
            </Text>
            <TouchableOpacity
              style={[styles.themeBtn, { backgroundColor: colors.primary }]}
              onPress={() => { toggleTheme(); setShowOptions(false); }}
            >
              <Text style={styles.themeBtnText}>
                {isDark ? '☀️  Passer en mode clair' : '🌙  Passer en mode sombre'}
              </Text>
            </TouchableOpacity>

            {/* Fermer */}
            <TouchableOpacity
              style={[styles.closeBtn, { borderColor: colors.border }]}
              onPress={() => setShowOptions(false)}
            >
              <Text style={[styles.closeBtnText, { color: colors.textSecondary }]}>
                Fermer
              </Text>
            </TouchableOpacity>

          </View>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:              { flex: 1 },
  center:            { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText:       { fontSize: 16, marginBottom: 8 },
  errorEmoji:        { fontSize: 48, marginBottom: 12 },
  errorSub:          { fontSize: 13, marginBottom: 16 },

  // Header
  header:            { flexDirection: 'row', alignItems: 'center',
                       paddingTop: 14, paddingBottom: 14, paddingHorizontal: 12 },
  headerBack:        { width: 40, justifyContent: 'center' },
  headerBackText:    { color: '#fff', fontSize: 24 },
  headerCenter:      { flex: 1, alignItems: 'center' },
  headerTitle:       { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub:         { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },

  // Navigation chapitres
  chapNav:           { flexDirection: 'row', alignItems: 'center',
                       justifyContent: 'space-between', paddingHorizontal: 14,
                       paddingVertical: 10, borderBottomWidth: 1 },
  chapBtn:           { paddingHorizontal: 10, paddingVertical: 4 },
  chapBtnDisabled:   { opacity: 0.3 },
  chapBtnText:       { fontWeight: '600', fontSize: 14 },
  chapCurrent:       { fontSize: 13, fontWeight: '600' },

  // Contenu
  scroll:            { padding: 16, paddingBottom: 100 },

  // Astuce
  tipBox:            { borderRadius: 8, padding: 10, marginBottom: 14,
                       borderWidth: 1 },
  tipText:           { fontSize: 12, textAlign: 'center', lineHeight: 18 },

  chapTitle:         { fontSize: 18, fontWeight: '700', marginBottom: 16,
                       fontStyle: 'italic' },

  // Versets
  versetRow:         { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 6,
                       borderRadius: 8, marginBottom: 4 },
  versetNum:         { fontWeight: '700', fontSize: 13, width: 28, marginTop: 2 },
  versetText:        { flex: 1, lineHeight: 26, fontFamily: 'serif' },
  favIcon:           { fontSize: 14, marginLeft: 6, marginTop: 4 },

  // Navigation bas
  bottomNav:         { flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 8 },
  bottomBtn:         { flex: 1, borderRadius: 10, paddingVertical: 13,
                       alignItems: 'center' },
  bottomBtnText:     { color: '#fff', fontWeight: '600', fontSize: 14 },

  // FAB
  fab:               { position: 'absolute', bottom: 24, right: 20, width: 52, height: 52,
                       borderRadius: 26, justifyContent: 'center', alignItems: 'center',
                       shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8,
                       elevation: 6 },
  fabText:           { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Modal
  modalOverlay:      { flex: 1, justifyContent: 'flex-end',
                       backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBox:          { borderTopLeftRadius: 24, borderTopRightRadius: 24,
                       padding: 28, paddingBottom: 44 },
  modalTitle:        { fontSize: 18, fontWeight: '700', textAlign: 'center',
                       marginBottom: 24 },
  modalSubTitle:     { fontSize: 13, fontWeight: '600', marginBottom: 12,
                       textAlign: 'center' },
  fontRow:           { flexDirection: 'row', alignItems: 'center',
                       justifyContent: 'center', gap: 24 },
  fontBtn:           { paddingHorizontal: 22, paddingVertical: 12, borderRadius: 10 },
  fontBtnText:       { fontWeight: '700', fontSize: 18 },
  fontSizeLabel:     { fontSize: 20, fontWeight: '700', minWidth: 55,
                       textAlign: 'center' },
  themeBtn:          { borderRadius: 12, paddingVertical: 14, alignItems: 'center',
                       marginTop: 4 },
  themeBtnText:      { color: '#fff', fontWeight: '700', fontSize: 15 },
  closeBtn:          { marginTop: 16, borderRadius: 12, paddingVertical: 12,
                       alignItems: 'center', borderWidth: 1 },
  closeBtnText:      { fontSize: 14, fontWeight: '600' },

  backBtn:           { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12,
                       borderRadius: 10 },
  backBtnText:       { color: '#fff', fontWeight: '600', fontSize: 15 },
});