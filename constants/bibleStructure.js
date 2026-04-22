export const BIBLE_STRUCTURE = {
  ancienTestament: {
    label: 'Ancien Testament',
    livres: 39,
    categories: [
      {
        nom: 'Pentateuque',
        livres: [
          { abrev: 'Gn',  nom: 'Genèse',       chapitres: 50 },
          { abrev: 'Ex',  nom: 'Exode',         chapitres: 40 },
          { abrev: 'Lv',  nom: 'Lévitique',     chapitres: 27 },
          { abrev: 'Nb',  nom: 'Nombres',       chapitres: 36 },
          { abrev: 'Dt',  nom: 'Deutéronome',   chapitres: 34 },
        ],
      },
      {
        nom: 'Livres historiques',
        livres: [
          { abrev: 'Jos', nom: 'Josué',         chapitres: 24 },
          { abrev: 'Jg',  nom: 'Juges',         chapitres: 21 },
          { abrev: 'Rt',  nom: 'Ruth',          chapitres: 4  },
          { abrev: '1S',  nom: '1 Samuel',      chapitres: 31 },
          { abrev: '2S',  nom: '2 Samuel',      chapitres: 24 },
          { abrev: '1R',  nom: '1 Rois',        chapitres: 22 },
          { abrev: '2R',  nom: '2 Rois',        chapitres: 25 },
          { abrev: '1Ch', nom: '1 Chroniques',  chapitres: 29 },
          { abrev: '2Ch', nom: '2 Chroniques',  chapitres: 36 },
          { abrev: 'Esd', nom: 'Esdras',        chapitres: 10 },
          { abrev: 'Ne',  nom: 'Néhémie',       chapitres: 13 },
          { abrev: 'Est', nom: 'Esther',        chapitres: 10 },
        ],
      },
      {
        nom: 'Livres poétiques',
        livres: [
          { abrev: 'Jb',  nom: 'Job',           chapitres: 42  },
          { abrev: 'Ps',  nom: 'Psaumes',       chapitres: 150 },
          { abrev: 'Pr',  nom: 'Proverbes',     chapitres: 31  },
          { abrev: 'Ec',  nom: 'Ecclésiaste',   chapitres: 12  },
          { abrev: 'Ct',  nom: 'Cantique',      chapitres: 8   },
        ],
      },
      {
        nom: 'Livres prophétiques',
        livres: [
          { abrev: 'Es',  nom: 'Ésaïe',         chapitres: 66 },
          { abrev: 'Jr',  nom: 'Jérémie',       chapitres: 52 },
          { abrev: 'Lm',  nom: 'Lamentations',  chapitres: 5  },
          { abrev: 'Ez',  nom: 'Ézéchiel',      chapitres: 48 },
          { abrev: 'Dn',  nom: 'Daniel',        chapitres: 12 },
          { abrev: 'Os',  nom: 'Osée',          chapitres: 14 },
          { abrev: 'Jl',  nom: 'Joël',          chapitres: 3  },
          { abrev: 'Am',  nom: 'Amos',          chapitres: 9  },
          { abrev: 'Ab',  nom: 'Abdias',        chapitres: 1  },
          { abrev: 'Jon', nom: 'Jonas',         chapitres: 4  },
          { abrev: 'Mi',  nom: 'Michée',        chapitres: 7  },
          { abrev: 'Na',  nom: 'Nahoum',        chapitres: 3  },
          { abrev: 'Ha',  nom: 'Habacuc',       chapitres: 3  },
          { abrev: 'So',  nom: 'Sophonie',      chapitres: 3  },
          { abrev: 'Ag',  nom: 'Aggée',         chapitres: 2  },
          { abrev: 'Za',  nom: 'Zacharie',      chapitres: 14 },
          { abrev: 'Ml',  nom: 'Malachie',      chapitres: 4  },
        ],
      },
    ],
  },
  nouveauTestament: {
    label: 'Nouveau Testament',
    livres: 27,
    categories: [
      {
        nom: 'Évangiles',
        livres: [
          { abrev: 'Mt', nom: 'Matthieu',  chapitres: 28 },
          { abrev: 'Mc', nom: 'Marc',      chapitres: 16 },
          { abrev: 'Lc', nom: 'Luc',       chapitres: 24 },
          { abrev: 'Jn', nom: 'Jean',      chapitres: 21 },
        ],
      },
      {
        nom: 'Histoire',
        livres: [
          { abrev: 'Ac', nom: 'Actes',     chapitres: 28 },
        ],
      },
      {
        nom: 'Épîtres de Paul',
        livres: [
          { abrev: 'Rm',  nom: 'Romains',           chapitres: 16 },
          { abrev: '1Co', nom: '1 Corinthiens',     chapitres: 16 },
          { abrev: '2Co', nom: '2 Corinthiens',     chapitres: 13 },
          { abrev: 'Ga',  nom: 'Galates',           chapitres: 6  },
          { abrev: 'Ep',  nom: 'Éphésiens',         chapitres: 6  },
          { abrev: 'Ph',  nom: 'Philippiens',       chapitres: 4  },
          { abrev: 'Col', nom: 'Colossiens',        chapitres: 4  },
          { abrev: '1Th', nom: '1 Thessaloniciens', chapitres: 5  },
          { abrev: '2Th', nom: '2 Thessaloniciens', chapitres: 3  },
          { abrev: '1Tm', nom: '1 Timothée',        chapitres: 6  },
          { abrev: '2Tm', nom: '2 Timothée',        chapitres: 4  },
          { abrev: 'Tt',  nom: 'Tite',              chapitres: 3  },
          { abrev: 'Phm', nom: 'Philémon',          chapitres: 1  },
        ],
      },
      {
        nom: 'Épîtres générales',
        livres: [
          { abrev: 'He',   nom: 'Hébreux',  chapitres: 13 },
          { abrev: 'Jc',   nom: 'Jacques',  chapitres: 5  },
          { abrev: '1Pi',  nom: '1 Pierre', chapitres: 5  },
          { abrev: '2Pi',  nom: '2 Pierre', chapitres: 3  },
          { abrev: '1Jn',  nom: '1 Jean',   chapitres: 5  },
          { abrev: '2Jn',  nom: '2 Jean',   chapitres: 1  },
          { abrev: '3Jn',  nom: '3 Jean',   chapitres: 1  },
          { abrev: 'Jude', nom: 'Jude',     chapitres: 1  },
        ],
      },
      {
        nom: 'Prophétie',
        livres: [
          { abrev: 'Ap', nom: 'Apocalypse', chapitres: 22 },
        ],
      },
    ],
  },
};

export const ALL_BOOKS = [
  ...BIBLE_STRUCTURE.ancienTestament.categories.flatMap(c => c.livres),
  ...BIBLE_STRUCTURE.nouveauTestament.categories.flatMap(c => c.livres),
];

export const DAILY_VERSES = [
  { ref: 'Jean 3:16',        texte: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle." },
  { ref: 'Psaumes 23:1',     texte: "L'Éternel est mon berger : je ne manquerai de rien." },
  { ref: 'Matthieu 5:3',     texte: "Heureux les pauvres en esprit, car le royaume des cieux est à eux !" },
  { ref: 'Proverbes 3:5',    texte: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse." },
  { ref: 'Philippiens 4:13', texte: "Je puis tout par celui qui me fortifie." },
  { ref: 'Ésaïe 40:31',      texte: "Mais ceux qui se confient en l'Éternel renouvellent leur force." },
  { ref: 'Romains 8:28',     texte: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu." },
];