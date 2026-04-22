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
      console.warn('bible.json introuvable, utilisation de données test');
      bibleCache = { livres: [] };
      setBible(bibleCache);
    }
    setLoading(false);
  }, []);

  function getChapter(bookAbrev, chapterNum) {
    if (!bible) return null;
    const livre = bible.livres.find(l => l.abrev === bookAbrev);
    if (!livre) return null;
    return livre.chapitres.find(c => c.numero === Number(chapterNum)) || null;
  }

  function searchVersets(query, filter = 'all') {
    if (!bible || !query || query.trim().length < 2) return [];
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const results = [];
    for (const livre of bible.livres) {
      if (filter === 'ancien' && livre.testament !== 'ancien') continue;
      if (filter === 'nouveau' && livre.testament !== 'nouveau') continue;
      for (const chapitre of livre.chapitres) {
        for (const verset of chapitre.versets) {
          const norm = verset.texte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (norm.includes(q)) {
            results.push({
              id: `${livre.abrev}-${chapitre.numero}-${verset.numero}`,
              book: livre.nom,
              bookAbrev: livre.abrev,
              testament: livre.testament,
              chapter: chapitre.numero,
              verse: verset.numero,
              text: verset.texte,
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