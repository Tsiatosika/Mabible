export const BIBLE_STRUCTURE = {
  ancienTestament: {
    label: 'Ancien Testament',
    labelEn: 'Old Testament',
    livres: 39,
    categories: [
      {
        nom: 'Pentateuque',
        nomEn: 'Pentateuch',
        livres: [
          { abrev: 'Gn',  nom: 'Genèse',       nomEn: 'Genesis',      kjvName: 'Genesis',      chapitres: 50 },
          { abrev: 'Ex',  nom: 'Exode',         nomEn: 'Exodus',       kjvName: 'Exodus',       chapitres: 40 },
          { abrev: 'Lv',  nom: 'Lévitique',     nomEn: 'Leviticus',    kjvName: 'Leviticus',    chapitres: 27 },
          { abrev: 'Nb',  nom: 'Nombres',       nomEn: 'Numbers',      kjvName: 'Numbers',      chapitres: 36 },
          { abrev: 'Dt',  nom: 'Deutéronome',   nomEn: 'Deuteronomy',  kjvName: 'Deuteronomy',  chapitres: 34 },
        ],
      },
      {
        nom: 'Livres historiques',
        nomEn: 'Historical Books',
        livres: [
          { abrev: 'Jos', nom: 'Josué',         nomEn: 'Joshua',          kjvName: 'Joshua',          chapitres: 24 },
          { abrev: 'Jg',  nom: 'Juges',         nomEn: 'Judges',          kjvName: 'Judges',          chapitres: 21 },
          { abrev: 'Rt',  nom: 'Ruth',          nomEn: 'Ruth',            kjvName: 'Ruth',            chapitres: 4  },
          { abrev: '1S',  nom: '1 Samuel',      nomEn: '1 Samuel',        kjvName: '1 Samuel',        chapitres: 31 },
          { abrev: '2S',  nom: '2 Samuel',      nomEn: '2 Samuel',        kjvName: '2 Samuel',        chapitres: 24 },
          { abrev: '1R',  nom: '1 Rois',        nomEn: '1 Kings',         kjvName: '1 Kings',         chapitres: 22 },
          { abrev: '2R',  nom: '2 Rois',        nomEn: '2 Kings',         kjvName: '2 Kings',         chapitres: 25 },
          { abrev: '1Ch', nom: '1 Chroniques',  nomEn: '1 Chronicles',    kjvName: '1 Chronicles',    chapitres: 29 },
          { abrev: '2Ch', nom: '2 Chroniques',  nomEn: '2 Chronicles',    kjvName: '2 Chronicles',    chapitres: 36 },
          { abrev: 'Esd', nom: 'Esdras',        nomEn: 'Ezra',            kjvName: 'Ezra',            chapitres: 10 },
          { abrev: 'Ne',  nom: 'Néhémie',       nomEn: 'Nehemiah',        kjvName: 'Nehemiah',        chapitres: 13 },
          { abrev: 'Est', nom: 'Esther',        nomEn: 'Esther',          kjvName: 'Esther',          chapitres: 10 },
        ],
      },
      {
        nom: 'Livres poétiques',
        nomEn: 'Poetic Books',
        livres: [
          { abrev: 'Jb',  nom: 'Job',           nomEn: 'Job',             kjvName: 'Job',             chapitres: 42  },
          { abrev: 'Ps',  nom: 'Psaumes',       nomEn: 'Psalms',          kjvName: 'Psalms',          chapitres: 150 },
          { abrev: 'Pr',  nom: 'Proverbes',     nomEn: 'Proverbs',        kjvName: 'Proverbs',        chapitres: 31  },
          { abrev: 'Ec',  nom: 'Ecclésiaste',   nomEn: 'Ecclesiastes',    kjvName: 'Ecclesiastes',    chapitres: 12  },
          { abrev: 'Ct',  nom: 'Cantique',      nomEn: 'Song of Solomon', kjvName: 'Song of Solomon', chapitres: 8   },
        ],
      },
      {
        nom: 'Livres prophétiques',
        nomEn: 'Prophetic Books',
        livres: [
          { abrev: 'Es',  nom: 'Ésaïe',        nomEn: 'Isaiah',     kjvName: 'Isaiah',     chapitres: 66 },
          { abrev: 'Jr',  nom: 'Jérémie',      nomEn: 'Jeremiah',   kjvName: 'Jeremiah',   chapitres: 52 },
          { abrev: 'Lm',  nom: 'Lamentations', nomEn: 'Lamentations',kjvName:'Lamentations',chapitres: 5  },
          { abrev: 'Ez',  nom: 'Ézéchiel',     nomEn: 'Ezekiel',    kjvName: 'Ezekiel',    chapitres: 48 },
          { abrev: 'Dn',  nom: 'Daniel',       nomEn: 'Daniel',     kjvName: 'Daniel',     chapitres: 12 },
          { abrev: 'Os',  nom: 'Osée',         nomEn: 'Hosea',      kjvName: 'Hosea',      chapitres: 14 },
          { abrev: 'Jl',  nom: 'Joël',         nomEn: 'Joel',       kjvName: 'Joel',       chapitres: 3  },
          { abrev: 'Am',  nom: 'Amos',         nomEn: 'Amos',       kjvName: 'Amos',       chapitres: 9  },
          { abrev: 'Ab',  nom: 'Abdias',       nomEn: 'Obadiah',    kjvName: 'Obadiah',    chapitres: 1  },
          { abrev: 'Jon', nom: 'Jonas',        nomEn: 'Jonah',      kjvName: 'Jonah',      chapitres: 4  },
          { abrev: 'Mi',  nom: 'Michée',       nomEn: 'Micah',      kjvName: 'Micah',      chapitres: 7  },
          { abrev: 'Na',  nom: 'Nahoum',       nomEn: 'Nahum',      kjvName: 'Nahum',      chapitres: 3  },
          { abrev: 'Ha',  nom: 'Habacuc',      nomEn: 'Habakkuk',   kjvName: 'Habakkuk',   chapitres: 3  },
          { abrev: 'So',  nom: 'Sophonie',     nomEn: 'Zephaniah',  kjvName: 'Zephaniah',  chapitres: 3  },
          { abrev: 'Ag',  nom: 'Aggée',        nomEn: 'Haggai',     kjvName: 'Haggai',     chapitres: 2  },
          { abrev: 'Za',  nom: 'Zacharie',     nomEn: 'Zechariah',  kjvName: 'Zechariah',  chapitres: 14 },
          { abrev: 'Ml',  nom: 'Malachie',     nomEn: 'Malachi',    kjvName: 'Malachi',    chapitres: 4  },
        ],
      },
    ],
  },
  nouveauTestament: {
    label: 'Nouveau Testament',
    labelEn: 'New Testament',
    livres: 27,
    categories: [
      {
        nom: 'Évangiles',
        nomEn: 'Gospels',
        livres: [
          { abrev: 'Mt', nom: 'Matthieu',  nomEn: 'Matthew', kjvName: 'Matthew', chapitres: 28 },
          { abrev: 'Mc', nom: 'Marc',      nomEn: 'Mark',    kjvName: 'Mark',    chapitres: 16 },
          { abrev: 'Lc', nom: 'Luc',       nomEn: 'Luke',    kjvName: 'Luke',    chapitres: 24 },
          { abrev: 'Jn', nom: 'Jean',      nomEn: 'John',    kjvName: 'John',    chapitres: 21 },
        ],
      },
      {
        nom: 'Histoire',
        nomEn: 'History',
        livres: [
          { abrev: 'Ac', nom: 'Actes', nomEn: 'Acts', kjvName: 'Acts', chapitres: 28 },
        ],
      },
      {
        nom: 'Épîtres de Paul',
        nomEn: "Paul's Epistles",
        livres: [
          { abrev: 'Rm',  nom: 'Romains',           nomEn: 'Romans',          kjvName: 'Romans',           chapitres: 16 },
          { abrev: '1Co', nom: '1 Corinthiens',     nomEn: '1 Corinthians',   kjvName: '1 Corinthians',    chapitres: 16 },
          { abrev: '2Co', nom: '2 Corinthiens',     nomEn: '2 Corinthians',   kjvName: '2 Corinthians',    chapitres: 13 },
          { abrev: 'Ga',  nom: 'Galates',           nomEn: 'Galatians',       kjvName: 'Galatians',        chapitres: 6  },
          { abrev: 'Ep',  nom: 'Éphésiens',         nomEn: 'Ephesians',       kjvName: 'Ephesians',        chapitres: 6  },
          { abrev: 'Ph',  nom: 'Philippiens',       nomEn: 'Philippians',     kjvName: 'Philippians',      chapitres: 4  },
          { abrev: 'Col', nom: 'Colossiens',        nomEn: 'Colossians',      kjvName: 'Colossians',       chapitres: 4  },
          { abrev: '1Th', nom: '1 Thessaloniciens', nomEn: '1 Thessalonians', kjvName: '1 Thessalonians',  chapitres: 5  },
          { abrev: '2Th', nom: '2 Thessaloniciens', nomEn: '2 Thessalonians', kjvName: '2 Thessalonians',  chapitres: 3  },
          { abrev: '1Tm', nom: '1 Timothée',        nomEn: '1 Timothy',       kjvName: '1 Timothy',        chapitres: 6  },
          { abrev: '2Tm', nom: '2 Timothée',        nomEn: '2 Timothy',       kjvName: '2 Timothy',        chapitres: 4  },
          { abrev: 'Tt',  nom: 'Tite',              nomEn: 'Titus',           kjvName: 'Titus',            chapitres: 3  },
          { abrev: 'Phm', nom: 'Philémon',          nomEn: 'Philemon',        kjvName: 'Philemon',         chapitres: 1  },
        ],
      },
      {
        nom: 'Épîtres générales',
        nomEn: 'General Epistles',
        livres: [
          { abrev: 'He',   nom: 'Hébreux',  nomEn: 'Hebrews',   kjvName: 'Hebrews',   chapitres: 13 },
          { abrev: 'Jc',   nom: 'Jacques',  nomEn: 'James',     kjvName: 'James',     chapitres: 5  },
          { abrev: '1Pi',  nom: '1 Pierre', nomEn: '1 Peter',   kjvName: '1 Peter',   chapitres: 5  },
          { abrev: '2Pi',  nom: '2 Pierre', nomEn: '2 Peter',   kjvName: '2 Peter',   chapitres: 3  },
          { abrev: '1Jn',  nom: '1 Jean',   nomEn: '1 John',    kjvName: '1 John',    chapitres: 5  },
          { abrev: '2Jn',  nom: '2 Jean',   nomEn: '2 John',    kjvName: '2 John',    chapitres: 1  },
          { abrev: '3Jn',  nom: '3 Jean',   nomEn: '3 John',    kjvName: '3 John',    chapitres: 1  },
          { abrev: 'Jude', nom: 'Jude',     nomEn: 'Jude',      kjvName: 'Jude',      chapitres: 1  },
        ],
      },
      {
        nom: 'Prophétie',
        nomEn: 'Prophecy',
        livres: [
          { abrev: 'Ap', nom: 'Apocalypse', nomEn: 'Revelation', kjvName: 'Revelation', chapitres: 22 },
        ],
      },
    ],
  },
};

export const ALL_BOOKS = [
  ...BIBLE_STRUCTURE.ancienTestament.categories.flatMap(c => c.livres),
  ...BIBLE_STRUCTURE.nouveauTestament.categories.flatMap(c => c.livres),
];

// Map kjvName → abrev pour le hook useBible
export const KJV_NAME_TO_ABREV = Object.fromEntries(
  ALL_BOOKS.map(b => [b.kjvName, b.abrev])
);

export const DAILY_VERSES = [
  {
    ref: 'Jean 3:16', refEn: 'John 3:16',
    texte: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
    texteEn: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
  },
  {
    ref: 'Psaumes 23:1', refEn: 'Psalms 23:1',
    texte: "L'Éternel est mon berger : je ne manquerai de rien.",
    texteEn: "The LORD is my shepherd; I shall not want.",
  },
  {
    ref: 'Matthieu 5:3', refEn: 'Matthew 5:3',
    texte: "Heureux les pauvres en esprit, car le royaume des cieux est à eux !",
    texteEn: "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
  },
  {
    ref: 'Proverbes 3:5', refEn: 'Proverbs 3:5',
    texte: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse.",
    texteEn: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
  },
  {
    ref: 'Philippiens 4:13', refEn: 'Philippians 4:13',
    texte: "Je puis tout par celui qui me fortifie.",
    texteEn: "I can do all things through Christ which strengtheneth me.",
  },
  {
    ref: 'Ésaïe 40:31', refEn: 'Isaiah 40:31',
    texte: "Mais ceux qui se confient en l'Éternel renouvellent leur force.",
    texteEn: "But they that wait upon the LORD shall renew their strength.",
  },
  {
    ref: 'Romains 8:28', refEn: 'Romans 8:28',
    texte: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu.",
    texteEn: "And we know that all things work together for good to them that love God.",
  },
];