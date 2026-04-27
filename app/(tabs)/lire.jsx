import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BIBLE_STRUCTURE } from '../../constants/bibleStructure';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function LireScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, isFr } = useLanguage();
  const [testament, setTestament] = useState('ancien');

  const data = testament === 'ancien'
    ? BIBLE_STRUCTURE.ancienTestament
    : BIBLE_STRUCTURE.nouveauTestament;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>{t.booksTitle}</Text>
      </View>

      {/* Onglets */}
      <View style={[styles.tabs, { backgroundColor: colors.surface,
        borderBottomColor: colors.border }]}>
        {[
          ['ancien',  'library-outline',  'library',  isFr ? 'Ancien Testament' : 'Old Testament'],
          ['nouveau', 'heart-outline',    'heart',    isFr ? 'Nouveau Testament' : 'New Testament'],
        ].map(([key, iconOff, iconOn, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, testament === key && {
              borderBottomWidth: 3, borderBottomColor: colors.primary
            }]}
            onPress={() => setTestament(key)}
          >
            <Ionicons
              name={testament === key ? iconOn : iconOff}
              size={15}
              color={testament === key ? colors.primary : colors.textLight}
              style={{ marginRight: 5 }}
            />
            <Text style={[styles.tabText,
              { color: testament === key ? colors.primary : colors.textLight }]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {data.categories.map((categorie) => (
          <View key={categorie.nom} style={styles.categorie}>
            <Text style={[styles.categorieTitle, { color: colors.accent }]}>
              {(isFr ? categorie.nom : categorie.nomEn).toUpperCase()}
            </Text>
            {categorie.livres.map((livre) => (
              <TouchableOpacity
                key={livre.abrev}
                style={[styles.livreRow, { backgroundColor: colors.surface,
                  borderColor: colors.border }]}
                onPress={() => router.push(`/lecture/${livre.abrev}`)}
              >
                <View style={[styles.livreAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.livreAvatarText}>{livre.abrev.slice(0, 2)}</Text>
                </View>
                <View style={styles.livreInfo}>
                  <Text style={[styles.livreName, { color: colors.textPrimary }]}>
                    {isFr ? livre.nom : livre.nomEn}
                  </Text>
                  <Text style={[styles.livreSub, { color: colors.textLight }]}>
                    {t.chapters(livre.chapitres)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:          { paddingTop: 16, paddingBottom: 20, alignItems: 'center' },
  headerTitle:     { color: '#fff', fontSize: 20, fontWeight: '700' },
  tabs:            { flexDirection: 'row', borderBottomWidth: 1 },
  tab:             { flex: 1, paddingVertical: 14, alignItems: 'center',
                     flexDirection: 'row', justifyContent: 'center' },
  tabText:         { fontSize: 13, fontWeight: '600' },
  scroll:          { padding: 16, paddingBottom: 32 },
  categorie:       { marginBottom: 24 },
  categorieTitle:  { fontSize: 12, fontWeight: '800', letterSpacing: 1.5,
                     marginBottom: 8, marginLeft: 4 },
  livreRow:        { borderRadius: 12, padding: 14, flexDirection: 'row',
                     alignItems: 'center', marginBottom: 8, borderWidth: 1,
                     shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  livreAvatar:     { width: 42, height: 42, borderRadius: 21, justifyContent: 'center',
                     alignItems: 'center', marginRight: 12 },
  livreAvatarText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  livreInfo:       { flex: 1 },
  livreName:       { fontWeight: '600', fontSize: 15 },
  livreSub:        { fontSize: 12, marginTop: 2 },
});