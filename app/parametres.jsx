import { View, Text, TouchableOpacity, StyleSheet,
         SafeAreaView, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
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

  const Row = ({ icon, label, right, onPress, danger = false, border = true }) => (
    <TouchableOpacity
      style={[styles.row, border && { borderBottomWidth: 1,
        borderBottomColor: colors.divider }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.rowLabel, { color: danger ? '#E53E3E' : colors.textPrimary }]}>
        {label}
      </Text>
      {right && <View style={styles.rowRight}>{right}</View>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Apparence */}
        <Section title="Apparence">
          <Row
            icon={isDark ? '🌙' : '☀️'}
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
          <Row icon="📖" label="Version de la Bible" right={
            <Text style={[styles.rowValue, { color: colors.textLight }]}>
              Louis Segond
            </Text>
          } />
          <Row icon="📱" label="Version de l'app" right={
            <Text style={[styles.rowValue, { color: colors.textLight }]}>1.0.0</Text>
          } />
          <Row icon="📚" label="Nombre de versets" right={
            <Text style={[styles.rowValue, { color: colors.textLight }]}>30 975</Text>
          } border={false} />
        </Section>

        {/* Données */}
        <Section title="Données">
          <Row
            icon="🗑"
            label="Effacer l'historique de lecture"
            onPress={effacerHistorique}
          />
          <Row
            icon="⚠️"
            label="Réinitialiser toutes les données"
            onPress={effacerTout}
            danger
            border={false}
          />
        </Section>

        {/* Message confirmation */}
        {cleared && (
          <View style={[styles.toast, { backgroundColor: colors.primary }]}>
            <Text style={styles.toastText}>✅ Données effacées !</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={[styles.footer, { color: colors.textLight }]}>
          Ma Bible — Fait avec ❤️{'\n'}
          Toutes les données restent sur votre appareil
        </Text>

      </ScrollView>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 16, paddingBottom: 16, paddingHorizontal: 16 },
  backText:     { color: '#fff', fontSize: 26 },
  headerTitle:  { color: '#fff', fontSize: 20, fontWeight: '700' },

  scroll:       { padding: 16, paddingBottom: 48 },
  section:      { marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5,
                  marginBottom: 8, marginLeft: 4 },
  sectionBox:   { borderRadius: 14, overflow: 'hidden', borderWidth: 1 },

  row:          { flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: 16, paddingVertical: 15 },
  rowIcon:      { fontSize: 20, marginRight: 12, width: 28, textAlign: 'center' },
  rowLabel:     { flex: 1, fontSize: 15 },
  rowRight:     { alignItems: 'flex-end' },
  rowValue:     { fontSize: 14 },

  toast:        { borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 16 },
  toastText:    { color: '#fff', fontWeight: '700', fontSize: 14 },

  footer:       { textAlign: 'center', fontSize: 13, lineHeight: 22, marginTop: 8 },
});