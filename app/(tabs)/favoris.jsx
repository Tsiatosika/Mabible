import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useBookmarks } from '../../hooks/useBookmarks';
import Colors from '../../constants/colors';

export default function FavorisScreen() {
  const router = useRouter();
  const { bookmarks, loading, toggle, reload } = useBookmarks();
  const [onglet, setOnglet] = useState('tous');

  // Recharger à chaque fois qu'on revient sur cet écran
  useFocusEffect(useCallback(() => { reload(); }, []));

  const displayed = onglet === 'recents'
    ? [...bookmarks].slice(0, 10)
    : bookmarks;

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return `Ajouté le ${d.getDate()} ${d.toLocaleString('fr-FR', { month: 'long' })} ${d.getFullYear()}`;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/lecture/${item.bookAbrev}/${item.chapter}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardRef}>{item.book} {item.chapter}:{item.verse}</Text>
        <TouchableOpacity onPress={() => toggle(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.removeBtn}>🗑</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.cardText} numberOfLines={3}>« {item.text} »</Text>
      <Text style={styles.cardDate}>{formatDate(item.addedAt)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        <Text style={styles.headerSub}>{bookmarks.length} verset{bookmarks.length > 1 ? 's' : ''} sauvegardé{bookmarks.length > 1 ? 's' : ''}</Text>
      </View>

      {/* Onglets */}
      <View style={styles.tabs}>
        {[['tous','Tous'], ['recents','Récents']].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, onglet === key && styles.tabActive]}
            onPress={() => setOnglet(key)}
          >
            <Text style={[styles.tabText, onglet === key && styles.tabTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste */}
      {loading ? null : (
        <FlatList
          data={displayed}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔖</Text>
              <Text style={styles.emptyText}>
                Aucun favori pour l'instant.{'\n'}
                Appuyez sur un verset pendant la lecture pour l'ajouter.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Colors.background },
  header:         { backgroundColor: Colors.primary, paddingTop: 16, paddingBottom: 20, alignItems: 'center' },
  headerTitle:    { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub:      { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },

  tabs:           { flexDirection: 'row', backgroundColor: Colors.surface,
                    borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab:            { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive:      { borderBottomWidth: 3, borderBottomColor: Colors.primary },
  tabText:        { color: Colors.textLight, fontSize: 14, fontWeight: '600' },
  tabTextActive:  { color: Colors.primary },

  list:           { padding: 16, paddingBottom: 32 },

  card:           { backgroundColor: Colors.surface, borderRadius: 12, padding: 16,
                    marginBottom: 12, borderLeftWidth: 4, borderLeftColor: Colors.accent,
                    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardRef:        { color: Colors.accent, fontWeight: '700', fontSize: 15 },
  removeBtn:      { fontSize: 16 },
  cardText:       { color: Colors.textPrimary, fontSize: 14, lineHeight: 22, fontStyle: 'italic' },
  cardDate:       { color: Colors.textLight, fontSize: 11, marginTop: 8 },

  empty:          { alignItems: 'center', marginTop: 80 },
  emptyEmoji:     { fontSize: 52, marginBottom: 16 },
  emptyText:      { color: Colors.textLight, fontSize: 15, textAlign: 'center', lineHeight: 24 },
});