import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@bible:language';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('fr'); // 'fr' | 'en'

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(val => {
      if (val === 'en' || val === 'fr') setLanguage(val);
    });
  }, []);

  const setLang = useCallback(async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const isFr = language === 'fr';

  // Textes UI selon la langue
  const t = {
    // Navigation
    home:        isFr ? 'Accueil'    : 'Home',
    read:        isFr ? 'Lire'       : 'Read',
    search:      isFr ? 'Rechercher' : 'Search',
    favorites:   isFr ? 'Favoris'    : 'Favorites',
    plan:        isFr ? 'Plan'       : 'Plan',

    // Accueil
    appTitle:    isFr ? 'Ma Bible'             : 'My Bible',
    appSubtitle: isFr ? 'Version Louis Segond' : 'King James Version',
    verseOfDay:  isFr ? 'Verset du jour'       : 'Verse of the day',
    continueReading: isFr ? 'Continuer la lecture' : 'Continue reading',
    quickAccess: isFr ? 'Accès rapide'         : 'Quick access',
    oldTestament:isFr ? 'Ancien Testament'     : 'Old Testament',
    newTestament:isFr ? 'Nouveau Testament'    : 'New Testament',
    books39:     isFr ? '39 livres'            : '39 books',
    books27:     isFr ? '27 livres'            : '27 books',
    recentlyRead:isFr ? 'Récemment lus'        : 'Recently read',
    chapter:     isFr ? 'Chapitre'             : 'Chapter',
    favorites_count: (n) => isFr
      ? `${n} verset${n > 1 ? 's' : ''} sauvegardé${n > 1 ? 's' : ''}`
      : `${n} verse${n > 1 ? 's' : ''} saved`,
    days:        isFr ? 'Jours lus'   : 'Days read',
    progress:    isFr ? 'Progression' : 'Progress',

    // Lire
    booksTitle:  isFr ? 'Livres de la Bible' : 'Books of the Bible',
    chooseChapter: isFr ? 'Choisissez un chapitre' : 'Choose a chapter',
    chapters:    (n) => isFr ? `${n} chapitres` : `${n} chapters`,

    // Lecture
    chapterOf:   (c, t) => isFr ? `Chapitre ${c} / ${t}` : `Chapter ${c} / ${t}`,
    tip:         isFr
      ? 'Appuyez sur un verset pour l\'ajouter aux favoris · Appui long pour partager'
      : 'Tap a verse to bookmark it · Long press to share',
    prevChapter: isFr ? 'Chapitre précédent' : 'Previous chapter',
    nextChapter: isFr ? 'Chapitre suivant'   : 'Next chapter',
    displayOptions: isFr ? 'Options d\'affichage' : 'Display options',
    textSize:    isFr ? 'Taille du texte'    : 'Text size',
    theme:       isFr ? 'Thème'              : 'Theme',
    darkMode:    isFr ? 'Passer en mode sombre' : 'Switch to dark mode',
    lightMode:   isFr ? 'Passer en mode clair'  : 'Switch to light mode',
    close:       isFr ? 'Fermer'            : 'Close',
    notFound:    isFr ? 'Chapitre introuvable' : 'Chapter not found',
    back:        isFr ? 'Retour'            : 'Back',

    // Recherche
    searchPlaceholder: isFr
      ? 'Rechercher un mot, un verset... (ex: Jean 3:16)'
      : 'Search a word, verse... (ex: John 3:16)',
    all:         isFr ? 'Tout'         : 'All',
    oldT:        isFr ? 'A. Testament' : 'Old Test.',
    newT:        isFr ? 'N. Testament' : 'New Test.',
    results:     (n, q) => isFr
      ? `${n} résultat${n > 1 ? 's' : ''} pour « ${q} »`
      : `${n} result${n > 1 ? 's' : ''} for "${q}"`,
    searchPrompt: isFr
      ? 'Recherchez dans les\n31 000 versets de la Bible'
      : 'Search through\n31,000 Bible verses',
    noResult:    isFr ? 'Aucun résultat trouvé.' : 'No results found.',
    readChapter: isFr ? 'Lire le chapitre'       : 'Read chapter',

    // Favoris
    myFavorites: isFr ? 'Mes Favoris' : 'My Favorites',
    all_tab:     isFr ? 'Tous'        : 'All',
    recent_tab:  isFr ? 'Récents'     : 'Recent',
    noFavorites: isFr
      ? "Aucun favori pour l'instant.\nAppuyez sur un verset pendant la lecture pour l'ajouter."
      : "No favorites yet.\nTap a verse while reading to add it.",
    addedOn:     isFr ? 'Ajouté le'  : 'Added on',

    // Plan
    readingPlan:  isFr ? 'Plan de lecture'       : 'Reading plan',
    choosePlan:   isFr ? 'Choisissez un plan'    : 'Choose a plan',
    plans_tab:    isFr ? 'Plans'                 : 'Plans',
    progress_tab: isFr ? 'Progression'           : 'Progress',
    chooseRhythm: isFr ? 'Choisissez votre rythme de lecture' : 'Choose your reading pace',
    active:       isFr ? 'Actif'                 : 'Active',
    noPlan:       isFr ? 'Aucun plan actif.\nChoisissez un plan pour commencer !' : 'No active plan.\nChoose a plan to get started!',
    seePlans:     isFr ? 'Voir les plans →'      : 'See plans →',
    nextChapterLabel: isFr ? 'Prochain chapitre' : 'Next chapter',
    tapToRead:    isFr ? 'Appuyez pour lire et marquer comme lu' : 'Tap to read and mark as done',
    allChapters:  (l, t) => isFr ? `Tous les chapitres (${l}/${t})` : `All chapters (${l}/${t})`,
    abandonPlan:  isFr ? 'Abandonner ce plan'    : 'Abandon this plan',
    congratulations: isFr ? 'Plan terminé ! Félicitations !' : 'Plan completed! Congratulations!',
    start:        isFr ? 'Démarrer'              : 'Start',
    cancel:       isFr ? 'Annuler'               : 'Cancel',
    abandon:      isFr ? 'Abandonner'            : 'Abandon',
    abandonConfirm: isFr
      ? 'Votre progression sera perdue et ne pourra pas être récupérée.'
      : 'Your progress will be lost and cannot be recovered.',
    replaceWarning: isFr
      ? 'Cela remplacera votre plan actuel'
      : 'This will replace your current plan',
    duration:     isFr ? 'Durée'   : 'Duration',
    pace:         isFr ? 'Rythme'  : 'Pace',
    chPerDay:     (n) => isFr ? `${n} chapitres/jour` : `${n} ch/day`,
    total:        isFr ? 'Total'   : 'Total',

    // Paramètres
    settings:     isFr ? 'Paramètres'            : 'Settings',
    appearance:   isFr ? 'Apparence'             : 'Appearance',
    darkModeActive: isFr ? 'Mode sombre actif'   : 'Dark mode active',
    lightModeActive:isFr ? 'Mode clair actif'    : 'Light mode active',
    about:        isFr ? 'À propos'              : 'About',
    bibleVersion: isFr ? 'Version de la Bible'   : 'Bible version',
    appVersion:   isFr ? "Version de l'app"      : 'App version',
    verseCount:   isFr ? 'Nombre de versets'     : 'Verse count',
    language_label: isFr ? 'Langue'              : 'Language',
    french:       isFr ? 'Français'              : 'French',
    english:      isFr ? 'Anglais'               : 'English',
    data:         isFr ? 'Données'               : 'Data',
    clearHistory: isFr ? "Effacer l'historique de lecture" : 'Clear reading history',
    resetAll:     isFr ? 'Réinitialiser toutes les données' : 'Reset all data',
    cleared:      isFr ? 'Données effacées !'    : 'Data cleared!',
    madeWith:     isFr
      ? 'Ma Bible — Fait avec amour\nToutes les données restent sur votre appareil'
      : 'My Bible — Made with love\nAll data stays on your device',
  };

  return (
    <LanguageContext.Provider value={{ language, setLang, isFr, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}