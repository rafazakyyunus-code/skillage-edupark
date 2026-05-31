// src/pages/SemuaProduk/SemuaProdukData.js

import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

/* ── Hook: realtime produk dari Firebase ── */
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
          id:         key,
          firebaseId: key,
        }));
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

/* ── Hook: realtime kategori produk dari Firebase ── */
export function useProdukCategories() {
  const [categories, setCategories] = useState(["Semua Produk"]);

  useEffect(() => {
    const db     = getDatabase();
    const catRef = ref(db, "produkCategories");

    const unsub = onValue(catRef, (snap) => {
      const data = snap.val();
      if (data) {
        const cats = Array.isArray(data)
          ? data.filter(Boolean)
          : Object.values(data).filter(Boolean);
        setCategories(["Semua Produk", ...cats]);
      } else {
        setCategories(["Semua Produk"]);
      }
    });

    return () => unsub();
  }, []);

  return categories;
}

/* ── Filter helper ── */
export function filterProducts(products, search, category) {
  return products.filter((p) => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Semua Produk" || p.category === category;
    return matchSearch && matchCategory;
  });
}

/* ── Konstanta statis (fallback) ── */
export const CATEGORIES = [
  "Semua Produk",
  "Hewan Peternakan",
  "Sayuran",
  "Saprodi",
];

export const SORT_OPTIONS = [
  { value: "terbaru",    label: "Terbaru" },
  { value: "terlaris",   label: "Terlaris" },
  { value: "harga-asc",  label: "Harga Terendah" },
  { value: "harga-desc", label: "Harga Tertinggi" },
];

export const ITEMS_PER_PAGE = 8;

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