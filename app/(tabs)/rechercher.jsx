import { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBible } from '../../hooks/useBible';
import Colors from '../../constants/colors';

export default function RechercherScreen() {
  const router  = useRouter();
  const { searchVersets, loading } = useBible();

  const [query,   setQuery]   = useState('');
  const [filter,  setFilter]  = useState('all');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  // Debounce simplifié
  const handleSearch = useCallback((text) => {
    setQuery(text);
    if (text.length < 2) { setResults([]); setSearched(false); return; }
    const found = searchVersets(text, filter);
    setResults(found);
    setSearched(true);
  }, [filter, searchVersets]);

  const handleFilterChange = (f) => {
    setFilter(f);
    if (query.length >= 2) {
      setResults(searchVersets(query, f));
    }
  };

  // Mise en surbrillance du mot cherché
  function HighlightedText({ text, query }) {
    if (!query) return <Text style={styles.resultText}>{text}</Text>;
    const q    = query.toLowerCase();
    const idx  = text.toLowerCase().indexOf(q);
    if (idx === -1) return <Text style={styles.resultText}>{text}</Text>;
    return (
      <Text style={styles.resultText}>
        {text.slice(0, idx)}
        <Text style={styles.highlight}>{text.slice(idx, idx + query.length)}</Text>
        {text.slice(idx + query.length)}
      </Text>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => router.push(`/lecture/${item.bookAbrev}/${item.chapter}`)}
    >
      <Text style={styles.resultRef}>
        {item.book} {item.chapter}:{item.verse}
      </Text>
      <HighlightedText text={item.text} query={query} />
      <Text style={styles.resultTestament}>
        {item.testament === 'ancien' ? 'A.T.' : 'N.T.'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rechercher</Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un mot, un verset..."
          placeholderTextColor={Colors.placeholder}
          value={query}
          onChangeText={handleSearch}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtres */}
      <View style={styles.filters}>
        {[['all','Tout'], ['ancien','A. Testament'], ['nouveau','N. Testament']].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterBtn, filter === key && styles.filterBtnActive]}
            onPress={() => handleFilterChange(key)}
          >
            <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Résultats */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          {searched && (
            <Text style={styles.resultCount}>
              {results.length} résultat{results.length > 1 ? 's' : ''} pour « {query} »
            </Text>
          )}
          {!searched && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📖</Text>
              <Text style={styles.emptyText}>Recherchez dans les{'\n'}31 000 versets de la Bible</Text>
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
                <Text style={styles.noResult}>Aucun résultat trouvé.</Text>
              ) : null
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: Colors.background },
  header:             { backgroundColor: Colors.primary, paddingTop: 16, paddingBottom: 20, alignItems: 'center' },
  headerTitle:        { color: '#fff', fontSize: 20, fontWeight: '700' },

  // Barre recherche
  searchBar:          { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
                        margin: 14, borderRadius: 12, paddingHorizontal: 14,
                        borderWidth: 1, borderColor: Colors.border },
  searchIcon:         { fontSize: 16, marginRight: 8 },
  searchInput:        { flex: 1, height: 46, color: Colors.textPrimary, fontSize: 15 },
  clearBtn:           { color: Colors.textLight, fontSize: 16, paddingLeft: 8 },

  // Filtres
  filters:            { flexDirection: 'row', paddingHorizontal: 14, gap: 8, marginBottom: 4 },
  filterBtn:          { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
                        backgroundColor: Colors.surfaceWarm, borderWidth: 1, borderColor: Colors.border },
  filterBtnActive:    { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText:         { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  filterTextActive:   { color: '#fff' },

  // Liste
  list:               { padding: 14, paddingBottom: 32 },
  resultCount:        { color: Colors.textLight, fontSize: 13, paddingHorizontal: 16, marginBottom: 4 },

  // Carte résultat
  resultCard:         { backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
                        marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04,
                        shadowRadius: 4, elevation: 1 },
  resultRef:          { color: Colors.accent, fontWeight: '700', fontSize: 14, marginBottom: 4 },
  resultText:         { color: Colors.textPrimary, fontSize: 14, lineHeight: 20 },
  highlight:          { backgroundColor: Colors.accentLight, fontWeight: '700' },
  resultTestament:    { color: Colors.textLight, fontSize: 11, marginTop: 6,
                        textAlign: 'right', fontStyle: 'italic' },

  // État vide
  emptyState:         { alignItems: 'center', marginTop: 60 },
  emptyEmoji:         { fontSize: 48, marginBottom: 14 },
  emptyText:          { color: Colors.textLight, fontSize: 16, textAlign: 'center', lineHeight: 24 },
  noResult:           { color: Colors.textLight, textAlign: 'center', marginTop: 40, fontSize: 15 },
});