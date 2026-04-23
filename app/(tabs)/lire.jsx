import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { BIBLE_STRUCTURE } from '../../constants/bibleStructure';
import Colors from '../../constants/colors';

export default function LireScreen() {
  const router = useRouter();
  const [testament, setTestament] = useState('ancien');

  const data = testament === 'ancien'
    ? BIBLE_STRUCTURE.ancienTestament
    : BIBLE_STRUCTURE.nouveauTestament;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Livres de la Bible</Text>
      </View>

      {/* Onglets Testament */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, testament === 'ancien' && styles.tabActive]}
          onPress={() => setTestament('ancien')}
        >
          <Text style={[styles.tabText, testament === 'ancien' && styles.tabTextActive]}>
            Ancien Testament
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, testament === 'nouveau' && styles.tabActive]}
          onPress={() => setTestament('nouveau')}
        >
          <Text style={[styles.tabText, testament === 'nouveau' && styles.tabTextActive]}>
            Nouveau Testament
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {data.categories.map((categorie) => (
          <View key={categorie.nom} style={styles.categorie}>
            <Text style={styles.categorieTitle}>{categorie.nom.toUpperCase()}</Text>
            {categorie.livres.map((livre) => (
              <TouchableOpacity
                key={livre.abrev}
                style={styles.livreRow}
                onPress={() => router.push(`/lecture/${livre.abrev}`)}
              >
                <View style={styles.livreAvatar}>
                  <Text style={styles.livreAvatarText}>{livre.abrev.slice(0, 2)}</Text>
                </View>
                <View style={styles.livreInfo}>
                  <Text style={styles.livreName}>{livre.nom}</Text>
                  <Text style={styles.livreSub}>{livre.chapitres} chapitres</Text>
                </View>
                <Text style={styles.livreArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: Colors.background },
  header:           { backgroundColor: Colors.primary, paddingTop: 16, paddingBottom: 20, alignItems: 'center' },
  headerTitle:      { color: '#fff', fontSize: 20, fontWeight: '700' },

  // Onglets
  tabs:             { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab:              { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive:        { borderBottomWidth: 3, borderBottomColor: Colors.primary },
  tabText:          { color: Colors.textLight, fontSize: 14, fontWeight: '600' },
  tabTextActive:    { color: Colors.primary },

  scroll:           { padding: 16, paddingBottom: 32 },

  // Catégories
  categorie:        { marginBottom: 24 },
  categorieTitle:   { color: Colors.accent, fontSize: 12, fontWeight: '800',
                      letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },

  // Livres
  livreRow:         { backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
                      flexDirection: 'row', alignItems: 'center', marginBottom: 8,
                      shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  livreAvatar:      { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.primary,
                      justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  livreAvatarText:  { color: '#fff', fontWeight: '700', fontSize: 13 },
  livreInfo:        { flex: 1 },
  livreName:        { color: Colors.textPrimary, fontWeight: '600', fontSize: 15 },
  livreSub:         { color: Colors.textLight, fontSize: 12, marginTop: 2 },
  livreArrow:       { color: Colors.textLight, fontSize: 26 },
});