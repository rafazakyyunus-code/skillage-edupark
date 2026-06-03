// src/pages/Etiket/TicketsOnline.jsx
// Versi baru: membaca objek `prices` (multi-kategori) dari Firebase Realtime Database

import "./TicketsOnline.css";
import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import TicketDetailModal from "./TicketDetailModal";

import {
  FaSwimmingPool,
  FaTree,
  FaCampground,
  FaArrowRight,
  FaTicketAlt,
  FaUsers,
  FaStar,
} from "react-icons/fa";

// Map iconName string → JSX icon component
const ICON_MAP = {
  FaSwimmingPool: <FaSwimmingPool />,
  FaTree:         <FaTree />,
  FaCampground:   <FaCampground />,
  FaTicketAlt:    <FaTicketAlt />,
  FaUsers:        <FaUsers />,
  FaStar:         <FaStar />,
};

/**
 * Mengambil harga terendah weekday dari objek `prices` untuk ditampilkan
 * sebagai "mulai dari" di kartu paket.
 *
 * Jika paket lama masih memakai format weekday/weekend flat (string),
 * fungsi ini juga menanganinya sebagai fallback.
 */
function getStartingPrice(item) {
  if (item.prices && typeof item.prices === "object") {
    const entries = Object.values(item.prices);
    if (entries.length === 0) return null;
    // Ambil harga weekday terendah di antara semua kategori
    const parsed = entries
      .map((e) => parseInt(String(e.weekday || "0").replace(/[^\d]/g, ""), 10))
      .filter(Boolean);
    if (parsed.length === 0) return null;
    const min = Math.min(...parsed);
    return "Rp " + min.toLocaleString("id-ID");
  }
  // Fallback: format lama
  return item.weekday || null;
}

/**
 * Mengambil ringkasan harga weekday + weekend untuk kartu.
 * Jika paket multi-kategori, tampilkan range (misal "Rp 25.000 – Rp 40.000").
 * Jika paket lama (flat), tampilkan nilai tunggal.
 */
function getPriceRange(item, dayType) {
  if (item.prices && typeof item.prices === "object") {
    const entries = Object.values(item.prices);
    if (entries.length === 0) return "—";
    const prices = entries
      .map((e) => parseInt(String(e[dayType] || "0").replace(/[^\d]/g, ""), 10))
      .filter(Boolean)
      .sort((a, b) => a - b);
    if (prices.length === 0) return "—";
    const fmt = (n) => "Rp " + n.toLocaleString("id-ID");
    if (prices.length === 1 || prices[0] === prices[prices.length - 1]) {
      return fmt(prices[0]);
    }
    return `${fmt(prices[0])} – ${fmt(prices[prices.length - 1])}`;
  }
  // Fallback: format lama
  return item[dayType] || "—";
}

export default function TicketsOnline() {

  const [packages, setPackages]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [initialView, setInitialView]         = useState("detail");

  /* ── Load realtime dari Firebase ── */
  useEffect(() => {
    const db     = getDatabase();
    const tickRef = ref(db, "ticketsOnline");
    const unsub  = onValue(tickRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([key, val]) => ({ ...val, firebaseId: key }))
          .sort(
            (a, b) =>
              (a.order || 0) - (b.order || 0) ||
              (a.createdAt || "").localeCompare(b.createdAt || "")
          );
        setPackages(list);
      } else {
        setPackages([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  function openDetail(item) {
    setInitialView("detail");
    setSelectedPackage(item);
  }

  function openForm(item) {
    setInitialView("form");
    setSelectedPackage(item);
  }

  return (
    <div className="ticket-page">

      {/* ── HERO ── */}
      <section className="ticket-hero">
        <span className="ticket-badge">PILIHAN PAKET</span>
        <h1>
          Pilih Paket Wisata
          <span> Terbaik Anda</span>
        </h1>
        <p>
          Paket yang dirancang untuk memberikan pengalaman edukasi,
          rekreasi dan konservasi alam yang tak terlupakan.
        </p>
      </section>

      {/* ── LOADING ── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7c6b", fontSize: 15 }}>
          Memuat paket tiket...
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && packages.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7c6b" }}>
          <p style={{ fontSize: 15 }}>Belum ada paket tiket yang tersedia saat ini.</p>
        </div>
      )}

      {/* ── PACKAGE GRID ── */}
      {!loading && packages.length > 0 && (
        <section className="ticket-grid">
          {packages.map((item) => {
            const weekdayRange = getPriceRange(item, "weekday");
            const weekendRange = getPriceRange(item, "weekend");

            return (
              <div
                className={`ticket-card ${item.featured ? "featured" : ""}`}
                key={item.firebaseId}
              >
                <div className="ticket-image">
                  <img src={item.image} alt={item.title} />
                </div>

                <div className="ticket-content">

                  <span className="ticket-category">
                    {ICON_MAP[item.iconName] || <FaTicketAlt />}
                    {item.category || "Paket Wisata"}
                  </span>

                  <h3>{item.title}</h3>

                  {/* Price boxes — sekarang menampilkan range jika multi-kategori */}
                  <div className="price-wrapper">
                    <div className="price-box">
                      <small>Harga Weekday</small>
                      <strong>{weekdayRange}</strong>
                    </div>
                    <div className="price-box">
                      <small>Harga Weekend</small>
                      <strong>{weekendRange}</strong>
                    </div>
                  </div>

                  <div className="ticket-buttons">
                    <button
                      className="book-btn"
                      onClick={() => openForm(item)}
                    >
                      Pesan Sekarang
                    </button>

                    <button
                      className="detail-btn"
                      onClick={() => openDetail(item)}
                    >
                      Selengkapnya
                      <FaArrowRight />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* ── MISSION ── */}
      <section className="ticket-mission">
        <div className="mission-image">
          <div className="glow"></div>
        </div>
        <div className="mission-content">
          <span>MISI KAMI</span>
          <h2>
            Melindungi Alam Sambil
            Menginspirasi Generasi Muda
          </h2>
          <p>
            Nusantara Edupark bukan sekadar tempat wisata.
            Kami adalah pusat konservasi dan edukasi terpadu
            yang menghubungkan manusia dengan alam.
          </p>
          <ul>
            <li>✔ Kurikulum edukasi berbasis konservasi</li>
            <li>✔ Fasilitas ramah lingkungan</li>
            <li>✔ Pemberdayaan masyarakat lokal</li>
          </ul>
          <button>Selengkapnya Tentang Kami</button>
        </div>
      </section>

      {/* ── MODAL ── */}
      <TicketDetailModal
        selected={selectedPackage}
        initialView={initialView}
        onClose={() => setSelectedPackage(null)}
      />

    </div>
  );
}