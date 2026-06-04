// src/pages/promo/Promo.jsx
// Route: /promo
// Tambahkan di App.jsx:
//   import Promo from "./pages/promo/Promo";
//   <Route path="/promo" element={<AnimatedPage><Promo /></AnimatedPage>} />

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import {
  Tag,
  Clock,
  ChevronRight,
  ShoppingBag,
  Star,
  Percent,
  Gift,
  Truck,
  CreditCard,
  Package,
  Calendar,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import "./Promo.css";

/* ─── helpers ─── */
const safeImg = (url) => {
  if (!url) return "";
  let u = url.replace(/^http:\/\//i, "https://");
  if (/i\.ibb\.co/i.test(u))
    return "https://images.weserv.nl/?url=" + encodeURIComponent(u);
  return u;
};

const formatRp = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

function getTypeIcon(type) {
  switch (type) {
    case "discount_percent": return <Percent size={16} />;
    case "discount_fixed":   return <Tag size={16} />;
    case "bundle":           return <Package size={16} />;
    case "free_shipping":    return <Truck size={16} />;
    case "cashback":         return <CreditCard size={16} />;
    default:                 return <Gift size={16} />;
  }
}

function getDiscountLabel(p) {
  if (!p.discountValue) return null;
  if (p.type === "discount_percent" || p.type === "cashback")
    return `${p.discountValue}% OFF`;
  if (p.type === "discount_fixed")
    return formatRp(p.discountValue);
  return null;
}

/* ─── Countdown hook ─── */
function useCountdown(endDate) {
  const [t, setT] = useState({});
  useEffect(() => {
    if (!endDate) return;
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0, expired: true }); return; }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: false,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);
  return t;
}

/* ─── Nearest expiry countdown for hero ─── */
function HeroCountdown({ promos }) {
  const nearest = promos
    .filter((p) => p.active && p.endDate && new Date(p.endDate).getTime() > Date.now())
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))[0];

  const t = useCountdown(nearest?.endDate);

  if (!nearest) return null;

  return (
    <div className="promo-hero__countdown">
      <p className="promo-hero__countdown-label">Promo Minggu Ini Berakhir Dalam:</p>
      <div className="promo-hero__timer">
        {[
          { val: t.d, label: "HARI" },
          { val: t.h, label: "JAM" },
          { val: t.m, label: "MENIT" },
          { val: t.s, label: "DETIK" },
        ].map(({ val, label }) => (
          <div key={label} className="promo-timer-block">
            <span className="promo-timer-num">
              {String(val ?? 0).padStart(2, "0")}
            </span>
            <span className="promo-timer-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Promo Card ─── */
function PromoCard({ promo, index }) {
  const t = useCountdown(promo.endDate);
  const discLabel = getDiscountLabel(promo);
  const isExpired = promo.endDate && new Date(promo.endDate).getTime() < Date.now();

  return (
    <div
      className="promo-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="promo-card__img-wrap">
        {promo.image
          ? <img src={safeImg(promo.image)} alt={promo.title} className="promo-card__img" />
          : <div className="promo-card__img-placeholder"><Tag size={40} /></div>
        }
        {/* Badges */}
        {promo.badgeLabel && !isExpired && (
          <span className="promo-card__badge promo-card__badge--active">
            {promo.badgeLabel}
          </span>
        )}
        {isExpired && (
          <span className="promo-card__badge promo-card__badge--expired">
            Kadaluarsa
          </span>
        )}
        {promo.featured && !isExpired && (
          <span className="promo-card__badge promo-card__badge--featured">
            <Star size={10} style={{ display: "inline", verticalAlign: "middle" }} /> Unggulan
          </span>
        )}
        {/* Discount pill */}
        {discLabel && !isExpired && (
          <div className="promo-card__discount">
            {discLabel}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="promo-card__body">
        <div className="promo-card__type-icon">
          {getTypeIcon(promo.type)}
        </div>
        <h3 className="promo-card__title">{promo.title}</h3>
        {promo.subtitle && (
          <p className="promo-card__subtitle">{promo.subtitle}</p>
        )}
        <p className="promo-card__desc">{promo.description}</p>

        {/* Meta */}
        <div className="promo-card__meta">
          {promo.minPurchase > 0 && (
            <span className="promo-card__meta-item">
              <ShoppingBag size={11} />
              Min. {formatRp(promo.minPurchase)}
            </span>
          )}
          {promo.endDate && !isExpired && (
            <span className="promo-card__meta-item">
              <Calendar size={11} />
              s/d {promo.endDate}
            </span>
          )}
        </div>

        {/* Countdown */}
        {promo.endDate && !isExpired && !t.expired && t.d !== undefined && t.d < 7 && (
          <div className="promo-card__countdown">
            <Clock size={12} />
            <span>
              {t.d}h {String(t.h).padStart(2,"0")}:{String(t.m).padStart(2,"0")}:{String(t.s).padStart(2,"0")} tersisa
            </span>
          </div>
        )}

        {/* CTA */}
        <Link
          to={isExpired ? "#" : (promo.productLink || "/produk")}
          className={`promo-card__cta${isExpired ? " promo-card__cta--disabled" : ""}`}
          onClick={isExpired ? (e) => e.preventDefault() : undefined}
        >
          {isExpired ? "Promo Berakhir" : (promo.ctaLabel || "Belanja Sekarang")}
          {!isExpired && <ArrowRight size={14} />}
        </Link>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   MAIN PAGE COMPONENT
════════════════════════════════════ */
export default function Promo() {
  const [promos,  setPromos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("semua"); // semua | aktif | unggulan

  useEffect(() => {
    const unsub = onValue(ref(db, "promos"), (snap) => {
      const data = snap.val();
      setPromos(
        data
          ? Object.entries(data)
              .map(([id, v]) => ({ ...v, firebaseId: id }))
              .filter((p) => p.active) // only active promos for public
              .sort((a, b) => {
                // Featured first, then by createdAt
                if (b.featured !== a.featured) return b.featured ? 1 : -1;
                return (b.createdAt || 0) - (a.createdAt || 0);
              })
          : []
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const isExpired = (p) =>
    p.endDate && new Date(p.endDate).getTime() < Date.now();

  const activeCount   = promos.filter((p) => !isExpired(p)).length;
  const featuredCount = promos.filter((p) => p.featured && !isExpired(p)).length;
  const maxDiscount   = promos.reduce((max, p) => {
    if (p.type === "discount_percent" && p.discountValue > max)
      return p.discountValue;
    return max;
  }, 0);

  const expiringSoon = promos.filter(
    (p) =>
      !isExpired(p) &&
      p.endDate &&
      new Date(p.endDate).getTime() - Date.now() < 7 * 86400000
  ).length;

  const displayed = promos.filter((p) => {
    if (filter === "aktif")    return !isExpired(p);
    if (filter === "unggulan") return p.featured && !isExpired(p);
    return true;
  });

  return (
    <div className="promo-root">

      {/* ── HERO ── */}
      <section className="promo-hero">
        <div className="promo-hero__bg" />
        <div className="promo-hero__content">
          <div className="promo-hero__badge">
            <Sparkles size={14} />
            Promo Terbaru
          </div>
          <h1 className="promo-hero__title">
            Promo &amp; Penawaran
            <br />
            <span className="promo-hero__title-accent">Spesial Edupark</span>
          </h1>
          <p className="promo-hero__desc">
            Nikmati berbagai diskon menarik untuk produk Edupark.
            Dapatkan penawaran terbaik setiap minggu dengan harga yang lebih hemat.
          </p>
          <Link to="/produk" className="promo-hero__btn">
            <ShoppingBag size={16} />
            Eksplor Penawaran
          </Link>
        </div>
        <div className="promo-hero__right">
          {/* Stats */}
          <div className="promo-hero__stats">
            {[
              { icon: <Tag size={18} />,     label: "Total Promo Aktif",      value: `${activeCount} Promo`,   sub: "Update per hari ini" },
              { icon: <Percent size={18} />, label: "Diskon Tertinggi",       value: `${maxDiscount}% OFF`,    sub: "Untuk produk kursus pilihan" },
              { icon: <Clock size={18} />,   label: "Promo Berakhir Minggu Ini", value: `${expiringSoon} Promo`, sub: "Segera manfaatkan penawarannya", accent: true },
            ].map(({ icon, label, value, sub, accent }) => (
              <div key={label} className={`promo-stat-card${accent ? " promo-stat-card--accent" : ""}`}>
                <div className="promo-stat-card__icon">{icon}</div>
                <div>
                  <div className="promo-stat-card__label">{label}</div>
                  <div className={`promo-stat-card__value${accent ? " promo-stat-card__value--accent" : ""}`}>{value}</div>
                  <div className="promo-stat-card__sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Countdown */}
          {!loading && promos.length > 0 && (
            <HeroCountdown promos={promos} />
          )}
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="promo-body">

        {/* Filter tabs */}
        <div className="promo-filter">
          <h2 className="promo-filter__title">Pilih Penawaran Terbaik</h2>
          <p className="promo-filter__sub">Voucher dan diskon eksklusif untuk kemajuan belajarmu.</p>
          <div className="promo-filter__tabs">
            {[
              { key: "semua",    label: "Semua Promo" },
              { key: "aktif",    label: "Aktif" },
              { key: "unggulan", label: "Unggulan" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`promo-tab${filter === key ? " promo-tab--active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="promo-loading">
            <div className="promo-spinner" />
            <p>Memuat promo...</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="promo-empty">
            <Tag size={48} />
            <h3>Belum ada promo tersedia</h3>
            <p>Pantau terus halaman ini untuk penawaran terbaru dari Edupark.</p>
            <Link to="/produk" className="promo-empty__btn">
              Lihat Semua Produk <ChevronRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="promo-grid">
            {displayed.map((p, i) => (
              <PromoCard key={p.firebaseId} promo={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── SYARAT & KETENTUAN ── */}
      <section className="promo-tnc">
        <div className="promo-tnc__inner">
          <div className="promo-tnc__icon">
            <AlertCircle size={18} />
          </div>
          <h3 className="promo-tnc__title">Syarat &amp; Ketentuan Umum</h3>
          <ul className="promo-tnc__list">
            {[
              "Promo tidak dapat digabung dengan promo atau voucher lainnya kecuali disebutkan sebaliknya.",
              "Selama persediaan masih tersedia pada saat transaksi dilakukan.",
              "Berlaku sesuai periode promo yang tercantum pada masing-masing penawaran.",
              "Edupark berhak mengubah syarat dan ketentuan tanpa pemberitahuan sebelumnya.",
            ].map((item, i) => (
              <li key={i} className="promo-tnc__item">
                <Check size={14} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="promo-cta">
        <div className="promo-cta__inner">
          <h2 className="promo-cta__title">Jangan Lewatkan Promo Menarik Edupark!</h2>
          <p className="promo-cta__desc">
            Belanja sekarang dan dapatkan produk edukasi serta hasil alam terbaik dengan harga paling hemat minggu ini.
          </p>
          <Link to="/produk" className="promo-cta__btn">
            Belanja Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}