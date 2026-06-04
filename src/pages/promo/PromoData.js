// src/pages/promo/PromoData.js
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";

/**
 * Hook untuk fetch data promo dari Firebase Realtime Database.
 * Data promo tersimpan di path: /promos
 */
export function usePromoData() {
  const [promos, setPromos]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, "promos"), (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, v]) => ({ ...v, firebaseId: id }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setPromos(list);
      } else {
        setPromos([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { promos, loading };
}

/**
 * Hook untuk fetch data produk dari Firebase (untuk promo reference)
 */
export function usePromoProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = onValue(ref(db, "produk"), (snap) => {
      const data = snap.val();
      setProducts(
        data
          ? Object.entries(data)
              .map(([id, v]) => ({ ...v, firebaseId: id }))
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          : []
      );
    });
    return () => unsub();
  }, []);

  return products;
}

/**
 * Format harga ke Rupiah
 */
export const formatRp = (n) =>
  "Rp " + Number(n || 0).toLocaleString("id-ID");

/**
 * Hitung sisa waktu promo
 */
export function useCountdown(endDate) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    if (!endDate) return;

    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0, expired: true });
        return;
      }
      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000) / 60000);
      const secs  = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ days, hours, mins, secs, expired: false });
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  return timeLeft;
}