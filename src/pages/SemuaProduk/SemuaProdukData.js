// src/pages/SemuaProduk/SemuaProdukData.js
// ──────────────────────────────────────────────────────────────────────────
// Data produk sekarang bersumber dari Firebase Realtime Database (node: /produk)
// yang dikelola melalui Editor Portal → menu "Produk".
//
// CARA KERJA:
//   • useProdukData()  → hook untuk listen realtime dari Firebase
//   • filterProducts() → helper filter (tidak berubah)
//   • CATEGORIES, SORT_OPTIONS, ITEMS_PER_PAGE, formatRp, getPages → tidak berubah
// ──────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

/* ── Realtime hook (dipakai oleh Index.jsx dan ProdukDetail.jsx) ── */
export function useProdukData() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const db      = getDatabase();
    const prodRef = ref(db, "produk");

    const unsub = onValue(prodRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([key, val]) => ({
          ...val,
          // Pastikan id unik tersedia untuk routing /produk/:id
          id:         key,         // Firebase key (string)
          firebaseId: key,
        }));
        // Urutkan terbaru dulu (createdAt DESC)
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setProducts(list);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { products, loading };
}

/* ── Filter helper ── */
export function filterProducts(products, search, category) {
  return products.filter((p) => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Semua Produk" || p.category === category;
    return matchSearch && matchCategory;
  });
}

/* ── Konstanta (tidak berubah) ── */
export const CATEGORIES = [
  "Semua Produk",
  "Hewan Peternakan",
  "Sayuran",
  "Saprodi",
];

export const SORT_OPTIONS = [
  { value: "terbaru",   label: "Terbaru" },
  { value: "terlaris",  label: "Terlaris" },
  { value: "harga-asc", label: "Harga Terendah" },
  { value: "harga-desc",label: "Harga Tertinggi" },
];

export const ITEMS_PER_PAGE = 6;

export function formatRp(num) {
  return "Rp " + Number(num).toLocaleString("id-ID");
}

export function getPages(currentPage, totalPages) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
  if (currentPage >= totalPages - 2)
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}