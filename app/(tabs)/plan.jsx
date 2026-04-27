import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Modal, Pressable
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

// ── Données des plans (statiques) ────────────────────────────────────────────
const PLANS_DATA = [
  {
    id:              'bible_1an',
    titreFr:         'Bible en 1 an',
    titreEn:         'Bible in 1 year',
    descFr:          'Lisez toute la Bible en 365 jours',
    descEn:          'Read the entire Bible in 365 days',
    icon:            'library',
    duree:           365,
    chapitresParJour: 3,
    total:           1189,
  },
  {
    id:              'nouveau_testament',
    titreFr:         'Nouveau Testament en 30 jours',
    titreEn:         'New Testament in 30 days',
    descFr:          'Parcourez les 27 livres du N.T.',
    descEn:          'Go through all 27 N.T. books',
    icon:            'cross',
    duree:           30,
    chapitresParJour: 9,
    total:           260,
  },
  {
    id:              'psaumes_30',
    titreFr:         'Psaumes en 30 jours',
    titreEn:         'Psalms in 30 days',
    descFr:          '150 Psaumes en un mois',
    descEn:          '150 Psalms in one month',
    icon:            'musical-notes',
    duree:           30,
    chapitresParJour: 5,
    total:           150,
  },
  {
    id:              'evangiles',
    titreFr:         'Les 4 Évangiles en 30 jours',
    titreEn:         'The 4 Gospels in 30 days',
    descFr:          'Matthieu, Marc, Luc et Jean',
    descEn:          'Matthew, Mark, Luke and John',
    icon:            'heart',
    duree:           30,
    chapitresParJour: 3,
    total:           89,
  },
  {
    id:              'proverbes',
    titreFr:         'Proverbes en 31 jours',
    titreEn:         'Proverbs in 31 days',
    descFr:          'Un chapitre par jour',
    descEn:          'One chapter per day',
    icon:            'bulb',
    duree:           31,
    chapitresParJour: 1,
    total:           31,
  },
];

// ── Chapitres par plan ────────────────────────────────────────────────────────
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
  const router      = useRouter();
  const { colors }  = useTheme();
  const { t, isFr } = useLanguage();

  const [planActif,       setPlanActif]       = useState(null);
  const [progression,     setProgression]     = useState([]);
  const [onglet,          setOnglet]          = useState('plans');
  const [modalDemarrer,   setModalDemarrer]   = useState(false);
  const [planChoisi,      setPlanChoisi]      = useState(null);
  const [modalAbandonner, setModalAbandonner] = useState(false);

  // ── Helper : nom traduit d'un plan ─────────────────────────────────────────
  function planTitre(plan) {
    return isFr ? plan.titreFr : plan.titreEn;
  }
  function planDesc(plan) {
    return isFr ? plan.descFr : plan.descEn;
  }
  function dureeLabel(plan) {
    return isFr
      ? `${plan.duree} jours`
      : `${plan.duree} days`;
  }

  // ── Chargement ──────────────────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          if (raw) {
            const data = JSON.parse(raw);
            // Retrouver les données complètes du plan depuis PLANS_DATA
            const fullPlan = PLANS_DATA.find(p => p.id === data.plan?.id) || data.plan;
            setPlanActif(fullPlan);
            setProgression(data.progression || []);
          }
        } catch {}
      })();
    }, [])
  );

  // ── Actions ─────────────────────────────────────────────────────────────────
  function confirmerDemarrer(plan) {
    setPlanChoisi(plan);
    setModalDemarrer(true);
  }

  async function demarrerPlan() {
    const data = {
      plan:        { id: planChoisi.id },
      progression: [],
      startedAt:   new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setPlanActif(planChoisi);
    setProgression([]);
    setModalDemarrer(false);
    setOnglet('progression');
  }

  async function marquerLu(index) {
    const newProg = progression.includes(index)
      ? progression.filter(i => i !== index)
      : [...progression, index];
    setProgression(newProg);
    const raw  = await AsyncStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, progression: newProg }));
  }

  async function abandonnerPlan() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setPlanActif(null);
    setProgression([]);
    setModalAbandonner(false);
    setOnglet('plans');
  }

  // ── Calculs ─────────────────────────────────────────────────────────────────
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
        <Text style={styles.headerTitle}>{t.readingPlan}</Text>
        <Text style={styles.headerSub}>
          {planActif ? planTitre(planActif) : t.choosePlan}
        </Text>
      </View>

      {/* Onglets */}
      <View style={[styles.tabs, {
        backgroundColor:  colors.surface,
        borderBottomColor: colors.border,
      }]}>
        {[
          { key: 'plans',      icon: 'list',      label: t.plans_tab      },
          { key: 'progression',icon: 'bar-chart', label: t.progress_tab   },
        ].map(({ key, icon, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, onglet === key && {
              borderBottomWidth: 3,
              borderBottomColor: colors.primary,
            }]}
            onPress={() => setOnglet(key)}
          >
            <Ionicons
              name={onglet === key ? icon : `${icon}-outline`}
              size={16}
              color={onglet === key ? colors.primary : colors.textLight}
              style={{ marginRight: 5 }}
            />
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
              {t.chooseRhythm}
            </Text>

            {PLANS_DATA.map((plan) => {
              const estActif = planActif?.id === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[styles.planCard, {
                    backgroundColor: colors.surface,
                    borderColor:     estActif ? colors.primary : colors.border,
                    borderWidth:     estActif ? 2 : 1,
                  }]}
                  onPress={() => confirmerDemarrer(plan)}
                >
                  <View style={styles.planHeader}>
                    <View style={[styles.planIconBox, { backgroundColor: colors.surfaceWarm }]}>
                      <Ionicons name={plan.icon} size={28} color={colors.accent} />
                    </View>
                    <View style={styles.planInfo}>
                      <Text style={[styles.planTitre, { color: colors.textPrimary }]}>
                        {planTitre(plan)}
                      </Text>
                      <Text style={[styles.planDesc, { color: colors.textSecondary }]}>
                        {planDesc(plan)}
                      </Text>
                    </View>
                    {estActif && (
                      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.badgeText}>{t.active}</Text>
                      </View>
                    )}
                  </View>

                  <View style={[styles.planFooter, { borderTopColor: colors.divider }]}>
                    <View style={styles.planMetaRow}>
                      <Ionicons name="time-outline" size={12} color={colors.textLight} />
                      <Text style={[styles.planMeta, { color: colors.textLight }]}>
                        {' '}{dureeLabel(plan)}
                      </Text>
                    </View>
                    <View style={styles.planMetaRow}>
                      <Ionicons name="book-outline" size={12} color={colors.textLight} />
                      <Text style={[styles.planMeta, { color: colors.textLight }]}>
                        {' '}{t.chPerDay(plan.chapitresParJour)}
                      </Text>
                    </View>
                    <View style={styles.planMetaRow}>
                      <Ionicons name="layers-outline" size={12} color={colors.textLight} />
                      <Text style={[styles.planMeta, { color: colors.textLight }]}>
                        {' '}{plan.total} {isFr ? 'chapitres' : 'chapters'}
                      </Text>
                    </View>
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
                <Ionicons name="calendar-outline" size={52} color={colors.textLight} />
                <Text style={[styles.emptyText, { color: colors.textLight }]}>
                  {t.noPlan}
                </Text>
                <TouchableOpacity
                  style={[styles.startBtn, { backgroundColor: colors.primary }]}
                  onPress={() => setOnglet('plans')}
                >
                  <Text style={styles.startBtnText}>{t.seePlans}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Carte progression */}
                <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.progressHeader}>
                    <Ionicons name={planActif.icon} size={20} color={colors.accent} />
                    <Text style={[styles.progressTitre, { color: colors.textPrimary }]}>
                      {planTitre(planActif)}
                    </Text>
                  </View>
                  <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                    <View style={[styles.progressBarFill, {
                      backgroundColor: colors.primary,
                      width: `${pourcentage}%`,
                    }]} />
                  </View>
                  <View style={styles.progressStats}>
                    <Text style={[styles.progressNum, { color: colors.primary }]}>{lus}</Text>
                    <Text style={[styles.progressSlash, { color: colors.textLight }]}>
                      /{total} {isFr ? 'chapitres' : 'chapters'}
                    </Text>
                    <View style={[styles.pctBadge, { backgroundColor: colors.accent }]}>
                      <Text style={styles.pctText}>{pourcentage}%</Text>
                    </View>
                  </View>
                </View>

                {/* Félicitations */}
                {lus === total && total > 0 && (
                  <View style={[styles.completedCard, { backgroundColor: colors.accent }]}>
                    <Ionicons name="trophy" size={40} color="#fff" />
                    <Text style={styles.completedText}>{t.congratulations}</Text>
                  </View>
                )}

                {/* Prochain chapitre */}
                {prochain && (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                      {t.nextChapterLabel}
                    </Text>
                    <TouchableOpacity
                      style={[styles.prochainCard, { backgroundColor: colors.primary }]}
                      onPress={() => {
                        marquerLu(prochainIndex);
                        router.push(`/lecture/${prochain.book}/${prochain.chapter}`);
                      }}
                    >
                      <View style={styles.prochainRow}>
                        <Ionicons name="book" size={18} color="#fff" />
                        <Text style={styles.prochainText}>
                          {prochain.book} — {isFr ? 'Chapitre' : 'Chapter'} {prochain.chapter}
                        </Text>
                      </View>
                      <View style={styles.prochainHint}>
                        <Ionicons name="arrow-forward-circle-outline" size={14}
                          color="rgba(255,255,255,0.75)" />
                        <Text style={styles.prochainSub}>{t.tapToRead}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Liste chapitres */}
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  {t.allChapters(lus, total)}
                </Text>
                {chapitresPlan.map((chap, index) => {
                  const estLu = progression.includes(index);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.chapRow, {
                        backgroundColor: estLu ? colors.favorite : colors.surface,
                        borderColor:     estLu ? colors.favoriteBorder : colors.border,
                      }]}
                      onPress={() => marquerLu(index)}
                      onLongPress={() => router.push(`/lecture/${chap.book}/${chap.chapter}`)}
                    >
                      <View style={[styles.checkbox, {
                        backgroundColor: estLu ? colors.primary : 'transparent',
                        borderColor:     estLu ? colors.primary : colors.border,
                      }]}>
                        {estLu && <Ionicons name="checkmark" size={13} color="#fff" />}
                      </View>
                      <Text style={[styles.chapRowText, { color: colors.textPrimary }]}>
                        {chap.book} — {isFr ? 'Chapitre' : 'Chapter'} {chap.chapter}
                      </Text>
                      <Ionicons
                        name={estLu ? 'checkmark-circle' : 'ellipse-outline'}
                        size={18}
                        color={estLu ? colors.primary : colors.textLight}
                      />
                    </TouchableOpacity>
                  );
                })}

                {/* Abandonner */}
                <TouchableOpacity
                  style={[styles.abandonBtn, { borderColor: '#E53E3E' }]}
                  onPress={() => setModalAbandonner(true)}
                >
                  <View style={styles.abandonRow}>
                    <Ionicons name="trash-outline" size={16} color="#E53E3E" />
                    <Text style={[styles.abandonText, { color: '#E53E3E' }]}>
                      {t.abandonPlan}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </>
        )}

      </ScrollView>

      {/* ── Modal Démarrer ── */}
      <Modal visible={modalDemarrer} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalDemarrer(false)}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalIconBox, { backgroundColor: colors.surfaceWarm }]}>
              <Ionicons name={planChoisi?.icon} size={40} color={colors.accent} />
            </View>

            <Text style={[styles.modalTitre, { color: colors.textPrimary }]}>
              {planChoisi ? planTitre(planChoisi) : ''}
            </Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              {planChoisi ? planDesc(planChoisi) : ''}
            </Text>

            <View style={[styles.modalInfo, {
              backgroundColor: colors.surfaceWarm,
              borderColor:     colors.border,
            }]}>
              <View style={styles.modalInfoRow}>
                <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>
                  {t.duration} : {planChoisi ? dureeLabel(planChoisi) : ''}
                </Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Ionicons name="book-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>
                  {t.pace} : {planChoisi ? t.chPerDay(planChoisi.chapitresParJour) : ''}
                </Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Ionicons name="layers-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>
                  {t.total} : {planChoisi?.total} {isFr ? 'chapitres' : 'chapters'}
                </Text>
              </View>
            </View>

            {planActif && (
              <View style={styles.warningRow}>
                <Ionicons name="warning-outline" size={14} color="#E53E3E" />
                <Text style={[styles.modalWarning, { color: '#E53E3E' }]}>
                  {t.replaceWarning}
                </Text>
              </View>
            )}

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtnCancel, { borderColor: colors.border }]}
                onPress={() => setModalDemarrer(false)}
              >
                <Text style={[styles.modalBtnCancelText, { color: colors.textSecondary }]}>
                  {t.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtnConfirm, { backgroundColor: colors.primary }]}
                onPress={demarrerPlan}
              >
                <View style={styles.modalBtnRow}>
                  <Ionicons name="rocket" size={15} color="#fff" />
                  <Text style={styles.modalBtnConfirmText}> {t.start}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* ── Modal Abandonner ── */}
      <Modal visible={modalAbandonner} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalAbandonner(false)}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalIconBox, { backgroundColor: '#FFF0F0' }]}>
              <Ionicons name="trash" size={40} color="#E53E3E" />
            </View>
            <Text style={[styles.modalTitre, { color: colors.textPrimary }]}>
              {t.abandonPlan} ?
            </Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              {t.abandonConfirm}
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtnCancel, { borderColor: colors.border }]}
                onPress={() => setModalAbandonner(false)}
              >
                <Text style={[styles.modalBtnCancelText, { color: colors.textSecondary }]}>
                  {t.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtnConfirm, { backgroundColor: '#E53E3E' }]}
                onPress={abandonnerPlan}
              >
                <Text style={styles.modalBtnConfirmText}>{t.abandon}</Text>
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
  tab:                { flex: 1, paddingVertical: 14, alignItems: 'center',
                        flexDirection: 'row', justifyContent: 'center' },
  tabText:            { fontSize: 13, fontWeight: '600' },

  scroll:             { padding: 16, paddingBottom: 48 },
  sectionLabel:       { fontSize: 12, fontWeight: '700', marginBottom: 12,
                        letterSpacing: 1, textTransform: 'uppercase' },

  planCard:           { borderRadius: 14, padding: 16, marginBottom: 14,
                        shadowColor: '#000', shadowOpacity: 0.05,
                        shadowRadius: 6, elevation: 2 },
  planHeader:         { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  planIconBox:        { width: 52, height: 52, borderRadius: 14, justifyContent: 'center',
                        alignItems: 'center', marginRight: 12 },
  planInfo:           { flex: 1 },
  planTitre:          { fontWeight: '700', fontSize: 16, marginBottom: 2 },
  planDesc:           { fontSize: 13, lineHeight: 18 },
  badge:              { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText:          { color: '#fff', fontSize: 11, fontWeight: '700' },
  planFooter:         { flexDirection: 'row', justifyContent: 'space-between',
                        paddingTop: 10, borderTopWidth: 1 },
  planMetaRow:        { flexDirection: 'row', alignItems: 'center' },
  planMeta:           { fontSize: 12 },

  progressCard:       { borderRadius: 14, padding: 20, marginBottom: 20,
                        shadowColor: '#000', shadowOpacity: 0.05,
                        shadowRadius: 6, elevation: 2 },
  progressHeader:     { flexDirection: 'row', alignItems: 'center', gap: 8,
                        marginBottom: 16, justifyContent: 'center' },
  progressTitre:      { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  progressBarBg:      { height: 12, borderRadius: 6, marginBottom: 14, overflow: 'hidden' },
  progressBarFill:    { height: 12, borderRadius: 6 },
  progressStats:      { flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'center', gap: 8 },
  progressNum:        { fontSize: 32, fontWeight: '800' },
  progressSlash:      { fontSize: 16 },
  pctBadge:           { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pctText:            { color: '#fff', fontWeight: '700', fontSize: 14 },

  completedCard:      { borderRadius: 14, padding: 20, alignItems: 'center',
                        marginBottom: 20, gap: 8 },
  completedText:      { color: '#fff', fontWeight: '700', fontSize: 18 },

  prochainCard:       { borderRadius: 12, padding: 18, alignItems: 'center' },
  prochainRow:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  prochainText:       { color: '#fff', fontWeight: '700', fontSize: 16 },
  prochainHint:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  prochainSub:        { color: 'rgba(255,255,255,0.75)', fontSize: 13 },

  chapRow:            { flexDirection: 'row', alignItems: 'center', borderRadius: 10,
                        padding: 12, marginBottom: 8, borderWidth: 1 },
  checkbox:           { width: 22, height: 22, borderRadius: 6, borderWidth: 2,
                        justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  chapRowText:        { flex: 1, fontSize: 14, fontWeight: '500' },

  emptyState:         { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText:          { fontSize: 15, textAlign: 'center', lineHeight: 24, marginBottom: 12 },
  startBtn:           { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  startBtnText:       { color: '#fff', fontWeight: '700', fontSize: 15 },

  abandonBtn:         { borderWidth: 1, borderRadius: 12, paddingVertical: 14,
                        alignItems: 'center', marginTop: 16, marginBottom: 8 },
  abandonRow:         { flexDirection: 'row', alignItems: 'center', gap: 8 },
  abandonText:        { fontWeight: '600', fontSize: 14 },

  modalOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox:           { borderRadius: 20, padding: 28, width: '100%', maxWidth: 400,
                        alignItems: 'center', shadowColor: '#000',
                        shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  modalIconBox:       { width: 72, height: 72, borderRadius: 20, justifyContent: 'center',
                        alignItems: 'center', marginBottom: 12 },
  modalTitre:         { fontSize: 20, fontWeight: '700', marginBottom: 8,
                        textAlign: 'center' },
  modalDesc:          { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  modalInfo:          { borderRadius: 12, padding: 14, width: '100%',
                        borderWidth: 1, marginBottom: 16, gap: 10 },
  modalInfoRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalInfoText:      { fontSize: 14 },
  warningRow:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  modalWarning:       { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  modalBtns:          { flexDirection: 'row', gap: 12, width: '100%' },
  modalBtnCancel:     { flex: 1, borderWidth: 1, borderRadius: 12,
                        paddingVertical: 14, alignItems: 'center' },
  modalBtnCancelText: { fontWeight: '600', fontSize: 14 },
  modalBtnConfirm:    { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  modalBtnRow:        { flexDirection: 'row', alignItems: 'center' },
  modalBtnConfirmText:{ color: '#fff', fontWeight: '700', fontSize: 14 },
});