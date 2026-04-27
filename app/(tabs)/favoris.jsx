import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { BIBLE_STRUCTURE } from '../../constants/bibleStructure';

// Table abrev → noms
const ALL_BOOKS_FLAT = [
  ...BIBLE_STRUCTURE.ancienTestament.categories.flatMap(c => c.livres),
  ...BIBLE_STRUCTURE.nouveauTestament.categories.flatMap(c => c.livres),
];

function getBookName(bookAbrev, isFr) {
  const found = ALL_BOOKS_FLAT.find(b => b.abrev === bookAbrev);
  if (!found) return bookAbrev;
  return isFr ? found.nom : found.nomEn;
}

export default function FavorisScreen() {
  const router                         = useRouter();
  const { bookmarks, loading, toggle, reload } = useBookmarks();
  const { colors }                     = useTheme();
  const { t, isFr }                    = useLanguage();
  const [onglet, setOnglet]            = useState('tous');

  useFocusEffect(useCallback(() => { reload(); }, []));

  const displayed = onglet === 'recents'
    ? [...bookmarks].slice(0, 10)
    : bookmarks;

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isFr) {
      return `Ajouté le ${d.getDate()} ${d.toLocaleString('fr-FR', { month: 'long' })} ${d.getFullYear()}`;
    }
    return `Added on ${d.toLocaleString('en-US', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()}`;
  }

  const renderItem = ({ item }) => {
    // Nom du livre selon la langue courante
    const bookName = getBookName(item.bookAbrev, isFr);
    const ref      = `${bookName} ${item.chapter}:${item.verse}`;

    return (
      <TouchableOpacity
        style={[styles.card, {
          backgroundColor: colors.surface,
          borderLeftColor: colors.accent,
        }]}
        onPress={() => router.push(`/lecture/${item.bookAbrev}/${item.chapter}`)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardRefRow}>
            <Ionicons name="bookmark" size={14} color={colors.accent} style={{ marginRight: 6 }} />
            <Text style={[styles.cardRef, { color: colors.accent }]}>{ref}</Text>
          </View>
          <TouchableOpacity
            onPress={() => toggle(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Texte — toujours affiché tel quel (langue au moment de l'ajout) */}
        <Text style={[styles.cardText, { color: colors.textPrimary }]} numberOfLines={3}>
          « {item.text} »
        </Text>

        <View style={styles.cardFooter}>
          <Ionicons name="time-outline" size={12} color={colors.textLight} />
          <Text style={[styles.cardDate, { color: colors.textLight }]}>
            {' '}{formatDate(item.addedAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Ionicons name="bookmark" size={20} color="rgba(255,255,255,0.8)"
          style={{ marginBottom: 4 }} />
        <Text style={styles.headerTitle}>{t.myFavorites}</Text>
        <Text style={styles.headerSub}>
          {t.favorites_count(bookmarks.length)}
        </Text>
      </View>

      {/* Onglets */}
      <View style={[styles.tabs, {
        backgroundColor:   colors.surface,
        borderBottomColor: colors.border,
      }]}>
        {[
          { key: 'tous',    icon: 'list',   label: t.all_tab    },
          { key: 'recents', icon: 'time',   label: t.recent_tab },
        ].map(({ key, icon, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, onglet === key && {
              borderBottomWidth: 3,
              borderBottomColor: colors.primary,
            }]}
            onPress={() => setOnglet(key)}
          >
            <Ionicons
              name={onglet === key ? icon : `${icon}-outline`}
              size={14}
              color={onglet === key ? colors.primary : colors.textLight}
              style={{ marginRight: 5 }}
            />
            <Text style={[styles.tabText,
              { color: onglet === key ? colors.primary : colors.textLight }]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!loading && (
        <FlatList
          data={displayed}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="bookmark-outline" size={52} color={colors.textLight} />
              <Text style={[styles.emptyText, { color: colors.textLight }]}>
                {t.noFavorites}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:      { paddingTop: 16, paddingBottom: 20, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub:   { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },

  tabs:        { flexDirection: 'row', borderBottomWidth: 1 },
  tab:         { flex: 1, paddingVertical: 14, alignItems: 'center',
                 flexDirection: 'row', justifyContent: 'center' },
  tabText:     { fontSize: 13, fontWeight: '600' },

  list:        { padding: 16, paddingBottom: 32 },

  card:        { borderRadius: 12, padding: 16, marginBottom: 12,
                 borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.05,
                 shadowRadius: 6, elevation: 2 },
  cardHeader:  { flexDirection: 'row', justifyContent: 'space-between',
                 alignItems: 'center', marginBottom: 8 },
  cardRefRow:  { flexDirection: 'row', alignItems: 'center' },
  cardRef:     { fontWeight: '700', fontSize: 15 },
  cardText:    { fontSize: 14, lineHeight: 22, fontStyle: 'italic' },
  cardFooter:  { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  cardDate:    { fontSize: 11 },

  empty:       { alignItems: 'center', marginTop: 80, gap: 16 },
  emptyText:   { fontSize: 15, textAlign: 'center', lineHeight: 24 },
});