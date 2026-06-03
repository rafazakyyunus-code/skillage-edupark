// src/pages/Etiket/ETicket.jsx

import "./ETicket.css";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import TicketDetailModal from "./TicketDetailModal";
import HeroTicket from "../../assets/images/foto dafi.png";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaShoppingCart,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";

/* ─────────────────────────────────────────
   HELPER: harga weekday terendah dari objek `prices`
───────────────────────────────────────── */
function getLowestWeekdayPrice(item) {
  if (item.prices && typeof item.prices === "object") {
    const values = Object.values(item.prices)
      .map((e) => parseInt(String(e.weekday || "0").replace(/[^\d]/g, ""), 10))
      .filter((n) => n > 0);
    if (values.length === 0) return null;
    return Math.min(...values);
  }
  if (item.weekday) {
    const parsed = parseInt(String(item.weekday).replace(/[^\d]/g, ""), 10);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

function formatRupiah(number) {
  if (!number) return "—";
  return "Rp " + number.toLocaleString("id-ID");
}

/* ═══════════════════════════════════════════
   KOMPONEN UTAMA
═══════════════════════════════════════════ */
export default function ETicket() {
  const navigate = useNavigate();

  const [allPackages, setAllPackages]         = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [initialView, setInitialView]         = useState("detail");

  /* ── Fetch realtime dari Firebase ── */
  useEffect(() => {
    const db      = getDatabase();
    const tickRef = ref(db, "ticketsOnline");

    const unsub = onValue(tickRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([key, val]) => ({ ...val, firebaseId: key }))
          .sort((a, b) => {
            const aSales = a.salesCount || 0;
            const bSales = b.salesCount || 0;
            if (bSales !== aSales) return bSales - aSales;
            return (a.order || 99) - (b.order || 99);
          });
        setAllPackages(list);
      } else {
        setAllPackages([]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* ── Filter Top 3 Packages ── */
  const topPackages = useMemo(() => {
    if (allPackages.length === 0) return [];

    const hasSales = allPackages.some((p) => typeof p.salesCount === "number" && p.salesCount > 0);
    if (hasSales) return allPackages.slice(0, 3);

    const featured    = allPackages.filter((p) => p.featured === true);
    const nonFeatured = allPackages.filter((p) => p.featured !== true);
    const merged      = [...featured, ...nonFeatured];
    return merged.slice(0, 3);
  }, [allPackages]);

  /* ── Best Value ID ── */
  const bestValueId = useMemo(() => {
    if (topPackages.length === 0) return null;
    const withSales = topPackages.filter(
      (p) => typeof p.salesCount === "number" && p.salesCount > 0
    );
    if (withSales.length > 0) {
      return withSales.reduce((best, cur) =>
        cur.salesCount > best.salesCount ? cur : best
      ).firebaseId;
    }
    const feat = topPackages.find((p) => p.featured === true);
    return feat ? feat.firebaseId : null;
  }, [topPackages]);

  /* ── Handlers ── */
  function openDetail(item) {
    setInitialView("detail");
    setSelectedPackage(item);
  }

  function openForm(item) {
    setInitialView("form");
    setSelectedPackage(item);
  }

  const handleHeroBeliTiketClick = () => {
    const textMessage = "Halo Admin Skillage Edupark, saya ingin bertanya tentang pemesanan tiket online untuk berkunjung ke Edupark. Boleh dibantu info kuota terdekat?";
    window.open(`https://wa.me/6285219801259?text=${encodeURIComponent(textMessage)}`, "_blank");
  };

  const handlePesanKunjunganKelompok = () => {
    const textMessage = "Halo Admin Skillage Edupark, saya berencana melakukan pemesanan tiket rombongan / kunjungan kelompok (lebih dari 20 orang). Boleh minta informasi penawaran harga spesial dan prosedurnya?";
    window.open(`https://wa.me/6285219801259?text=${encodeURIComponent(textMessage)}`, "_blank");
  };

  /* ── 3 skeleton kartu saat loading ── */
  function renderSkeletons() {
    return Array.from({ length: 3 }).map((_, i) => (
      <div className="et-card" key={i} style={{ opacity: 0.4, pointerEvents: "none" }}>
        <div style={{ height: 220, background: "#dde5dd", borderRadius: 22, marginBottom: 22 }} />
        <div style={{ height: 26, width: "65%", background: "#dde5dd", borderRadius: 8, marginBottom: 14 }} />
        <div style={{ height: 14, width: "85%", background: "#dde5dd", borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 14, width: "55%", background: "#dde5dd", borderRadius: 6 }} />
      </div>
    ));
  }

  return (
    <div className="eticket-page">
      {/* HERO */}
     {/* HERO */}
<section className="et-hero">
  <div className="et-hero-left">
    <span className="et-badge">
      Selamat Datang di Masa Depan Pembelajaran
    </span>

    <h1>
      Tempat <span>Belajar</span>
      <br />
       Menyatu Dengan Alam.
    </h1>

    <p>
            Jelajahi berbagai pameran interaktif dan keajaiban luar ruangan yang dirancang khusus 
            untuk memuaskan rasa ingin tahu Anda. Pesan kunjungan Anda hari ini dan rasakan perpaduan 
            sempurna antara edukasi yang seru di taman hijau kami yang asri.
    </p>

    <div className="et-hero-buttons">
      <button
        className="et-buy-btn"
        onClick={() => navigate("/tickets-online")}
      >
        <FaTicketAlt />
        Beli Tiket Online
      </button>

      <button
        className="et-view-btn"
        onClick={() => navigate("/attractions")}
      >
         Lihat Wahana Wisata
      </button>
    </div>
  </div>

  <div className="et-hero-right">
    <div className="et-image-wrapper">
      <img
        src={HeroTicket}
        alt="Edupark"
      />
    </div>
  </div>
</section>

      {/* ════════════════ EDUCATIONAL PACKAGES ════════════════ */}
      <section className="et-packages">
        <div className="et-title">
          <h2>Paket Edukasi</h2>
          <p>
            Pilih pengalaman terbaik untuk kunjungan Anda. Mulai dari penjelajah individu 
            hingga rombongan sekolah besar, kami menyediakan paket yang dirancang khusus untuk Anda.
          </p>
        </div>

        <div className="et-package-grid">

          {loading && renderSkeletons()}

          {!loading && allPackages.length === 0 && (
            <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#687180", padding: "40px 0" }}>
              Belum ada paket tiket yang tersedia saat ini.
            </p>
          )}

          {!loading && topPackages.map((item) => {
            const isBest      = item.firebaseId === bestValueId;
            const lowestPrice = getLowestWeekdayPrice(item);

            const features = Array.isArray(item.features)
              ? item.features.slice(0, 3)
              : ["Tiket Masuk Termasuk", "Pemandu Wisata", "Akses Semua Area"];

            const subtitle = Array.isArray(item.features) && item.features.length > 0
              ? item.features[0]
              : item.category || "Paket Wisata";

            return (
              <div
                className={`et-card ${isBest ? "et-active" : ""}`}
                key={item.firebaseId}
              >
                {isBest && <span className="et-best">PILIHAN TERBAIK</span>}

                {item.image && (
                  <div className="et-image-top">
                    <img src={item.image} alt={item.title} />
                  </div>
                )}

                <h3>{item.title}</h3>
                <p className="et-desc">{subtitle}</p>

                <h1>
                  {lowestPrice ? formatRupiah(lowestPrice) : "—"}
                  <span>/orang</span>
                </h1>

                <ul>
                  {features.map((feat, idx) => (
                    <li key={idx}>
                      <FaCheckCircle />
                      {feat}
                    </li>
                  ))}
                </ul>

                <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                  <button
                    style={{ flex: 1 }}
                    className={isBest ? "et-active-btn" : ""}
                    onClick={() => openForm(item)}
                  >
                    Pesan Sekarang
                  </button>

                  <button
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "transparent",
                      color: "#22c55e",
                      border: "none",
                      cursor: "pointer"
                    }}
                    onClick={() => openDetail(item)}
                  >
                    Selengkapnya <FaArrowRight />
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* ════════════════ MANAGE YOUR VISIT ════════════════ */}
      <section className="et-manage">
        <div className="et-title">
          <h2>Atur Kunjungan Anda</h2>
        </div>

        <div className="et-manage-grid">
          <div className="et-manage-card">
            <div className="et-manage-icon">
              <FaShoppingCart />
            </div>
            <h3>Tiket Instan</h3>
            <p>
              Lewati antrean dan amankan kuota kunjungan Anda hari ini dengan sistem pemesanan 
              online kami yang cepat.
            </p>
            <button
              className="et-card-beli"
              onClick={() => navigate("/tickets-online")}
            >
              Beli Tiket Secara Online
            </button>
          </div>

          <div className="et-manage-card">
            <div className="et-manage-icon">
              <FaCalendarAlt />
            </div>
            <h3>Pesan Grup</h3>
            <p>
              Merencanakan acara kunjungan untuk lebih dari 20 orang? Dapatkan penawaran harga 
              spesial dan koordinator khusus.
            </p>
            <button 
              className="et-card-beli"
              onClick={handlePesanKunjunganKelompok}
            >
              Pesan Kunjungan Kelompok
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════ MODAL ════════════════ */}
      <TicketDetailModal
        selected={selectedPackage}
        initialView={initialView}
        onClose={() => setSelectedPackage(null)}
      />

    </div>
  );
}