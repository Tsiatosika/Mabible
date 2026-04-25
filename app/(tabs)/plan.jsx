// app/(tabs)/plan.jsx
import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Modal, Pressable
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

const PLANS = [
  {
    id: 'bible_1an',
    titre: 'Bible en 1 an',
    description: 'Lisez toute la Bible en 365 jours',
    emoji: '📖',
    duree: '365 jours',
    chapitresParJour: 3,
    total: 1189,
  },
  {
    id: 'nouveau_testament',
    titre: 'Nouveau Testament en 30 jours',
    description: 'Parcourez les 27 livres du N.T.',
    emoji: '✝️',
    duree: '30 jours',
    chapitresParJour: 9,
    total: 260,
  },
  {
    id: 'psaumes_30',
    titre: 'Psaumes en 30 jours',
    description: '150 Psaumes en un mois',
    emoji: '🎵',
    duree: '30 jours',
    chapitresParJour: 5,
    total: 150,
  },
  {
    id: 'evangiles',
    titre: 'Les 4 Évangiles en 30 jours',
    description: 'Matthieu, Marc, Luc et Jean',
    emoji: '🕊️',
    duree: '30 jours',
    chapitresParJour: 3,
    total: 89,
  },
  {
    id: 'proverbes',
    titre: 'Proverbes en 31 jours',
    description: 'Un chapitre par jour',
    emoji: '💡',
    duree: '31 jours',
    chapitresParJour: 1,
    total: 31,
  },
];

const PLAN_CHAPITRES = {
  bible_1an: [
    ...Array.from({ length: 50  }, (_, i) => ({ book: 'Gn',  chapter: i + 1 })),
    ...Array.from({ length: 40  }, (_, i) => ({ book: 'Ex',  chapter: i + 1 })),
    ...Array.from({ length: 27  }, (_, i) => ({ book: 'Lv',  chapter: i + 1 })),
    ...Array.from({ length: 36  }, (_, i) => ({ book: 'Nb',  chapter: i + 1 })),
    ...Array.from({ length: 34  }, (_, i) => ({ book: 'Dt',  chapter: i + 1 })),
    ...Array.from({ length: 24  }, (_, i) => ({ book: 'Jos', chapter: i + 1 })),
    ...Array.from({ length: 21  }, (_, i) => ({ book: 'Jg',  chapter: i + 1 })),
    ...Array.from({ length: 4   }, (_, i) => ({ book: 'Rt',  chapter: i + 1 })),
    ...Array.from({ length: 31  }, (_, i) => ({ book: '1S',  chapter: i + 1 })),
    ...Array.from({ length: 24  }, (_, i) => ({ book: '2S',  chapter: i + 1 })),
    ...Array.from({ length: 22  }, (_, i) => ({ book: '1R',  chapter: i + 1 })),
    ...Array.from({ length: 25  }, (_, i) => ({ book: '2R',  chapter: i + 1 })),
    ...Array.from({ length: 29  }, (_, i) => ({ book: '1Ch', chapter: i + 1 })),
    ...Array.from({ length: 36  }, (_, i) => ({ book: '2Ch', chapter: i + 1 })),
    ...Array.from({ length: 10  }, (_, i) => ({ book: 'Esd', chapter: i + 1 })),
    ...Array.from({ length: 13  }, (_, i) => ({ book: 'Ne',  chapter: i + 1 })),
    ...Array.from({ length: 10  }, (_, i) => ({ book: 'Est', chapter: i + 1 })),
    ...Array.from({ length: 42  }, (_, i) => ({ book: 'Jb',  chapter: i + 1 })),
    ...Array.from({ length: 150 }, (_, i) => ({ book: 'Ps',  chapter: i + 1 })),
    ...Array.from({ length: 31  }, (_, i) => ({ book: 'Pr',  chapter: i + 1 })),
    ...Array.from({ length: 12  }, (_, i) => ({ book: 'Ec',  chapter: i + 1 })),
    ...Array.from({ length: 8   }, (_, i) => ({ book: 'Ct',  chapter: i + 1 })),
    ...Array.from({ length: 66  }, (_, i) => ({ book: 'Es',  chapter: i + 1 })),
    ...Array.from({ length: 52  }, (_, i) => ({ book: 'Jr',  chapter: i + 1 })),
    ...Array.from({ length: 5   }, (_, i) => ({ book: 'Lm',  chapter: i + 1 })),
    ...Array.from({ length: 48  }, (_, i) => ({ book: 'Ez',  chapter: i + 1 })),
    ...Array.from({ length: 12  }, (_, i) => ({ book: 'Dn',  chapter: i + 1 })),
    ...Array.from({ length: 28  }, (_, i) => ({ book: 'Mt',  chapter: i + 1 })),
    ...Array.from({ length: 16  }, (_, i) => ({ book: 'Mc',  chapter: i + 1 })),
    ...Array.from({ length: 24  }, (_, i) => ({ book: 'Lc',  chapter: i + 1 })),
    ...Array.from({ length: 21  }, (_, i) => ({ book: 'Jn',  chapter: i + 1 })),
    ...Array.from({ length: 28  }, (_, i) => ({ book: 'Ac',  chapter: i + 1 })),
    ...Array.from({ length: 16  }, (_, i) => ({ book: 'Rm',  chapter: i + 1 })),
    ...Array.from({ length: 16  }, (_, i) => ({ book: '1Co', chapter: i + 1 })),
    ...Array.from({ length: 13  }, (_, i) => ({ book: '2Co', chapter: i + 1 })),
    ...Array.from({ length: 22  }, (_, i) => ({ book: 'Ap',  chapter: i + 1 })),
  ],
  psaumes_30:        Array.from({ length: 150 }, (_, i) => ({ book: 'Ps',  chapter: i + 1 })),
  proverbes:         Array.from({ length: 31  }, (_, i) => ({ book: 'Pr',  chapter: i + 1 })),
  evangiles: [
    ...Array.from({ length: 28 }, (_, i) => ({ book: 'Mt', chapter: i + 1 })),
    ...Array.from({ length: 16 }, (_, i) => ({ book: 'Mc', chapter: i + 1 })),
    ...Array.from({ length: 24 }, (_, i) => ({ book: 'Lc', chapter: i + 1 })),
    ...Array.from({ length: 21 }, (_, i) => ({ book: 'Jn', chapter: i + 1 })),
  ],
  nouveau_testament: [
    ...Array.from({ length: 28 }, (_, i) => ({ book: 'Mt',  chapter: i + 1 })),
    ...Array.from({ length: 16 }, (_, i) => ({ book: 'Mc',  chapter: i + 1 })),
    ...Array.from({ length: 24 }, (_, i) => ({ book: 'Lc',  chapter: i + 1 })),
    ...Array.from({ length: 21 }, (_, i) => ({ book: 'Jn',  chapter: i + 1 })),
    ...Array.from({ length: 28 }, (_, i) => ({ book: 'Ac',  chapter: i + 1 })),
    ...Array.from({ length: 16 }, (_, i) => ({ book: 'Rm',  chapter: i + 1 })),
    ...Array.from({ length: 16 }, (_, i) => ({ book: '1Co', chapter: i + 1 })),
    ...Array.from({ length: 13 }, (_, i) => ({ book: '2Co', chapter: i + 1 })),
    ...Array.from({ length: 6  }, (_, i) => ({ book: 'Ga',  chapter: i + 1 })),
    ...Array.from({ length: 6  }, (_, i) => ({ book: 'Ep',  chapter: i + 1 })),
    ...Array.from({ length: 4  }, (_, i) => ({ book: 'Ph',  chapter: i + 1 })),
    ...Array.from({ length: 4  }, (_, i) => ({ book: 'Col', chapter: i + 1 })),
    ...Array.from({ length: 22 }, (_, i) => ({ book: 'Ap',  chapter: i + 1 })),
  ],
};

const STORAGE_KEY = '@bible:plan_actif';

export default function PlanScreen() {
  const router     = useRouter();
  const { colors } = useTheme();

  const [planActif,    setPlanActif]    = useState(null);
  const [progression,  setProgression]  = useState([]);
  const [onglet,       setOnglet]       = useState('plans');

  // Modal confirmation démarrer
  const [modalDemarrer,  setModalDemarrer]  = useState(false);
  const [planChoisi,     setPlanChoisi]     = useState(null);

  // Modal confirmation abandonner
  const [modalAbandonner, setModalAbandonner] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          if (raw) {
            const data = JSON.parse(raw);
            setPlanActif(data.plan);
            setProgression(data.progression || []);
          }
        } catch {}
      })();
    }, [])
  );

  // ── Démarrer un plan ────────────────────────────────────────────────────────
  function confirmerDemarrer(plan) {
    setPlanChoisi(plan);
    setModalDemarrer(true);
  }

  async function demarrerPlan() {
    const data = {
      plan:       planChoisi,
      progression: [],
      startedAt:  new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setPlanActif(planChoisi);
    setProgression([]);
    setModalDemarrer(false);
    setOnglet('progression');
  }

  // ── Marquer lu ─────────────────────────────────────────────────────────────
  async function marquerLu(index) {
    const newProg = progression.includes(index)
      ? progression.filter(i => i !== index)
      : [...progression, index];
    setProgression(newProg);
    const raw  = await AsyncStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, progression: newProg }));
  }

  // ── Abandonner ─────────────────────────────────────────────────────────────
  async function abandonnerPlan() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setPlanActif(null);
    setProgression([]);
    setModalAbandonner(false);
    setOnglet('plans');
  }

  // ── Calculs ────────────────────────────────────────────────────────────────
  const chapitresPlan = planActif ? (PLAN_CHAPITRES[planActif.id] || []) : [];
  const total         = chapitresPlan.length;
  const lus           = progression.length;
  const pourcentage   = total > 0 ? Math.round((lus / total) * 100) : 0;
  const prochainIndex = chapitresPlan.findIndex((_, i) => !progression.includes(i));
  const prochain      = prochainIndex >= 0 ? chapitresPlan[prochainIndex] : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Plan de lecture</Text>
        <Text style={styles.headerSub}>
          {planActif ? planActif.titre : 'Choisissez un plan'}
        </Text>
      </View>

      {/* Onglets */}
      <View style={[styles.tabs, { backgroundColor: colors.surface,
        borderBottomColor: colors.border }]}>
        {[['plans', '📋 Plans'], ['progression', '📊 Progression']].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, onglet === key && {
              borderBottomWidth: 3, borderBottomColor: colors.primary,
            }]}
            onPress={() => setOnglet(key)}
          >
            <Text style={[styles.tabText,
              { color: onglet === key ? colors.primary : colors.textLight }]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Onglet Plans ── */}
        {onglet === 'plans' && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Choisissez votre rythme de lecture
            </Text>
            {PLANS.map((plan) => {
              const estActif = planActif?.id === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[styles.planCard, {
                    backgroundColor: colors.surface,
                    borderColor: estActif ? colors.primary : colors.border,
                    borderWidth: estActif ? 2 : 1,
                  }]}
                  onPress={() => confirmerDemarrer(plan)}
                >
                  <View style={styles.planHeader}>
                    <Text style={styles.planEmoji}>{plan.emoji}</Text>
                    <View style={styles.planInfo}>
                      <Text style={[styles.planTitre, { color: colors.textPrimary }]}>
                        {plan.titre}
                      </Text>
                      <Text style={[styles.planDesc, { color: colors.textSecondary }]}>
                        {plan.description}
                      </Text>
                    </View>
                    {estActif && (
                      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.badgeText}>Actif</Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.planFooter, { borderTopColor: colors.divider }]}>
                    <Text style={[styles.planMeta, { color: colors.textLight }]}>
                      ⏱ {plan.duree}
                    </Text>
                    <Text style={[styles.planMeta, { color: colors.textLight }]}>
                      📖 {plan.chapitresParJour} ch/jour
                    </Text>
                    <Text style={[styles.planMeta, { color: colors.textLight }]}>
                      📚 {plan.total} chapitres
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* ── Onglet Progression ── */}
        {onglet === 'progression' && (
          <>
            {!planActif ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📅</Text>
                <Text style={[styles.emptyText, { color: colors.textLight }]}>
                  Aucun plan actif.{'\n'}Choisissez un plan pour commencer !
                </Text>
                <TouchableOpacity
                  style={[styles.startBtn, { backgroundColor: colors.primary }]}
                  onPress={() => setOnglet('plans')}
                >
                  <Text style={styles.startBtnText}>Voir les plans →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Carte progression */}
                <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.progressTitre, { color: colors.textPrimary }]}>
                    {planActif.emoji} {planActif.titre}
                  </Text>
                  <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                    <View style={[styles.progressBarFill, {
                      backgroundColor: colors.primary,
                      width: `${pourcentage}%`,
                    }]} />
                  </View>
                  <View style={styles.progressStats}>
                    <Text style={[styles.progressNum, { color: colors.primary }]}>
                      {lus}
                    </Text>
                    <Text style={[styles.progressSlash, { color: colors.textLight }]}>
                      /{total} chapitres
                    </Text>
                    <View style={[styles.pctBadge, { backgroundColor: colors.accent }]}>
                      <Text style={styles.pctText}>{pourcentage}%</Text>
                    </View>
                  </View>
                </View>

                {/* Félicitations */}
                {lus === total && total > 0 && (
                  <View style={[styles.completedCard, { backgroundColor: colors.accent }]}>
                    <Text style={styles.completedEmoji}>🎉</Text>
                    <Text style={styles.completedText}>Plan terminé ! Félicitations !</Text>
                  </View>
                )}

                {/* Prochain chapitre */}
                {prochain && (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                      Prochain chapitre
                    </Text>
                    <TouchableOpacity
                      style={[styles.prochainCard, { backgroundColor: colors.primary }]}
                      onPress={() => {
                        marquerLu(prochainIndex);
                        router.push(`/lecture/${prochain.book}/${prochain.chapter}`);
                      }}
                    >
                      <Text style={styles.prochainText}>
                        📖 {prochain.book} — Chapitre {prochain.chapter}
                      </Text>
                      <Text style={styles.prochainSub}>
                        Appuyez pour lire et marquer comme lu ›
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Liste chapitres */}
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  Tous les chapitres ({lus}/{total})
                </Text>
                {chapitresPlan.map((chap, index) => {
                  const estLu = progression.includes(index);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.chapRow, {
                        backgroundColor: estLu ? colors.favorite : colors.surface,
                        borderColor: estLu ? colors.favoriteBorder : colors.border,
                      }]}
                      onPress={() => marquerLu(index)}
                      onLongPress={() => router.push(`/lecture/${chap.book}/${chap.chapter}`)}
                    >
                      <View style={[styles.checkbox, {
                        backgroundColor: estLu ? colors.primary : 'transparent',
                        borderColor: estLu ? colors.primary : colors.border,
                      }]}>
                        {estLu && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={[styles.chapRowText, { color: colors.textPrimary }]}>
                        {chap.book} — Chapitre {chap.chapter}
                      </Text>
                      <Text style={[styles.chapRowHint, { color: colors.textLight }]}>
                        {estLu ? '✅' : '○'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {/* Abandonner */}
                <TouchableOpacity
                  style={[styles.abandonBtn, { borderColor: '#E53E3E' }]}
                  onPress={() => setModalAbandonner(true)}
                >
                  <Text style={[styles.abandonText, { color: '#E53E3E' }]}>
                    🗑 Abandonner ce plan
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}

      </ScrollView>

      {/* ── Modal Démarrer ── */}
      <Modal visible={modalDemarrer} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalDemarrer(false)}
        >
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <Text style={styles.modalEmoji}>{planChoisi?.emoji}</Text>
            <Text style={[styles.modalTitre, { color: colors.textPrimary }]}>
              {planChoisi?.titre}
            </Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              {planChoisi?.description}
            </Text>

            <View style={[styles.modalInfo, { backgroundColor: colors.surfaceWarm,
              borderColor: colors.border }]}>
              <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>
                ⏱ Durée : {planChoisi?.duree}
              </Text>
              <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>
                📖 Rythme : {planChoisi?.chapitresParJour} chapitres/jour
              </Text>
              <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>
                📚 Total : {planChoisi?.total} chapitres
              </Text>
            </View>

            {planActif && (
              <Text style={[styles.modalWarning, { color: '#E53E3E' }]}>
                ⚠️ Cela remplacera votre plan actuel
              </Text>
            )}

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtnCancel, { borderColor: colors.border }]}
                onPress={() => setModalDemarrer(false)}
              >
                <Text style={[styles.modalBtnCancelText, { color: colors.textSecondary }]}>
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtnConfirm, { backgroundColor: colors.primary }]}
                onPress={demarrerPlan}
              >
                <Text style={styles.modalBtnConfirmText}>🚀 Démarrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* ── Modal Abandonner ── */}
      <Modal visible={modalAbandonner} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalAbandonner(false)}
        >
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <Text style={styles.modalEmoji}>🗑</Text>
            <Text style={[styles.modalTitre, { color: colors.textPrimary }]}>
              Abandonner le plan ?
            </Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              Votre progression sera perdue et ne pourra pas être récupérée.
            </Text>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtnCancel, { borderColor: colors.border }]}
                onPress={() => setModalAbandonner(false)}
              >
                <Text style={[styles.modalBtnCancelText, { color: colors.textSecondary }]}>
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtnConfirm, { backgroundColor: '#E53E3E' }]}
                onPress={abandonnerPlan}
              >
                <Text style={styles.modalBtnConfirmText}>Abandonner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:             { paddingTop: 16, paddingBottom: 20, alignItems: 'center' },
  headerTitle:        { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub:          { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },

  tabs:               { flexDirection: 'row', borderBottomWidth: 1 },
  tab:                { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabText:            { fontSize: 13, fontWeight: '600' },

  scroll:             { padding: 16, paddingBottom: 48 },
  sectionLabel:       { fontSize: 12, fontWeight: '700', marginBottom: 12,
                        letterSpacing: 1, textTransform: 'uppercase' },

  // Plans
  planCard:           { borderRadius: 14, padding: 16, marginBottom: 14,
                        shadowColor: '#000', shadowOpacity: 0.05,
                        shadowRadius: 6, elevation: 2 },
  planHeader:         { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  planEmoji:          { fontSize: 32, marginRight: 12 },
  planInfo:           { flex: 1 },
  planTitre:          { fontWeight: '700', fontSize: 16, marginBottom: 2 },
  planDesc:           { fontSize: 13, lineHeight: 18 },
  badge:              { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText:          { color: '#fff', fontSize: 11, fontWeight: '700' },
  planFooter:         { flexDirection: 'row', justifyContent: 'space-between',
                        paddingTop: 10, borderTopWidth: 1 },
  planMeta:           { fontSize: 12 },

  // Progression
  progressCard:       { borderRadius: 14, padding: 20, marginBottom: 20,
                        shadowColor: '#000', shadowOpacity: 0.05,
                        shadowRadius: 6, elevation: 2 },
  progressTitre:      { fontSize: 17, fontWeight: '700', marginBottom: 16,
                        textAlign: 'center' },
  progressBarBg:      { height: 12, borderRadius: 6, marginBottom: 14, overflow: 'hidden' },
  progressBarFill:    { height: 12, borderRadius: 6 },
  progressStats:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        gap: 8 },
  progressNum:        { fontSize: 32, fontWeight: '800' },
  progressSlash:      { fontSize: 16 },
  pctBadge:           { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pctText:            { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Terminé
  completedCard:      { borderRadius: 14, padding: 20, alignItems: 'center',
                        marginBottom: 20 },
  completedEmoji:     { fontSize: 40, marginBottom: 8 },
  completedText:      { color: '#fff', fontWeight: '700', fontSize: 18 },

  // Prochain
  prochainCard:       { borderRadius: 12, padding: 18, alignItems: 'center' },
  prochainText:       { color: '#fff', fontWeight: '700', fontSize: 16 },
  prochainSub:        { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 },

  // Chapitres
  chapRow:            { flexDirection: 'row', alignItems: 'center', borderRadius: 10,
                        padding: 12, marginBottom: 8, borderWidth: 1 },
  checkbox:           { width: 22, height: 22, borderRadius: 6, borderWidth: 2,
                        justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkmark:          { color: '#fff', fontSize: 13, fontWeight: '700' },
  chapRowText:        { flex: 1, fontSize: 14, fontWeight: '500' },
  chapRowHint:        { fontSize: 14 },

  // Vide
  emptyState:         { alignItems: 'center', marginTop: 60 },
  emptyEmoji:         { fontSize: 52, marginBottom: 16 },
  emptyText:          { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  startBtn:           { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  startBtnText:       { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Abandonner
  abandonBtn:         { borderWidth: 1, borderRadius: 12, paddingVertical: 14,
                        alignItems: 'center', marginTop: 16, marginBottom: 8 },
  abandonText:        { fontWeight: '600', fontSize: 14 },

  // Modals
  modalOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox:           { borderRadius: 20, padding: 28, width: '100%',
                        maxWidth: 400, alignItems: 'center',
                        shadowColor: '#000', shadowOpacity: 0.2,
                        shadowRadius: 20, elevation: 10 },
  modalEmoji:         { fontSize: 48, marginBottom: 12 },
  modalTitre:         { fontSize: 20, fontWeight: '700', marginBottom: 8,
                        textAlign: 'center' },
  modalDesc:          { fontSize: 14, textAlign: 'center', lineHeight: 20,
                        marginBottom: 16 },
  modalInfo:          { borderRadius: 12, padding: 14, width: '100%',
                        borderWidth: 1, marginBottom: 16, gap: 6 },
  modalInfoText:      { fontSize: 14 },
  modalWarning:       { fontSize: 13, fontWeight: '600', marginBottom: 16,
                        textAlign: 'center' },
  modalBtns:          { flexDirection: 'row', gap: 12, width: '100%' },
  modalBtnCancel:     { flex: 1, borderWidth: 1, borderRadius: 12,
                        paddingVertical: 14, alignItems: 'center' },
  modalBtnCancelText: { fontWeight: '600', fontSize: 14 },
  modalBtnConfirm:    { flex: 1, borderRadius: 12, paddingVertical: 14,
                        alignItems: 'center' },
  modalBtnConfirmText:{ color: '#fff', fontWeight: '700', fontSize: 14 },
});