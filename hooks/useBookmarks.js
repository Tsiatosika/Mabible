import { useState, useEffect, useCallback } from 'react';
import { getBookmarks, addBookmark, removeBookmark } from '../utils/storage';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBookmarks(); }, []);

  async function loadBookmarks() {
    setLoading(true);
    const data = await getBookmarks();
    setBookmarks(data);
    setLoading(false);
  }

  const toggle = useCallback(async (verset) => {
    const exists = bookmarks.some(b => b.id === verset.id);
    if (exists) {
      setBookmarks(await removeBookmark(verset.id));
    } else {
      setBookmarks(await addBookmark(verset));
    }
  }, [bookmarks]);

  const isFavorite = useCallback(
    (versetId) => bookmarks.some(b => b.id === versetId),
    [bookmarks]
  );

  return { bookmarks, loading, toggle, isFavorite, reload: loadBookmarks };
}