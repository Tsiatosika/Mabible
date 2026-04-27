import { View, Text, TouchableOpacity, StyleSheet,
         SafeAreaView, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import BottomTabBar from '../components/BottomTabBar';

export default function ParametresScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { t, language, setLang } = useLanguage();
  const [cleared, setCleared] = useState(false);

  async function effacerHistorique() {
    await AsyncStorage.removeItem('@bible:reading_history');
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  }

  async function effacerTout() {
    await AsyncStorage.clear();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  }

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>
        {title.toUpperCase()}
      </Text>
      <View style={[styles.sectionBox, { backgroundColor: colors.surface,
        borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );

  const Row = ({ iconName, label, right, onPress, danger = false, border = true }) => (
    <TouchableOpacity
      style={[styles.row, border && { borderBottomWidth: 1,
        borderBottomColor: colors.divider }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <View style={[styles.rowIconBox, {
        backgroundColor: danger ? '#FFF0F0' : colors.surfaceWarm,
      }]}>
        <Ionicons name={iconName} size={18} color={danger ? '#E53E3E' : colors.accent} />
      </View>
      <Text style={[styles.rowLabel, { color: danger ? '#E53E3E' : colors.textPrimary }]}>
        {label}
      </Text>
      {right && <View style={styles.rowRight}>{right}</View>}
      {onPress && !right && (
        <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
      )}
    </TouchableOpacity>
  );

  // Sélecteur de langue inline
  const LangSelector = () => (
    <View style={styles.langRow}>
      {[
        { code: 'fr', label: t.french,  flag: '🇫🇷' },
        { code: 'en', label: t.english, flag: '🇬🇧' },
      ].map(({ code, label, flag }) => (
        <TouchableOpacity
          key={code}
          style={[styles.langBtn, {
            backgroundColor: language === code ? colors.primary : colors.surfaceWarm,
            borderColor:     language === code ? colors.primary : colors.border,
          }]}
          onPress={() => setLang(code)}
        >
          <Text style={styles.langFlag}>{flag}</Text>
          <Text style={[styles.langLabel, {
            color: language === code ? '#fff' : colors.textSecondary,
            fontWeight: language === code ? '700' : '500',
          }]}>
            {label}
          </Text>
          {language === code && (
            <Ionicons name="checkmark-circle" size={16} color="#fff"
              style={{ marginLeft: 4 }} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.settings}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Langue */}
        <Section title={t.language_label}>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View style={[styles.rowIconBox, { backgroundColor: colors.surfaceWarm }]}>
              <Ionicons name="globe-outline" size={18} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: colors.textPrimary, marginBottom: 10 }]}>
                {t.language_label}
              </Text>
              <LangSelector />
            </View>
          </View>
        </Section>

        {/* Apparence */}
        <Section title={t.appearance}>
          <Row
            iconName={isDark ? 'moon' : 'sunny'}
            label={isDark ? t.darkModeActive : t.lightModeActive}
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
            border={false}
          />
        </Section>

        {/* À propos */}
        <Section title={t.about}>
          <Row
            iconName="book-outline"
            label={t.bibleVersion}
            right={
              <Text style={[styles.rowValue, { color: colors.textLight }]}>
                {language === 'fr' ? 'Louis Segond' : 'King James'}
              </Text>
            }
          />
          <Row
            iconName="phone-portrait-outline"
            label={t.appVersion}
            right={
              <Text style={[styles.rowValue, { color: colors.textLight }]}>1.0.0</Text>
            }
          />
          <Row
            iconName="layers-outline"
            label={t.verseCount}
            right={
              <Text style={[styles.rowValue, { color: colors.textLight }]}>30 975</Text>
            }
            border={false}
          />
        </Section>

        {/* Données */}
        <Section title={t.data}>
          <Row
            iconName="time-outline"
            label={t.clearHistory}
            onPress={effacerHistorique}
          />
          <Row
            iconName="warning-outline"
            label={t.resetAll}
            onPress={effacerTout}
            danger
            border={false}
          />
        </Section>

        {/* Toast */}
        {cleared && (
          <View style={[styles.toast, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark-circle" size={18} color="#fff"
              style={{ marginRight: 8 }} />
            <Text style={styles.toastText}>{t.cleared}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footerBox}>
          <Ionicons name="heart" size={16} color={colors.accent} />
          <Text style={[styles.footer, { color: colors.textLight }]}>
            {'  '}{t.madeWith}
          </Text>
        </View>

      </ScrollView>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 16, paddingBottom: 16, paddingHorizontal: 16 },
  headerBack:   { width: 40, justifyContent: 'center' },
  headerTitle:  { color: '#fff', fontSize: 20, fontWeight: '700' },

  scroll:       { padding: 16, paddingBottom: 48 },
  section:      { marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5,
                  marginBottom: 8, marginLeft: 4 },
  sectionBox:   { borderRadius: 14, overflow: 'hidden', borderWidth: 1 },

  row:          { flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: 14, paddingVertical: 14 },
  rowIconBox:   { width: 34, height: 34, borderRadius: 9, justifyContent: 'center',
                  alignItems: 'center', marginRight: 12 },
  rowLabel:     { flex: 1, fontSize: 15 },
  rowRight:     { alignItems: 'flex-end' },
  rowValue:     { fontSize: 14 },

  // Langue
  langRow:      { flexDirection: 'row', gap: 10 },
  langBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, gap: 5 },
  langFlag:     { fontSize: 18 },
  langLabel:    { fontSize: 14 },

  toast:        { borderRadius: 12, padding: 14, alignItems: 'center',
                  marginBottom: 16, flexDirection: 'row', justifyContent: 'center' },
  toastText:    { color: '#fff', fontWeight: '700', fontSize: 14 },

  footerBox:    { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center',
                  marginTop: 8 },
  footer:       { textAlign: 'center', fontSize: 13, lineHeight: 22 },
});