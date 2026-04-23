import { useState, useEffect } from 'react';

let bibleCache = null;

export function useBible() {
  const [bible, setBible] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bibleCache) {
      setBible(bibleCache);
      setLoading(false);
      return;
    }
    try {
      const data = require('../assets/bible.json');
      bibleCache = data;
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

    // Cherche le livre par abréviation (exact)
    let livre = bible.livres.find(l => l.abrev === bookAbrev);

    // Insensible à la casse
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
    if (!chap) {
      console.warn(`Chapitre ${chapterNum} non trouvé dans ${bookAbrev}`);
    }
    return chap || null;
  }

  function searchVersets(query, filter = 'all') {
    if (!bible || !query || query.trim().length < 2) return [];
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const results = [];
    const seen = new Set(); // éviter les doublons

    for (const livre of bible.livres) {
      if (filter === 'ancien' && livre.testament !== 'ancien') continue;
      if (filter === 'nouveau' && livre.testament !== 'nouveau') continue;

      for (const chapitre of livre.chapitres) {
        for (const verset of chapitre.versets) {
          const id = `${livre.abrev}-${chapitre.numero}-${verset.numero}`;
          if (seen.has(id)) continue; // ignorer les doublons
          seen.add(id);

          const norm = verset.texte
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
          if (norm.includes(q)) {
            results.push({
              id,
              book:      livre.nom,
              bookAbrev: livre.abrev,
              testament: livre.testament,
              chapter:   chapitre.numero,
              verse:     verset.numero,
              text:      verset.texte,
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