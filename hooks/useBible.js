import { useState, useEffect } from 'react';
import { BIBLE_STRUCTURE, KJV_NAME_TO_ABREV } from '../constants/bibleStructure';
import { useLanguage } from '../context/LanguageContext';

const cache = { fr: null, en: null };

const ALL_BOOKS_FLAT = [
  ...BIBLE_STRUCTURE.ancienTestament.categories.flatMap(c => c.livres),
  ...BIBLE_STRUCTURE.nouveauTestament.categories.flatMap(c => c.livres),
];

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function buildLookup(lang) {
  const map = new Map();
  for (const livre of ALL_BOOKS_FLAT) {
    const nomLang = lang === 'en' ? livre.nomEn : livre.nom;
    map.set(normalize(livre.abrev), livre.abrev);
    // nom dans la langue
    map.set(normalize(nomLang), livre.abrev);
    map.set(normalize(nomLang).replace(/\s/g, ''), livre.abrev);
    map.set(normalize(livre.kjvName), livre.abrev);
    map.set(normalize(livre.kjvName).replace(/\s/g, ''), livre.abrev);
    // nom français toujours disponible
    map.set(normalize(livre.nom), livre.abrev);
    map.set(normalize(livre.nom).replace(/\s/g, ''), livre.abrev);
  }
  return map;
}

function parseReference(query, lookup) {
  const q     = query.trim();
  const match = q.match(
    /^(\d?\s?[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)*)\s+(\d+)(?::(\d+))?$/i
  );
  if (!match) return null;

  const rawBook = match[1].trim();
  const chapter = parseInt(match[2], 10);
  const verse   = match[3] ? parseInt(match[3], 10) : null;

  const normBook = normalize(rawBook);
  let abrev = lookup.get(normBook);

  if (!abrev) {
    for (const [key, val] of lookup.entries()) {
      if (key.startsWith(normBook) || normBook.startsWith(key)) {
        abrev = val;
        break;
      }
    }
  }
  if (!abrev) {
    for (const [key, val] of lookup.entries()) {
      if (key.includes(normBook)) { abrev = val; break; }
    }
  }

  if (!abrev) return null;
  return { abrev, chapter, verse };
}

function buildKjvBible(rawVerses) {
  const livresMap = new Map(); 

  for (const v of rawVerses) {
    const abrev = KJV_NAME_TO_ABREV[v.book_name];
    if (!abrev) continue;

    const bookInfo = ALL_BOOKS_FLAT.find(b => b.abrev === abrev);
    if (!bookInfo) continue;

    if (!livresMap.has(abrev)) {
      livresMap.set(abrev, {
        abrev,
        nom:      bookInfo.nomEn,
        testament: BIBLE_STRUCTURE.ancienTestament.categories
          .flatMap(c => c.livres).some(b => b.abrev === abrev)
          ? 'ancien' : 'nouveau',
        chapitres: [],
        _chapMap: new Map(),
      });
    }

    const livre = livresMap.get(abrev);
    if (!livre._chapMap.has(v.chapter)) {
      const newChap = { numero: v.chapter, titre: null, versets: [] };
      livre._chapMap.set(v.chapter, newChap);
      livre.chapitres.push(newChap);
    }
    livre._chapMap.get(v.chapter).versets.push({
      numero: v.verse,
      texte:  v.text,
    });
  }

  // Trier chapitres et versets
  const livres = [];
  for (const livre of livresMap.values()) {
    livre.chapitres.sort((a, b) => a.numero - b.numero);
    for (const chap of livre.chapitres) {
      chap.versets.sort((a, b) => a.numero - b.numero);
    }
    delete livre._chapMap;
    livres.push(livre);
  }

  // Trier selon l'ordre canonique
  const order = ALL_BOOKS_FLAT.map(b => b.abrev);
  livres.sort((a, b) => order.indexOf(a.abrev) - order.indexOf(b.abrev));

  return { livres };
}

export function useBible() {
  const { language } = useLanguage();
  const [bible,   setBible]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [lookup,  setLookup]  = useState(() => buildLookup('fr'));

  useEffect(() => {
    setLoading(true);
    setBible(null);

    // Utiliser le cache si disponible
    if (cache[language]) {
      setBible(cache[language]);
      setLookup(buildLookup(language));
      setLoading(false);
      return;
    }

    try {
      if (language === 'en') {
        const raw  = require('../assets/kjv.json');
        const verses = raw.verses || raw;
        const built  = buildKjvBible(verses);
        cache['en']  = built;
        setBible(built);
      } else {
        const data  = require('../assets/bible.json');
        cache['fr'] = data;
        setBible(data);
      }
    } catch (e) {
      console.warn('Erreur chargement bible:', e);
      cache[language] = { livres: [] };
      setBible(cache[language]);
    }

    setLookup(buildLookup(language));
    setLoading(false);
  }, [language]);

  function getChapter(bookAbrev, chapterNum) {
    if (!bible) return null;

    let livre = bible.livres.find(l => l.abrev === bookAbrev);
    if (!livre) {
      livre = bible.livres.find(
        l => l.abrev.toLowerCase() === bookAbrev.toLowerCase()
      );
    }
    if (!livre) {
      console.warn(`Livre non trouvé: "${bookAbrev}"`);
      return null;
    }

    const chap = livre.chapitres.find(c => c.numero === Number(chapterNum));
    if (!chap) console.warn(`Chapitre ${chapterNum} non trouvé dans ${bookAbrev}`);
    return chap || null;
  }

  function searchVersets(query, filter = 'all') {
    if (!bible || !query || query.trim().length < 2) return [];

    // 1. Recherche par référence
    const ref = parseReference(query.trim(), lookup);
    if (ref) {
      const livre = bible.livres.find(l => l.abrev === ref.abrev);
      if (livre) {
        if (filter === 'ancien'  && livre.testament !== 'ancien')  return [];
        if (filter === 'nouveau' && livre.testament !== 'nouveau') return [];

        const chapitre = livre.chapitres.find(c => c.numero === ref.chapter);
        if (!chapitre) return [];

        if (ref.verse !== null) {
          const verset = chapitre.versets.find(v => v.numero === ref.verse);
          if (!verset) return [];
          return [{
            id:          `${livre.abrev}-${chapitre.numero}-${verset.numero}`,
            book:        livre.nom,
            bookAbrev:   livre.abrev,
            testament:   livre.testament,
            chapter:     chapitre.numero,
            verse:       verset.numero,
            text:        verset.texte,
            isReference: true,
          }];
        }

        return chapitre.versets.map(verset => ({
          id:          `${livre.abrev}-${chapitre.numero}-${verset.numero}`,
          book:        livre.nom,
          bookAbrev:   livre.abrev,
          testament:   livre.testament,
          chapter:     chapitre.numero,
          verse:       verset.numero,
          text:        verset.texte,
          isReference: true,
        }));
      }
    }

    // 2. Recherche plein texte
    const q       = normalize(query);
    const results = [];
    const seen    = new Set();

    for (const livre of bible.livres) {
      if (filter === 'ancien'  && livre.testament !== 'ancien')  continue;
      if (filter === 'nouveau' && livre.testament !== 'nouveau') continue;

      for (const chapitre of livre.chapitres) {
        for (const verset of chapitre.versets) {
          const id = `${livre.abrev}-${chapitre.numero}-${verset.numero}`;
          if (seen.has(id)) continue;
          seen.add(id);

          const norm = normalize(verset.texte);
          if (norm.includes(q)) {
            results.push({
              id,
              book:        livre.nom,
              bookAbrev:   livre.abrev,
              testament:   livre.testament,
              chapter:     chapitre.numero,
              verse:       verset.numero,
              text:        verset.texte,
              isReference: false,
            });
          }
          if (results.length >= 200) return results;
        }
      }
    }
    return results;
  }

  return { bible, loading, getChapter, searchVersets };
}