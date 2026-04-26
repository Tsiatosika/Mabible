// hooks/useBible.js
import { useState, useEffect } from 'react';
import { BIBLE_STRUCTURE } from '../constants/bibleStructure';

let bibleCache = null;

// ── Table de correspondance nom complet / abréviations → abrev officielle ──
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

// Construit une map: toutes les formes possibles d'un nom → abrev
const BOOK_LOOKUP = new Map();
for (const livre of ALL_BOOKS_FLAT) {
  // abrev exacte
  BOOK_LOOKUP.set(normalize(livre.abrev), livre.abrev);
  // nom complet normalisé
  BOOK_LOOKUP.set(normalize(livre.nom), livre.abrev);
  // nom sans espaces (ex: "1rois" → "1R")
  BOOK_LOOKUP.set(normalize(livre.nom).replace(/\s/g, ''), livre.abrev);
  // abrev en minuscule sans chiffres en tête (ex: "jean" pour "Jn")
  BOOK_LOOKUP.set(normalize(livre.abrev).replace(/\d/g, ''), livre.abrev);
}

// Essaie de parser une référence biblique dans la query
// Retourne { abrev, chapter, verse } ou null
function parseReference(query) {
  const q = query.trim();

  // Regex: (nom du livre) (chapitre) [: (verset)]
  // Exemples: "Jean 3:16", "Jn 3:16", "1 Rois 2:3", "Genèse 1", "Gn 1:1"
  const match = q.match(
    /^(\d?\s?[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)*)\s+(\d+)(?::(\d+))?$/i
  );
  if (!match) return null;

  const rawBook   = match[1].trim();
  const chapter   = parseInt(match[2], 10);
  const verse     = match[3] ? parseInt(match[3], 10) : null;

  // Cherche le livre dans la table
  const normBook = normalize(rawBook);
  let abrev = BOOK_LOOKUP.get(normBook);

  // Si pas trouvé exactement, cherche par préfixe (ex: "Jean" → "Jn")
  if (!abrev) {
    for (const [key, val] of BOOK_LOOKUP.entries()) {
      if (key.startsWith(normBook) || normBook.startsWith(key)) {
        abrev = val;
        break;
      }
    }
  }

  // Recherche floue : le nom normalisé contient la query ou inversement
  if (!abrev) {
    for (const [key, val] of BOOK_LOOKUP.entries()) {
      if (key.includes(normBook)) {
        abrev = val;
        break;
      }
    }
  }

  if (!abrev) return null;
  return { abrev, chapter, verse };
}

export function useBible() {
  const [bible,   setBible]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bibleCache) {
      setBible(bibleCache);
      setLoading(false);
      return;
    }
    try {
      const data  = require('../assets/bible.json');
      bibleCache  = data;
      setBible(data);
    } catch (e) {
      console.warn('bible.json introuvable');
      bibleCache = { livres: [] };
      setBible(bibleCache);
    }
    setLoading(false);
  }, []);

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

    // ── 1. Essai de recherche par référence ──────────────────────────────
    const ref = parseReference(query.trim());
    if (ref) {
      const livre = bible.livres.find(l => l.abrev === ref.abrev);
      if (livre) {
        // Filtre testament
        if (filter === 'ancien' && livre.testament !== 'ancien') return [];
        if (filter === 'nouveau' && livre.testament !== 'nouveau') return [];

        const chapitre = livre.chapitres.find(c => c.numero === ref.chapter);
        if (!chapitre) return [];

        // Verset précis demandé
        if (ref.verse !== null) {
          const verset = chapitre.versets.find(v => v.numero === ref.verse);
          if (!verset) return [];
          return [{
            id:        `${livre.abrev}-${chapitre.numero}-${verset.numero}`,
            book:      livre.nom,
            bookAbrev: livre.abrev,
            testament: livre.testament,
            chapter:   chapitre.numero,
            verse:     verset.numero,
            text:      verset.texte,
            isReference: true,
          }];
        }

        // Tout le chapitre
        return chapitre.versets.map(verset => ({
          id:        `${livre.abrev}-${chapitre.numero}-${verset.numero}`,
          book:      livre.nom,
          bookAbrev: livre.abrev,
          testament: livre.testament,
          chapter:   chapitre.numero,
          verse:     verset.numero,
          text:      verset.texte,
          isReference: true,
        }));
      }
    }

    // ── 2. Recherche plein texte classique ───────────────────────────────
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
              book:      livre.nom,
              bookAbrev: livre.abrev,
              testament: livre.testament,
              chapter:   chapitre.numero,
              verse:     verset.numero,
              text:      verset.texte,
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