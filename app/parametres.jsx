import { View, Text, TouchableOpacity, StyleSheet,
         SafeAreaView, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import BottomTabBar from '../components/BottomTabBar';

export default function ParametresScreen() {
  const router          = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
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
        <Ionicons
          name={iconName}
          size={18}
          color={danger ? '#E53E3E' : colors.accent}
        />
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Apparence */}
        <Section title="Apparence">
          <Row
            iconName={isDark ? 'moon' : 'sunny'}
            label={isDark ? 'Mode sombre actif' : 'Mode clair actif'}
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
        <Section title="À propos">
          <Row
            iconName="book-outline"
            label="Version de la Bible"
            right={
              <Text style={[styles.rowValue, { color: colors.textLight }]}>
                Louis Segond
              </Text>
            }
          />
          <Row
            iconName="phone-portrait-outline"
            label="Version de l'app"
            right={
              <Text style={[styles.rowValue, { color: colors.textLight }]}>1.0.0</Text>
            }
          />
          <Row
            iconName="layers-outline"
            label="Nombre de versets"
            right={
              <Text style={[styles.rowValue, { color: colors.textLight }]}>30 975</Text>
            }
            border={false}
          />
        </Section>

        {/* Données */}
        <Section title="Données">
          <Row
            iconName="time-outline"
            label="Effacer l'historique de lecture"
            onPress={effacerHistorique}
          />
          <Row
            iconName="warning-outline"
            label="Réinitialiser toutes les données"
            onPress={effacerTout}
            danger
            border={false}
          />
        </Section>

        {/* Toast confirmation */}
        {cleared && (
          <View style={[styles.toast, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.toastText}>Données effacées !</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footerBox}>
          <Ionicons name="heart" size={16} color={colors.accent} />
          <Text style={[styles.footer, { color: colors.textLight }]}>
            {'  '}Ma Bible — Fait avec amour{'\n'}
            Toutes les données restent sur votre appareil
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

  toast:        { borderRadius: 12, padding: 14, alignItems: 'center',
                  marginBottom: 16, flexDirection: 'row', justifyContent: 'center' },
  toastText:    { color: '#fff', fontWeight: '700', fontSize: 14 },

  footerBox:    { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center',
                  marginTop: 8 },
  footer:       { textAlign: 'center', fontSize: 13, lineHeight: 22 },
});