const fs   = require('fs');
const path = require('path');

const ORDRE_BIBLIQUE = [
  { abrev: 'Gn',  nom: 'Genèse',           testament: 'ancien'  },
  { abrev: 'Ex',  nom: 'Exode',             testament: 'ancien'  },
  { abrev: 'Lv',  nom: 'Lévitique',         testament: 'ancien'  },
  { abrev: 'Nb',  nom: 'Nombres',           testament: 'ancien'  },
  { abrev: 'Dt',  nom: 'Deutéronome',       testament: 'ancien'  },
  { abrev: 'Jos', nom: 'Josué',             testament: 'ancien'  },
  { abrev: 'Jg',  nom: 'Juges',             testament: 'ancien'  },
  { abrev: 'Rt',  nom: 'Ruth',              testament: 'ancien'  },
  { abrev: '1S',  nom: '1 Samuel',          testament: 'ancien'  },
  { abrev: '2S',  nom: '2 Samuel',          testament: 'ancien'  },
  { abrev: '1R',  nom: '1 Rois',            testament: 'ancien'  },
  { abrev: '2R',  nom: '2 Rois',            testament: 'ancien'  },
  { abrev: '1Ch', nom: '1 Chroniques',      testament: 'ancien'  },
  { abrev: '2Ch', nom: '2 Chroniques',      testament: 'ancien'  },
  { abrev: 'Esd', nom: 'Esdras',            testament: 'ancien'  },
  { abrev: 'Ne',  nom: 'Néhémie',           testament: 'ancien'  },
  { abrev: 'Est', nom: 'Esther',            testament: 'ancien'  },
  { abrev: 'Jb',  nom: 'Job',               testament: 'ancien'  },
  { abrev: 'Ps',  nom: 'Psaumes',           testament: 'ancien'  },
  { abrev: 'Pr',  nom: 'Proverbes',         testament: 'ancien'  },
  { abrev: 'Ec',  nom: 'Ecclésiaste',       testament: 'ancien'  },
  { abrev: 'Ct',  nom: 'Cantique',          testament: 'ancien'  },
  { abrev: 'Es',  nom: 'Ésaïe',             testament: 'ancien'  },
  { abrev: 'Jr',  nom: 'Jérémie',           testament: 'ancien'  },
  { abrev: 'Lm',  nom: 'Lamentations',      testament: 'ancien'  },
  { abrev: 'Ez',  nom: 'Ézéchiel',          testament: 'ancien'  },
  { abrev: 'Dn',  nom: 'Daniel',            testament: 'ancien'  },
  { abrev: 'Os',  nom: 'Osée',              testament: 'ancien'  },
  { abrev: 'Jl',  nom: 'Joël',              testament: 'ancien'  },
  { abrev: 'Am',  nom: 'Amos',              testament: 'ancien'  },
  { abrev: 'Ab',  nom: 'Abdias',            testament: 'ancien'  },
  { abrev: 'Jon', nom: 'Jonas',             testament: 'ancien'  }, 
  { abrev: 'Mi',  nom: 'Michée',            testament: 'ancien'  },
  { abrev: 'Na',  nom: 'Nahoum',            testament: 'ancien'  },
  { abrev: 'Ha',  nom: 'Habacuc',           testament: 'ancien'  },
  { abrev: 'So',  nom: 'Sophonie',          testament: 'ancien'  },
  { abrev: 'Ag',  nom: 'Aggée',             testament: 'ancien'  },
  { abrev: 'Za',  nom: 'Zacharie',          testament: 'ancien'  },
  { abrev: 'Ml',  nom: 'Malachie',          testament: 'ancien'  },
  { abrev: 'Mt',  nom: 'Matthieu',          testament: 'nouveau' },
  { abrev: 'Mc',  nom: 'Marc',              testament: 'nouveau' },
  { abrev: 'Lc',  nom: 'Luc',              testament: 'nouveau' },
  { abrev: 'Jn',  nom: 'Jean',              testament: 'nouveau' }, 
  { abrev: 'Ac',  nom: 'Actes',             testament: 'nouveau' },
  { abrev: 'Rm',  nom: 'Romains',           testament: 'nouveau' },
  { abrev: '1Co', nom: '1 Corinthiens',     testament: 'nouveau' },
  { abrev: '2Co', nom: '2 Corinthiens',     testament: 'nouveau' },
  { abrev: 'Ga',  nom: 'Galates',           testament: 'nouveau' },
  { abrev: 'Ep',  nom: 'Éphésiens',         testament: 'nouveau' },
  { abrev: 'Ph',  nom: 'Philippiens',       testament: 'nouveau' },
  { abrev: 'Col', nom: 'Colossiens',        testament: 'nouveau' },
  { abrev: '1Th', nom: '1 Thessaloniciens', testament: 'nouveau' },
  { abrev: '2Th', nom: '2 Thessaloniciens', testament: 'nouveau' },
  { abrev: '1Tm', nom: '1 Timothée',        testament: 'nouveau' },
  { abrev: '2Tm', nom: '2 Timothée',        testament: 'nouveau' },
  { abrev: 'Tt',  nom: 'Tite',              testament: 'nouveau' },
  { abrev: 'Phm', nom: 'Philémon',          testament: 'nouveau' },
  { abrev: 'He',  nom: 'Hébreux',           testament: 'nouveau' },
  { abrev: 'Jc',  nom: 'Jacques',           testament: 'nouveau' },
  { abrev: '1Pi', nom: '1 Pierre',          testament: 'nouveau' },
  { abrev: '2Pi', nom: '2 Pierre',          testament: 'nouveau' },
  { abrev: '1Jn', nom: '1 Jean',            testament: 'nouveau' },
  { abrev: '2Jn', nom: '2 Jean',            testament: 'nouveau' },
  { abrev: '3Jn', nom: '3 Jean',            testament: 'nouveau' },
  { abrev: 'Jude',nom: 'Jude',              testament: 'nouveau' },
  { abrev: 'Ap',  nom: 'Apocalypse',        testament: 'nouveau' },
];

const inputPath = path.join(__dirname, 'bible.json');
if (!fs.existsSync(inputPath)) {
  console.error('❌ bible.json introuvable !');
  process.exit(1);
}

console.log('📖 Lecture de bible.json...');
let raw = fs.readFileSync(inputPath, 'utf8');
raw = raw.replace(/^\uFEFF/, '');
raw = raw.replace(/^[^\[{]*/, '');

const source = JSON.parse(raw);
console.log(`✅ ${source.length} livres trouvés dans le fichier source`);

if (source.length !== 66) {
  console.warn(`⚠️  Attention : ${source.length} livres au lieu de 66 !`);
}

const livres = [];
let totalVersets = 0;

for (let i = 0; i < source.length; i++) {
  const srcBook  = source[i];
  const mapping  = ORDRE_BIBLIQUE[i];

  if (!mapping) {
    console.warn(`⚠️  Position ${i} non mappée : ${srcBook.abbrev}`);
    continue;
  }

  console.log(`  [${i + 1}/66] ${srcBook.abbrev} → ${mapping.nom}`);

  const chapitres = srcBook.chapters.map((versetsList, chapIndex) => ({
    numero:  chapIndex + 1,
    versets: versetsList.map((texte, versetIndex) => ({
      numero: versetIndex + 1,
      texte:  String(texte).trim(),
    })),
  }));

  totalVersets += chapitres.reduce((sum, ch) => sum + ch.versets.length, 0);

  livres.push({
    nom:       mapping.nom,
    abrev:     mapping.abrev,
    testament: mapping.testament,
    chapitres,
  });
}

console.log('');
const manquants = ORDRE_BIBLIQUE
  .map(m => m.abrev)
  .filter(abrev => !livres.find(l => l.abrev === abrev));

if (manquants.length > 0) {
  console.warn(`⚠️  Livres manquants (${manquants.length}) : ${manquants.join(', ')}`);
} else {
  console.log('✅ Les 66 livres sont présents !');
}

const outputPath = path.join(__dirname, 'assets', 'bible.json');
fs.writeFileSync(outputPath, JSON.stringify({ livres }), 'utf8');

console.log('');
console.log('✅ Conversion terminée !');
console.log(`   📚 Livres    : ${livres.length}`);
console.log(`   📖 Versets   : ${totalVersets}`);
console.log(`   💾 Fichier   : assets/bible.json`);