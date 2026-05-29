/**
 * useArticles.js
 * ──────────────────────────────────────────────────────
 * Custom hook untuk mengambil data artikel dari Firebase
 * Realtime Database secara real-time.
 *
 * Cara pakai di komponen mana saja:
 *   const { articles, loading, error } = useArticles();
 *
 * Kemudian pass `articles` ke:
 *   <WhyChoose articles={articles} />   ← homepage slider
 *   <ArticlePage articles={articles} />  ← halaman daftar artikel
 *   <ArticleDetail articles={articles} /> ← halaman detail artikel
 *
 * Dengan satu sumber data yang sama, semua komponen selalu sinkron.
 */

import { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "./firebaseConfig"; // sesuaikan path ke config Firebase kamu

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const articlesRef = ref(db, "articles");

    // onValue: listener real-time — otomatis update jika data di Firebase berubah
    const unsubscribe = onValue(
      articlesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const raw = snapshot.val();
          // Ubah object Firebase menjadi array, pastikan setiap item punya field `id`
          const arr = Object.entries(raw).map(([key, value]) => ({
            ...value,
            id: value.id || key, // gunakan id dari data, atau key Firebase sebagai fallback
          }));

          // Sort by date terbaru dulu (opsional, bisa diubah sesuai kebutuhan)
          arr.sort((a, b) => {
            const da = new Date(a.date || 0);
            const db2 = new Date(b.date || 0);
            return db2 - da;
          });

          setArticles(arr);
        } else {
          setArticles([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firebase read error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup: lepas listener saat komponen unmount
    return () => off(articlesRef, "value", unsubscribe);
  }, []);

  return { articles, loading, error };
}