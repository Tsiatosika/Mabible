// app/(tabs)/index.jsx
import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getLastPosition, getBookmarks, getReadingHistory } from '../../utils/storage';
import { DAILY_VERSES, BIBLE_STRUCTURE } from '../../constants/bibleStructure';
import { useTheme } from '../../context/ThemeContext';

const ALL_BOOKS_FLAT = [
  ...BIBLE_STRUCTURE.ancienTestament.categories.flatMap(c => c.livres),
  ...BIBLE_STRUCTURE.nouveauTestament.categories.flatMap(c => c.livres),
];

function getBookAbrev(bookName) {
  return ALL_BOOKS_FLAT.find(b => b.nom === bookName)?.abrev || null;
}

export default function AccueilScreen() {
  const router     = useRouter();
  const { colors } = useTheme();

  const [verseOfDay,   setVerseOfDay]   = useState(null);
  const [lastPosition, setLastPosition] = useState(null);
  const [stats,        setStats]        = useState({ favoris: 0, jours: 0, progression: 0 });

  useFocusEffect(
    useCallback(() => {
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
      );
      setVerseOfDay(DAILY_VERSES[dayOfYear % DAILY_VERSES.length]);

      (async () => {
        const [pos, bookmarks, history] = await Promise.all([
          getLastPosition(), getBookmarks(), getReadingHistory(),
        ]);
        setLastPosition(pos);
        const uniqueChapitres = new Set(history.map(h => `${h.book}-${h.chapter}`)).size;
        const joursUniques    = new Set(history.map(h => h.readAt?.slice(0, 10))).size;
        setStats({
          favoris:     bookmarks.length,
          jours:       joursUniques,
          progression: Math.round((uniqueChapitres / 1189) * 100),
        });
      })();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerLeft} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Ma Bible</Text>
          <Text style={styles.headerSub}>Version Louis Segond</Text>
        </View>
        <TouchableOpacity
          style={styles.headerRight}
          onPress={() => router.push('/parametres')}
        >
          <Ionicons name="settings-outline" size={22} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Verset du jour */}
        {verseOfDay && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="sunny-outline" size={16} color={colors.accent} />
              <Text style={[styles.cardTitle, { color: colors.accent }]}>Verset du jour</Text>
            </View>
            <Text style={[styles.verseText, { color: colors.textPrimary }]}>
              « {verseOfDay.texte} »
            </Text>
            <View style={styles.verseRefRow}>
              <Ionicons name="bookmark-outline" size={13} color={colors.accent} />
              <Text style={[styles.verseRef, { color: colors.accent }]}> {verseOfDay.ref}</Text>
            </View>
          </View>
        )}

        {/* Continuer la lecture */}
        {lastPosition && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Continuer la lecture
            </Text>
            <TouchableOpacity
              style={[styles.continueCard, { backgroundColor: colors.surface }]}
              onPress={() => {
                const abrev = getBookAbrev(lastPosition.book);
                if (abrev) router.push(`/lecture/${abrev}/${lastPosition.chapter}`);
              }}
            >
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>
                  {lastPosition.book.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={styles.continueInfo}>
                <Text style={[styles.continueName, { color: colors.textPrimary }]}>
                  {lastPosition.book}
                </Text>
                <Text style={[styles.continueSub, { color: colors.accent }]}>
                  Chapitre {lastPosition.chapter}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        )}

        {/* Accès rapide */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Accès rapide</Text>
          <View style={styles.testamentRow}>
            <TouchableOpacity
              style={[styles.testamentBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/lire')}
            >
              <Ionicons name="library-outline" size={24} color="rgba(255,255,255,0.9)"
                style={{ marginBottom: 6 }} />
              <Text style={styles.testamentLabel}>Ancien{'\n'}Testament</Text>
              <Text style={styles.testamentCount}>39 livres</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.testamentBtn, { backgroundColor: colors.primaryLight }]}
              onPress={() => router.push('/lire')}
            >
              <Ionicons name="heart-outline" size={24} color="rgba(255,255,255,0.9)"
                style={{ marginBottom: 6 }} />
              <Text style={styles.testamentLabel}>Nouveau{'\n'}Testament</Text>
              <Text style={styles.testamentCount}>27 livres</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistiques */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface }]}>
          <View style={styles.statBox}>
            <Ionicons name="bookmark" size={18} color={colors.primary} style={{ marginBottom: 4 }} />
            <Text style={[styles.statNum, { color: colors.primary }]}>{stats.favoris}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favoris</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.statBox}>
            <Ionicons name="calendar" size={18} color={colors.primary} style={{ marginBottom: 4 }} />
            <Text style={[styles.statNum, { color: colors.primary }]}>{stats.jours}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Jours lus</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.statBox}>
            <Ionicons name="trending-up" size={18} color={colors.primary} style={{ marginBottom: 4 }} />
            <Text style={[styles.statNum, { color: colors.primary }]}>{stats.progression}%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Progression</Text>
          </View>
        </View>

        {/* Livres récents */}
        <RecentBooks router={router} colors={colors} />

      </ScrollView>
    </SafeAreaView>
  );
}

function RecentBooks({ router, colors }) {
  const [history, setHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getReadingHistory().then(h => {
        const seen   = new Set();
        const recent = h.filter(item => {
          const key = `${item.book}-${item.chapter}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }).slice(0, 5);
        setHistory(recent);
      });
    }, [])
  );

  if (history.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Récemment lus
      </Text>
      {history.map((item, idx) => {
        const abrev = ALL_BOOKS_FLAT.find(b => b.nom === item.book)?.abrev;
        return (
          <TouchableOpacity
            key={idx}
            style={[styles.recentRow, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }]}
            onPress={() => abrev && router.push(`/lecture/${abrev}/${item.chapter}`)}
          >
            <View style={[styles.recentAvatar, {
              backgroundColor: colors.surfaceWarm,
              borderColor: colors.border,
            }]}>
              <Text style={[styles.recentAvatarText, { color: colors.primary }]}>
                {item.book.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.continueName, { color: colors.textPrimary }]}>
                {item.book}
              </Text>
              <Text style={[styles.continueSub, { color: colors.textLight }]}>
                Chapitre {item.chapter}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header:           { flexDirection: 'row', alignItems: 'center',
                      paddingTop: 16, paddingBottom: 16, paddingHorizontal: 16 },
  headerLeft:       { width: 44 },
  headerCenter:     { flex: 1, alignItems: 'center' },
  headerRight:      { width: 44, alignItems: 'flex-end', justifyContent: 'center' },
  headerTitle:      { color: '#fff', fontSize: 22, fontWeight: '700', letterSpacing: 0.5 },
  headerSub:        { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },

  scroll:           { padding: 16, paddingBottom: 40 },

  card:             { borderRadius: 14, padding: 18, marginBottom: 20,
                      shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTitleRow:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  cardTitle:        { fontWeight: '700', fontSize: 15 },
  verseText:        { fontSize: 15, fontStyle: 'italic', lineHeight: 24 },
  verseRefRow:      { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  verseRef:         { fontWeight: '600', fontSize: 13 },

  section:          { marginBottom: 20 },
  sectionTitle:     { fontWeight: '700', fontSize: 16, marginBottom: 10 },

  continueCard:     { borderRadius: 12, padding: 14, flexDirection: 'row',
                      alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05,
                      shadowRadius: 6, elevation: 2 },
  avatar:           { width: 44, height: 44, borderRadius: 22, justifyContent: 'center',
                      alignItems: 'center', marginRight: 12 },
  avatarText:       { color: '#fff', fontWeight: '700', fontSize: 14 },
  continueInfo:     { flex: 1 },
  continueName:     { fontWeight: '700', fontSize: 15 },
  continueSub:      { fontSize: 13, marginTop: 2 },

  testamentRow:     { flexDirection: 'row', gap: 12 },
  testamentBtn:     { flex: 1, borderRadius: 12, padding: 18, alignItems: 'center' },
  testamentLabel:   { color: '#fff', fontWeight: '700', fontSize: 16, textAlign: 'center' },
  testamentCount:   { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

  statsRow:         { borderRadius: 14, padding: 18, flexDirection: 'row',
                      justifyContent: 'space-around', alignItems: 'center',
                      marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05,
                      shadowRadius: 6, elevation: 2 },
  statBox:          { alignItems: 'center' },
  statNum:          { fontSize: 26, fontWeight: '800' },
  statLabel:        { fontSize: 12, marginTop: 2 },
  statDivider:      { width: 1, height: 40 },

  recentRow:        { borderRadius: 12, padding: 12, flexDirection: 'row',
                      alignItems: 'center', marginBottom: 8, borderWidth: 1 },
  recentAvatar:     { width: 38, height: 38, borderRadius: 19, justifyContent: 'center',
                      alignItems: 'center', marginRight: 12, borderWidth: 1 },
  recentAvatarText: { fontWeight: '700', fontSize: 12 },
});