import { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBible } from '../../hooks/useBible';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function RechercherScreen() {
  const router = useRouter();
  const { searchVersets, loading } = useBible();
  const { colors }   = useTheme();
  const { t, isFr }  = useLanguage();

  const [query,    setQuery]    = useState('');
  const [filter,   setFilter]   = useState('all');
  const [results,  setResults]  = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback((text) => {
    setQuery(text);
    if (text.length < 2) { setResults([]); setSearched(false); return; }
    setResults(searchVersets(text, filter));
    setSearched(true);
  }, [filter, searchVersets]);

  const handleFilterChange = (f) => {
    setFilter(f);
    if (query.length >= 2) setResults(searchVersets(query, f));
  };

  function HighlightedText({ text, query }) {
    if (!query) return <Text style={[styles.resultText, { color: colors.textPrimary }]}>{text}</Text>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <Text style={[styles.resultText, { color: colors.textPrimary }]}>{text}</Text>;
    return (
      <Text style={[styles.resultText, { color: colors.textPrimary }]}>
        {text.slice(0, idx)}
        <Text style={[styles.highlight, { backgroundColor: colors.accentLight }]}>
          {text.slice(idx, idx + query.length)}
        </Text>
        {text.slice(idx + query.length)}
      </Text>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.resultCard, { backgroundColor: colors.surface, borderLeftColor: colors.accent }]}
      onPress={() => router.push(`/lecture/${item.bookAbrev}/${item.chapter}`)}
    >
      <View style={styles.resultHeader}>
        <Ionicons name="bookmark-outline" size={13} color={colors.accent} />
        <Text style={[styles.resultRef, { color: colors.accent }]}>
          {item.book} {item.chapter}:{item.verse}
        </Text>
        <Text style={[styles.resultTestament, { color: colors.textLight }]}>
          {item.testament === 'ancien'
            ? (isFr ? 'A.T.' : 'O.T.')
            : (isFr ? 'N.T.' : 'N.T.')}
        </Text>
      </View>
      <HighlightedText text={item.text} query={query} />
      <View style={styles.resultFooter}>
        <Ionicons name="arrow-forward-outline" size={12} color={colors.textLight} />
        <Text style={[styles.resultFooterText, { color: colors.textLight }]}>
          {' '}{t.readChapter}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const hints = isFr
    ? ['Amour', 'Foi', 'Paix', 'Grâce']
    : ['Love', 'Faith', 'Peace', 'Grace'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Ionicons name="search" size={20} color="rgba(255,255,255,0.8)" style={{ marginBottom: 4 }} />
        <Text style={styles.headerTitle}>{t.search}</Text>
      </View>

      {/* Barre de recherche */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={18} color={colors.textLight} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={colors.placeholder}
          value={query}
          onChangeText={handleSearch}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
            <Ionicons name="close-circle" size={18} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtres */}
      <View style={styles.filters}>
        {[
          ['all',     'globe-outline',   t.all],
          ['ancien',  'library-outline', t.oldT],
          ['nouveau', 'heart-outline',   t.newT],
        ].map(([key, icon, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterBtn, {
              backgroundColor: filter === key ? colors.primary : colors.surfaceWarm,
              borderColor:     filter === key ? colors.primary : colors.border,
            }]}
            onPress={() => handleFilterChange(key)}
          >
            <Ionicons name={icon} size={13}
              color={filter === key ? '#fff' : colors.textSecondary}
              style={{ marginRight: 4 }} />
            <Text style={[styles.filterText,
              { color: filter === key ? '#fff' : colors.textSecondary }]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          {searched && (
            <View style={styles.resultCountRow}>
              <Ionicons name="list-outline" size={13} color={colors.textLight} />
              <Text style={[styles.resultCount, { color: colors.textLight }]}>
                {' '}{t.results(results.length, query)}
              </Text>
            </View>
          )}

          {!searched && (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconBox, { backgroundColor: colors.surfaceWarm }]}>
                <Ionicons name="book-outline" size={40} color={colors.textLight} />
              </View>
              <Text style={[styles.emptyText, { color: colors.textLight }]}>
                {t.searchPrompt}
              </Text>
              <View style={styles.emptyHints}>
                {hints.map(hint => (
                  <TouchableOpacity
                    key={hint}
                    style={[styles.hintChip, { backgroundColor: colors.surfaceWarm, borderColor: colors.border }]}
                    onPress={() => handleSearch(hint)}
                  >
                    <Text style={[styles.hintText, { color: colors.textSecondary }]}>{hint}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              searched ? (
                <View style={styles.noResultBox}>
                  <Ionicons name="search-outline" size={36} color={colors.textLight} />
                  <Text style={[styles.noResult, { color: colors.textLight }]}>{t.noResult}</Text>
                </View>
              ) : null
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:          { paddingTop: 16, paddingBottom: 20, alignItems: 'center' },
  headerTitle:     { color: '#fff', fontSize: 20, fontWeight: '700' },
  searchBar:       { flexDirection: 'row', alignItems: 'center', margin: 14,
                     borderRadius: 12, paddingHorizontal: 14, borderWidth: 1 },
  searchInput:     { flex: 1, height: 46, fontSize: 15 },
  filters:         { flexDirection: 'row', paddingHorizontal: 14, gap: 8, marginBottom: 4 },
  filterBtn:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
                     paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText:      { fontSize: 13, fontWeight: '600' },
  resultCountRow:  { flexDirection: 'row', alignItems: 'center', gap: 5,
                     paddingHorizontal: 16, marginBottom: 4 },
  resultCount:     { fontSize: 13 },
  list:            { padding: 14, paddingBottom: 32 },
  resultCard:      { borderRadius: 12, padding: 14, marginBottom: 10,
                     borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.04,
                     shadowRadius: 4, elevation: 1 },
  resultHeader:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  resultRef:       { fontWeight: '700', fontSize: 14, flex: 1 },
  resultTestament: { fontSize: 11, fontStyle: 'italic' },
  resultText:      { fontSize: 14, lineHeight: 20 },
  highlight:       { fontWeight: '700' },
  resultFooter:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  resultFooterText:{ fontSize: 11 },
  emptyState:      { alignItems: 'center', marginTop: 50, paddingHorizontal: 24 },
  emptyIconBox:    { width: 80, height: 80, borderRadius: 24, justifyContent: 'center',
                     alignItems: 'center', marginBottom: 14 },
  emptyText:       { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  emptyHints:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  hintChip:        { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  hintText:        { fontSize: 13, fontWeight: '600' },
  noResultBox:     { alignItems: 'center', marginTop: 40, gap: 10 },
  noResult:        { textAlign: 'center', fontSize: 15 },
});