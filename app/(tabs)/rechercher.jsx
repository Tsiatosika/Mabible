// app/(tabs)/rechercher.jsx
import { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBible } from '../../hooks/useBible';
import { useTheme } from '../../context/ThemeContext';

export default function RechercherScreen() {
  const router = useRouter();
  const { searchVersets, loading } = useBible();
  const { colors } = useTheme();

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
      style={[styles.resultCard, { backgroundColor: colors.surface,
        borderLeftColor: colors.accent }]}
      onPress={() => router.push(`/lecture/${item.bookAbrev}/${item.chapter}`)}
    >
      <Text style={[styles.resultRef, { color: colors.accent }]}>
        {item.book} {item.chapter}:{item.verse}
      </Text>
      <HighlightedText text={item.text} query={query} />
      <Text style={[styles.resultTestament, { color: colors.textLight }]}>
        {item.testament === 'ancien' ? 'A.T.' : 'N.T.'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Rechercher</Text>
      </View>

      {/* Barre de recherche */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface,
        borderColor: colors.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Rechercher un mot, un verset..."
          placeholderTextColor={colors.placeholder}
          value={query}
          onChangeText={handleSearch}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
            <Text style={[styles.clearBtn, { color: colors.textLight }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtres */}
      <View style={styles.filters}>
        {[['all','Tout'], ['ancien','A. Testament'], ['nouveau','N. Testament']].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterBtn,
              { backgroundColor: filter === key ? colors.primary : colors.surfaceWarm,
                borderColor: filter === key ? colors.primary : colors.border }]}
            onPress={() => handleFilterChange(key)}
          >
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
            <Text style={[styles.resultCount, { color: colors.textLight }]}>
              {results.length} résultat{results.length > 1 ? 's' : ''} pour « {query} »
            </Text>
          )}
          {!searched && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📖</Text>
              <Text style={[styles.emptyText, { color: colors.textLight }]}>
                Recherchez dans les{'\n'}31 000 versets de la Bible
              </Text>
            </View>
          )}
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              searched
                ? <Text style={[styles.noResult, { color: colors.textLight }]}>
                    Aucun résultat trouvé.
                  </Text>
                : null
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
  searchIcon:      { fontSize: 16, marginRight: 8 },
  searchInput:     { flex: 1, height: 46, fontSize: 15 },
  clearBtn:        { fontSize: 16, paddingLeft: 8 },
  filters:         { flexDirection: 'row', paddingHorizontal: 14, gap: 8, marginBottom: 4 },
  filterBtn:       { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText:      { fontSize: 13, fontWeight: '600' },
  list:            { padding: 14, paddingBottom: 32 },
  resultCount:     { fontSize: 13, paddingHorizontal: 16, marginBottom: 4 },
  resultCard:      { borderRadius: 12, padding: 14, marginBottom: 10,
                     borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.04,
                     shadowRadius: 4, elevation: 1 },
  resultRef:       { fontWeight: '700', fontSize: 14, marginBottom: 4 },
  resultText:      { fontSize: 14, lineHeight: 20 },
  highlight:       { fontWeight: '700' },
  resultTestament: { fontSize: 11, marginTop: 6, textAlign: 'right', fontStyle: 'italic' },
  emptyState:      { alignItems: 'center', marginTop: 60 },
  emptyEmoji:      { fontSize: 48, marginBottom: 14 },
  emptyText:       { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  noResult:        { textAlign: 'center', marginTop: 40, fontSize: 15 },
});