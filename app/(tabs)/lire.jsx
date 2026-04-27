// app/(tabs)/lire.jsx
import { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BIBLE_STRUCTURE } from '../../constants/bibleStructure';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

// Couleurs par catégorie
const CATEGORY_COLORS = {
  // Ancien Testament
  'Pentateuque':        { bg: '#FFF3E0', icon: '#E65100', border: '#FFCC80' },
  'Livres historiques': { bg: '#E8F5E9', icon: '#2E7D32', border: '#A5D6A7' },
  'Livres poétiques':   { bg: '#E3F2FD', icon: '#1565C0', border: '#90CAF9' },
  'Livres prophétiques':{ bg: '#F3E5F5', icon: '#6A1B9A', border: '#CE93D8' },
  // Nouveau Testament
  'Évangiles':          { bg: '#FFF8E1', icon: '#F57F17', border: '#FFE082' },
  'Histoire':           { bg: '#E0F7FA', icon: '#00695C', border: '#80DEEA' },
  'Épîtres de Paul':    { bg: '#FCE4EC', icon: '#880E4F', border: '#F48FB1' },
  'Épîtres générales':  { bg: '#E8EAF6', icon: '#283593', border: '#9FA8DA' },
  'Prophétie':          { bg: '#FBE9E7', icon: '#BF360C', border: '#FFAB91' },
  // English
  'Pentateuch':         { bg: '#FFF3E0', icon: '#E65100', border: '#FFCC80' },
  'Historical Books':   { bg: '#E8F5E9', icon: '#2E7D32', border: '#A5D6A7' },
  'Poetic Books':       { bg: '#E3F2FD', icon: '#1565C0', border: '#90CAF9' },
  'Prophetic Books':    { bg: '#F3E5F5', icon: '#6A1B9A', border: '#CE93D8' },
  'Gospels':            { bg: '#FFF8E1', icon: '#F57F17', border: '#FFE082' },
  'History':            { bg: '#E0F7FA', icon: '#00695C', border: '#80DEEA' },
  "Paul's Epistles":    { bg: '#FCE4EC', icon: '#880E4F', border: '#F48FB1' },
  'General Epistles':   { bg: '#E8EAF6', icon: '#283593', border: '#9FA8DA' },
  'Prophecy':           { bg: '#FBE9E7', icon: '#BF360C', border: '#FFAB91' },
};

const DEFAULT_CAT_COLOR = { bg: '#F5F5F5', icon: '#616161', border: '#E0E0E0' };

// Icône par catégorie
const CATEGORY_ICONS = {
  'Pentateuque':        'flame',
  'Livres historiques': 'time',
  'Livres poétiques':   'musical-notes',
  'Livres prophétiques':'eye',
  'Évangiles':          'star',
  'Histoire':           'map',
  'Épîtres de Paul':    'mail',
  'Épîtres générales':  'document-text',
  'Prophétie':          'alert-circle',
  'Pentateuch':         'flame',
  'Historical Books':   'time',
  'Poetic Books':       'musical-notes',
  'Prophetic Books':    'eye',
  'Gospels':            'star',
  'History':            'map',
  "Paul's Epistles":    'mail',
  'General Epistles':   'document-text',
  'Prophecy':           'alert-circle',
};

// Stats par testament
const STATS = {
  ancien:  { livres: 39, chapitres: 929,  versets: 23145 },
  nouveau: { livres: 27, chapitres: 260,  versets: 7957  },
};

export default function LireScreen() {
  const router          = useRouter();
  const { colors, isDark } = useTheme();
  const { t, isFr }     = useLanguage();
  const [testament, setTestament] = useState('ancien');
  const [expanded, setExpanded]   = useState({});

  const data = testament === 'ancien'
    ? BIBLE_STRUCTURE.ancienTestament
    : BIBLE_STRUCTURE.nouveauTestament;

  const stats = STATS[testament];

  function toggleCategorie(nom) {
    setExpanded(prev => ({ ...prev, [nom]: !prev[nom] }));
  }

  // Par défaut toutes les catégories sont ouvertes
  function isExpanded(nom) {
    return expanded[nom] !== false; // true par défaut
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>{t.booksTitle}</Text>

        {/* Stats en bas du header */}
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNum}>{stats.livres}</Text>
            <Text style={styles.headerStatLabel}>
              {isFr ? 'livres' : 'books'}
            </Text>
          </View>
          <View style={styles.headerStatDiv} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNum}>{stats.chapitres}</Text>
            <Text style={styles.headerStatLabel}>
              {isFr ? 'chapitres' : 'chapters'}
            </Text>
          </View>
          <View style={styles.headerStatDiv} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNum}>{stats.versets.toLocaleString()}</Text>
            <Text style={styles.headerStatLabel}>
              {isFr ? 'versets' : 'verses'}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Onglets Testament ── */}
      <View style={[styles.tabs, {
        backgroundColor:   colors.surface,
        borderBottomColor: colors.border,
      }]}>
        {[
          {
            key:    'ancien',
            iconOff:'library-outline',
            iconOn: 'library',
            label:  isFr ? 'Ancien Testament' : 'Old Testament',
          },
          {
            key:    'nouveau',
            iconOff:'heart-outline',
            iconOn: 'heart',
            label:  isFr ? 'Nouveau Testament' : 'New Testament',
          },
        ].map(({ key, iconOff, iconOn, label }) => {
          const active = testament === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.tab, active && {
                borderBottomWidth: 3,
                borderBottomColor: colors.primary,
              }]}
              onPress={() => setTestament(key)}
            >
              <Ionicons
                name={active ? iconOn : iconOff}
                size={15}
                color={active ? colors.primary : colors.textLight}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.tabText, {
                color: active ? colors.primary : colors.textLight,
              }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Liste ── */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {data.categories.map((categorie) => {
          const catName  = isFr ? categorie.nom : categorie.nomEn;
          const catColor = CATEGORY_COLORS[catName] || DEFAULT_CAT_COLOR;
          const catIcon  = CATEGORY_ICONS[catName]  || 'book';
          const open     = isExpanded(catName);

          return (
            <View key={catName} style={styles.categorieBlock}>

              {/* ── En-tête catégorie ── */}
              <TouchableOpacity
                style={[styles.categorieHeader, {
                  backgroundColor: isDark ? colors.surface : catColor.bg,
                  borderColor:     isDark ? colors.border   : catColor.border,
                }]}
                onPress={() => toggleCategorie(catName)}
                activeOpacity={0.7}
              >
                {/* Icône catégorie */}
                <View style={[styles.catIconBox, {
                  backgroundColor: catColor.icon + '22',
                }]}>
                  <Ionicons name={catIcon} size={18} color={catColor.icon} />
                </View>

                <View style={styles.catInfo}>
                  <Text style={[styles.categorieTitle, { color: catColor.icon }]}>
                    {catName.toUpperCase()}
                  </Text>
                  <Text style={[styles.catSubtitle, { color: colors.textLight }]}>
                    {categorie.livres.length} {isFr ? 'livres' : 'books'}
                  </Text>
                </View>

                <Ionicons
                  name={open ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={catColor.icon}
                />
              </TouchableOpacity>

              {/* ── Livres ── */}
              {open && (
                <View style={[styles.livresContainer, {
                  borderColor: isDark ? colors.border : catColor.border,
                }]}>
                  {categorie.livres.map((livre, index) => {
                    const isLast = index === categorie.livres.length - 1;
                    return (
                      <TouchableOpacity
                        key={livre.abrev}
                        style={[styles.livreRow, {
                          borderBottomWidth: isLast ? 0 : 1,
                          borderBottomColor: colors.divider,
                        }]}
                        onPress={() => router.push(`/lecture/${livre.abrev}`)}
                        activeOpacity={0.6}
                      >
                        {/* Avatar */}
                        <View style={[styles.livreAvatar, {
                          backgroundColor: isDark ? colors.surfaceWarm : catColor.icon + '18',
                          borderWidth: 1.5,
                          borderColor: isDark ? colors.border : catColor.icon + '44',
                        }]}>
                          <Text style={[styles.livreAvatarText, {
                            color: isDark ? colors.accent : catColor.icon,
                          }]}>
                            {livre.abrev.slice(0, 2)}
                          </Text>
                        </View>

                        {/* Infos */}
                        <View style={styles.livreInfo}>
                          <Text style={[styles.livreName, { color: colors.textPrimary }]}>
                            {isFr ? livre.nom : livre.nomEn}
                          </Text>
                          <Text style={[styles.livreSub, { color: colors.textLight }]}>
                            {t.chapters(livre.chapitres)}
                          </Text>
                        </View>

                        {/* Flèche */}
                        <View style={[styles.livreArrow, {
                          backgroundColor: isDark ? colors.surfaceWarm : catColor.icon + '12',
                        }]}>
                          <Ionicons
                            name="chevron-forward"
                            size={14}
                            color={isDark ? colors.textLight : catColor.icon}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

            </View>
          );
        })}

        {/* Padding bas */}
        <View style={{ height: 20 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Header
  header:           { paddingTop: 16, paddingBottom: 16,
                      alignItems: 'center', paddingHorizontal: 20 },
  headerTitle:      { color: '#fff', fontSize: 22, fontWeight: '800',
                      letterSpacing: 0.5, marginBottom: 14 },
  headerStats:      { flexDirection: 'row', alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      borderRadius: 14, paddingVertical: 10,
                      paddingHorizontal: 20, gap: 0 },
  headerStat:       { alignItems: 'center', flex: 1 },
  headerStatNum:    { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerStatLabel:  { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 1 },
  headerStatDiv:    { width: 1, height: 30,
                      backgroundColor: 'rgba(255,255,255,0.3)' },

  // Onglets
  tabs:             { flexDirection: 'row', borderBottomWidth: 1 },
  tab:              { flex: 1, paddingVertical: 13, alignItems: 'center',
                      flexDirection: 'row', justifyContent: 'center' },
  tabText:          { fontSize: 13, fontWeight: '600' },

  // Scroll
  scroll:           { padding: 14, paddingBottom: 32 },

  // Catégorie
  categorieBlock:   { marginBottom: 12 },
  categorieHeader:  { flexDirection: 'row', alignItems: 'center',
                      borderRadius: 12, padding: 12, borderWidth: 1.5,
                      marginBottom: 0 },
  catIconBox:       { width: 36, height: 36, borderRadius: 10,
                      justifyContent: 'center', alignItems: 'center',
                      marginRight: 10 },
  catInfo:          { flex: 1 },
  categorieTitle:   { fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  catSubtitle:      { fontSize: 11, marginTop: 1 },

  // Container livres (sous la catégorie)
  livresContainer:  { borderWidth: 1.5, borderTopWidth: 0,
                      borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
                      overflow: 'hidden', marginBottom: 0 },

  // Ligne livre
  livreRow:         { flexDirection: 'row', alignItems: 'center',
                      paddingVertical: 12, paddingHorizontal: 14,
                      backgroundColor: 'transparent' },
  livreAvatar:      { width: 40, height: 40, borderRadius: 10,
                      justifyContent: 'center', alignItems: 'center',
                      marginRight: 12 },
  livreAvatarText:  { fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  livreInfo:        { flex: 1 },
  livreName:        { fontWeight: '600', fontSize: 15 },
  livreSub:         { fontSize: 12, marginTop: 2 },
  livreArrow:       { width: 28, height: 28, borderRadius: 8,
                      justifyContent: 'center', alignItems: 'center' },
});