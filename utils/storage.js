import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  BOOKMARKS:       '@bible:bookmarks',
  LAST_POSITION:   '@bible:last_position',
  READING_HISTORY: '@bible:reading_history',
  SETTINGS:        '@bible:settings',
};

export async function getBookmarks() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function addBookmark(verset) {
  try {
    const bookmarks = await getBookmarks();
    if (bookmarks.find(b => b.id === verset.id)) return bookmarks;
    const updated = [{ ...verset, addedAt: new Date().toISOString() }, ...bookmarks];
    await AsyncStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  } catch { return []; }
}

export async function removeBookmark(versetId) {
  try {
    const bookmarks = await getBookmarks();
    const updated = bookmarks.filter(b => b.id !== versetId);
    await AsyncStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  } catch { return []; }
}

export async function isBookmarked(versetId) {
  const bookmarks = await getBookmarks();
  return bookmarks.some(b => b.id === versetId);
}

export async function saveLastPosition(book, chapter) {
  try {
    await AsyncStorage.setItem(
      KEYS.LAST_POSITION,
      JSON.stringify({ book, chapter, savedAt: new Date().toISOString() })
    );
  } catch {}
}

export async function getLastPosition() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.LAST_POSITION);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function addToHistory(book, chapter) {
  try {
    const raw = await AsyncStorage.getItem(KEYS.READING_HISTORY);
    const history = raw ? JSON.parse(raw) : [];
    const entry = { book, chapter, readAt: new Date().toISOString() };
    const filtered = history.filter(h => !(h.book === book && h.chapter === chapter));
    const updated = [entry, ...filtered].slice(0, 100);
    await AsyncStorage.setItem(KEYS.READING_HISTORY, JSON.stringify(updated));
  } catch {}
}

export async function getReadingHistory() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.READING_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

const DEFAULT_SETTINGS = { fontSize: 17, theme: 'light' };

export async function getSettings() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
}