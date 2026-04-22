import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { getLastPosition, getBookmarks, getReadingHistory } from '../../utils/storage';
import { DAILY_VERSES, BIBLE_STRUCTURE } from '../../constants/bibleStructure';
import Colors from '../../constants/colors';

export default function AccueilScreen() {
  const router = useRouter();
  const [verseOfDay, setVerseOfDay]     = useState(null);
  const [lastPosition, setLastPosition] = useState(null);
  const [stats, setStats]               = useState({ favoris: 0, jours: 0, progression: 0 });

  useEffect(() => {
    // Verset du jour selon le jour de l'année
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    setVerseOfDay(DAILY_VERSES[dayOfYear % DAILY_VERSES.length]);

    // Charger les données locales
    (async () => {
      const [pos, bookmarks, history] = await Promise.all([
        getLastPosition(),
        getBookmarks(),
        getReadingHistory(),
      ]);
      setLastPosition(pos);

      // Calcul progression (chapitres lus / total chapitres)
      const totalChapitres = 1189;
      const uniqueChapitres = new Set(history.map(h => `${h.book}-${h.chapter}`)).size;
      const joursUniques    = new Set(history.map(h => h.readAt?.slice(0, 10))).size;

      setStats({
        favoris:     bookmarks.length,
        jours:       joursUniques,
        progression: Math.round((uniqueChapitres / totalChapitres) * 100),
      });
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ma Bible</Text>
        <Text style={styles.headerSub}>Version Louis Segond</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Verset du jour */}
        {verseOfDay && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>✨ Verset du jour</Text>
            <Text style={styles.verseText}>« {verseOfDay.texte} »</Text>
            <Text style={styles.verseRef}>{verseOfDay.ref}</Text>
          </View>
        )}

        {/* Continuer la lecture */}
        {lastPosition && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continuer la lecture</Text>
            <TouchableOpacity
              style={styles.continueCard}
              onPress={() => router.push(`/lecture/${lastPosition.book}/${lastPosition.chapter}`)}
            >
              <View style={styles.continueAvatar}>
                <Text style={styles.continueAvatarText}>
                  {lastPosition.book.slice(0, 2)}
                </Text>
              </View>
              <View style={styles.continueInfo}>
                <Text style={styles.continueName}>{lastPosition.book}</Text>
                <Text style={styles.continueSub}>Chapitre {lastPosition.chapter}</Text>
              </View>
              <Text style={styles.continueArrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Accès rapide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accès rapide</Text>
          <View style={styles.testamentRow}>
            <TouchableOpacity
              style={[styles.testamentBtn, { backgroundColor: Colors.primary }]}
              onPress={() => router.push('/lire?testament=ancien')}
            >
              <Text style={styles.testamentLabel}>Ancien{'\n'}Testament</Text>
              <Text style={styles.testamentCount}>39 livres</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.testamentBtn, { backgroundColor: Colors.primaryLight }]}
              onPress={() => router.push('/lire?testament=nouveau')}
            >
              <Text style={styles.testamentLabel}>Nouveau{'\n'}Testament</Text>
              <Text style={styles.testamentCount}>27 livres</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistiques */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{stats.favoris}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{stats.jours}</Text>
            <Text style={styles.statLabel}>Jours lus</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{stats.progression}%</Text>
            <Text style={styles.statLabel}>Progression</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: Colors.background },
  header:            { backgroundColor: Colors.primary, paddingTop: 16, paddingBottom: 20, alignItems: 'center' },
  headerTitle:       { color: '#fff', fontSize: 24, fontWeight: '700', letterSpacing: 1 },
  headerSub:         { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  scroll:            { padding: 16, paddingBottom: 32 },

  // Verset du jour
  card:              { backgroundColor: Colors.surface, borderRadius: 14, padding: 18, marginBottom: 20,
                       shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTitle:         { color: Colors.accent, fontWeight: '700', fontSize: 15, marginBottom: 10 },
  verseText:         { color: Colors.textPrimary, fontSize: 15, fontStyle: 'italic', lineHeight: 24 },
  verseRef:          { color: Colors.accent, fontWeight: '600', fontSize: 13, marginTop: 8 },

  // Sections
  section:           { marginBottom: 20 },
  sectionTitle:      { color: Colors.textPrimary, fontWeight: '700', fontSize: 16, marginBottom: 10 },

  // Continuer
  continueCard:      { backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
                       flexDirection: 'row', alignItems: 'center',
                       shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  continueAvatar:    { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary,
                       justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  continueAvatarText:{ color: '#fff', fontWeight: '700', fontSize: 14 },
  continueInfo:      { flex: 1 },
  continueName:      { color: Colors.textPrimary, fontWeight: '700', fontSize: 15 },
  continueSub:       { color: Colors.accent, fontSize: 13, marginTop: 2 },
  continueArrow:     { color: Colors.textLight, fontSize: 28 },

  // Testaments
  testamentRow:      { flexDirection: 'row', gap: 12 },
  testamentBtn:      { flex: 1, borderRadius: 12, padding: 18, alignItems: 'center' },
  testamentLabel:    { color: '#fff', fontWeight: '700', fontSize: 16, textAlign: 'center' },
  testamentCount:    { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

  // Stats
  statsRow:          { backgroundColor: Colors.surface, borderRadius: 14, padding: 18,
                       flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
                       shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  statBox:           { alignItems: 'center' },
  statNum:           { color: Colors.primary, fontSize: 26, fontWeight: '800' },
  statLabel:         { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  statDivider:       { width: 1, height: 40, backgroundColor: Colors.divider },
});