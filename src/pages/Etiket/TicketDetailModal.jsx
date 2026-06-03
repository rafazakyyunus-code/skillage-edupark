// src/pages/Etiket/TicketDetailModal.jsx
// Versi baru: mendukung sistem kuantitas multi-kategori (Anak, Dewasa, Pelajar, dll.)

import "./TicketDetailModal.css";
import { useState, useEffect, useMemo } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimes,
  FaWhatsapp,
  FaArrowLeft,
  FaUsers,
  FaTag,
  FaLeaf,
  FaReceipt,
} from "react-icons/fa";

// ─── Helpers ───────────────────────────────────────────────────

function isWeekend(dateStr) {
  if (!dateStr) return false;
  const day = new Date(dateStr + "T00:00:00").getDay();
  return day === 0 || day === 6;
}

function parseRupiah(str) {
  if (!str) return 0;
  return parseInt(String(str).replace(/[^\d]/g, ""), 10) || 0;
}

function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getTodayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Ambil array kategori dari objek `prices` di paket.
 * Contoh input:
 *   { anak: { label: "Anak-Anak", weekday: "Rp 25.000", weekend: "Rp 35.000" }, ... }
 * Output:
 *   [{ key: "anak", label: "Anak-Anak", weekday: "Rp 25.000", weekend: "Rp 35.000" }, ...]
 */
function getPriceCategories(selected) {
  if (selected?.prices && typeof selected.prices === "object") {
    return Object.entries(selected.prices).map(([key, val]) => ({
      key,
      label:   val.label   || key,
      weekday: val.weekday || "Rp 0",
      weekend: val.weekend || "Rp 0",
    }));
  }
  // Fallback: paket lama hanya punya weekday/weekend global
  return [
    {
      key:     "umum",
      label:   "Umum",
      weekday: selected?.weekday || "Rp 0",
      weekend: selected?.weekend || "Rp 0",
    },
  ];
}

/**
 * Inisialisasi state jumlah tiket per kategori.
 * default: kategori pertama = 1, sisanya = 0.
 */
function initJumlahTiket(categories) {
  const obj = {};
  categories.forEach((cat, idx) => {
    obj[cat.key] = idx === 0 ? 1 : 0;
  });
  return obj;
}

// ─── Component ─────────────────────────────────────────────────

export default function TicketDetailModal({ selected, initialView = "detail", onClose }) {
  const [view, setView]             = useState(initialView);
  const [nama, setNama]             = useState("");
  const [tanggal, setTanggal]       = useState("");
  const [jumlahTiket, setJumlahTiket] = useState({});
  const [errors, setErrors]         = useState({});

  // Deteksi jenis hari secara reaktif
  const weekend = isWeekend(tanggal);
  const dayType = weekend ? "Weekend" : "Weekday";

  // Ambil kategori harga dari paket yang dipilih
  const categories = useMemo(() => getPriceCategories(selected), [selected]);

  // Reset setiap kali paket / initialView berubah
  useEffect(() => {
    if (selected) {
      setView(initialView);
      setNama("");
      setTanggal("");
      setJumlahTiket(initJumlahTiket(getPriceCategories(selected)));
      setErrors({});
    }
  }, [selected, initialView]);

  // ── Kalkulasi real-time ──────────────────────────────────────

  /**
   * Hitung sub-total per kategori dan grand total.
   * Mengembalikan array { key, label, qty, unitPrice, subtotal }
   * dan nilai totalHarga.
   * Semua hooks HARUS di atas early return agar urutan tidak berubah.
   */
  const { breakdown, totalHarga } = useMemo(() => {
    const priceKey = weekend ? "weekend" : "weekday";
    let total = 0;
    const breakdown = categories.map((cat) => {
      const qty       = jumlahTiket[cat.key] || 0;
      const unitPrice = parseRupiah(cat[priceKey]);
      const subtotal  = qty * unitPrice;
      total += subtotal;
      return { key: cat.key, label: cat.label, qty, unitPrice, subtotal };
    });
    return { breakdown, totalHarga: total };
  }, [categories, jumlahTiket, weekend]);

  // Jumlah total semua tiket (untuk validasi minimal 1)
  const totalQty = breakdown.reduce((sum, b) => sum + b.qty, 0);

  // ── Early return SETELAH semua hooks ────────────────────────
  if (!selected) return null;

  // ── Helpers state jumlah ────────────────────────────────────

  function setQty(key, value) {
    const v = Math.max(0, parseInt(value, 10) || 0);
    setJumlahTiket((prev) => ({ ...prev, [key]: v }));
    if (errors.jumlah) setErrors((p) => ({ ...p, jumlah: "" }));
  }

  function incrementQty(key) {
    setJumlahTiket((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    if (errors.jumlah) setErrors((p) => ({ ...p, jumlah: "" }));
  }

  function decrementQty(key) {
    setJumlahTiket((prev) => ({ ...prev, [key]: Math.max(0, (prev[key] || 0) - 1) }));
  }

  // ── Validasi ────────────────────────────────────────────────

  function validate() {
    const e = {};
    if (!nama.trim())   e.nama    = "Nama pemesan wajib diisi.";
    if (!tanggal)       e.tanggal = "Tanggal kunjungan wajib dipilih.";
    if (totalQty < 1)   e.jumlah  = "Minimal 1 tiket harus dipesan.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Kirim WhatsApp ──────────────────────────────────────────

  function handleSendWA() {
    if (!validate()) return;

    const priceKey = weekend ? "weekend" : "weekday";

    // Baris rincian per kategori (hanya yang qty > 0)
    const rincianLines = breakdown
      .filter((b) => b.qty > 0)
      .map(
        (b) =>
          `   • ${b.label}: ${b.qty} tiket × ${formatRupiah(b.unitPrice)} = *${formatRupiah(b.subtotal)}*`
      )
      .join("\n");

    const message =
      `*🎟️ BOOKING SKILLAGE EDUPARK*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `📦 *Paket*       : ${selected.title}\n` +
      `👤 *Nama*        : ${nama.trim()}\n` +
      `📅 *Tanggal*     : ${formatDateDisplay(tanggal)}\n` +
      `🗓️ *Jenis Hari*  : ${dayType}\n\n` +
      `🎫 *Rincian Tiket:*\n` +
      `${rincianLines}\n\n` +
      `💰 *Total Biaya  : ${formatRupiah(totalHarga)}*\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Mohon instruksi pembayaran selanjutnya. Terima kasih! 🙏`;

    window.open(
      `https://wa.me/6285219801259?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div
      className="td-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="td-modal">

        {/* ── Top Bar ── */}
        <div className="td-topbar">
          <div className="td-topbar-brand">
            {view === "form" ? (
              <button
                className="td-back"
                onClick={() => setView("detail")}
                aria-label="Kembali"
              >
                <FaArrowLeft />
                <span>Kembali</span>
              </button>
            ) : (
              <>
                <div className="td-topbar-icon" aria-hidden="true">
                  <FaLeaf />
                </div>
                <span className="td-topbar-title">Skillage Edupark</span>
              </>
            )}
          </div>

          <button className="td-close" onClick={onClose} aria-label="Tutup modal">
            <FaTimes />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="td-scroll-content">

          {/* ════════════ DETAIL VIEW ════════════ */}
          {view === "detail" && (
            <>
              <div className="td-hero">
                <span className="td-badge">Destinasi Populer</span>
                <img src={selected.image} alt={selected.title} />
              </div>

              {/* Harga per kategori */}
              <div className="td-section-label">
                <span>Harga Tiket</span>
              </div>

              <div className="td-prices-multi">
                {categories.map((cat) => (
                  <div className="td-price-row" key={cat.key}>
                    <div className="td-price-row-label">
                      <FaUsers className="td-price-row-icon" />
                      <span>{cat.label}</span>
                    </div>
                    <div className="td-price-row-values">
                      <div className="td-price-pill weekday-pill">
                        <small>Weekday</small>
                        <strong>{cat.weekday}</strong>
                      </div>
                      <div className="td-price-pill weekend-pill">
                        <small>Weekend</small>
                        <strong>{cat.weekend}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fitur paket */}
              <div className="td-section-label">
                <span>Detail Paket</span>
              </div>

              <div className="td-features">
                {Array.isArray(selected.features) && selected.features.filter(Boolean).length > 0
                  ? selected.features.filter(Boolean).map((feat, idx) => (
                      <div key={idx}><FaCheckCircle />{feat}</div>
                    ))
                  : (
                    <div style={{ gridColumn: "1 / -1", color: "#aaa", fontSize: "0.88rem", padding: "8px 0" }}>
                      Belum ada detail paket yang ditambahkan.
                    </div>
                  )
                }
              </div>
            </>
          )}

          {/* ════════════ FORM VIEW ════════════ */}
          {view === "form" && (
            <>
              <div className="td-form-header">
                <div className="td-form-package-badge">
                  <FaTag />
                  {selected.title}
                </div>
                <h2>Isi Data Pemesanan</h2>
                <p>Lengkapi form di bawah untuk melanjutkan ke WhatsApp.</p>
              </div>

              <div className="td-form-body">

                {/* ── Nama ── */}
                <div className={`td-field ${errors.nama ? "has-error" : ""}`}>
                  <label htmlFor="td-nama">
                    <FaUsers />
                    Nama Pemesan
                  </label>
                  <input
                    id="td-nama"
                    type="text"
                    placeholder="Contoh: Aditia Saputra"
                    value={nama}
                    onChange={(e) => {
                      setNama(e.target.value);
                      if (errors.nama) setErrors((p) => ({ ...p, nama: "" }));
                    }}
                  />
                  {errors.nama && <span className="td-error">{errors.nama}</span>}
                </div>

                {/* ── Tanggal ── */}
                <div className={`td-field ${errors.tanggal ? "has-error" : ""}`}>
                  <label htmlFor="td-tanggal">
                    <FaCalendarAlt />
                    Tanggal Kunjungan
                  </label>
                  <input
                    id="td-tanggal"
                    type="date"
                    min={getTodayStr()}
                    value={tanggal}
                    onChange={(e) => {
                      setTanggal(e.target.value);
                      if (errors.tanggal) setErrors((p) => ({ ...p, tanggal: "" }));
                    }}
                  />
                  {tanggal && (
                    <span className={`td-day-badge ${weekend ? "weekend" : "weekday"}`}>
                      {weekend ? "🟠 Weekend" : "🔵 Weekday"} — {formatDateDisplay(tanggal)}
                    </span>
                  )}
                  {errors.tanggal && <span className="td-error">{errors.tanggal}</span>}
                </div>

                {/* ── Kuantitas per Kategori ── */}
                <div className={`td-field ${errors.jumlah ? "has-error" : ""}`}>
                  <label>
                    <FaTag />
                    Jumlah Tiket per Kategori
                  </label>

                  <div className="td-category-list">
                    {categories.map((cat) => {
                      const priceKey  = weekend ? "weekend" : "weekday";
                      const unitPrice = parseRupiah(cat[priceKey]);
                      const qty       = jumlahTiket[cat.key] || 0;

                      return (
                        <div className="td-category-row" key={cat.key}>
                          <div className="td-category-info">
                            <span className="td-category-label">{cat.label}</span>
                            <span className="td-category-price">
                              {tanggal
                                ? formatRupiah(unitPrice)
                                : <span className="td-price-placeholder">Pilih tanggal dulu</span>
                              }
                              <span className="td-price-day-tag">/{dayType}</span>
                            </span>
                          </div>

                          <div className="td-qty-row">
                            <button
                              type="button"
                              className="td-qty-btn"
                              onClick={() => decrementQty(cat.key)}
                              aria-label={`Kurangi ${cat.label}`}
                            >−</button>
                            <input
                              type="number"
                              min={0}
                              value={qty}
                              onChange={(e) => setQty(cat.key, e.target.value)}
                              aria-label={`Jumlah ${cat.label}`}
                            />
                            <button
                              type="button"
                              className="td-qty-btn"
                              onClick={() => incrementQty(cat.key)}
                              aria-label={`Tambah ${cat.label}`}
                            >+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {errors.jumlah && <span className="td-error">{errors.jumlah}</span>}
                </div>

                {/* ── Ringkasan Rincian Tiket ── */}
                <div className="td-total-box">
                  <div className="td-total-header">
                    <FaReceipt style={{ color: "#1a5c2a", fontSize: "0.9rem" }} />
                    <span>Ringkasan Pemesanan</span>
                  </div>

                  {breakdown.filter((b) => b.qty > 0).length === 0 ? (
                    <p className="td-total-empty">Belum ada tiket yang dipilih.</p>
                  ) : (
                    <>
                      {breakdown
                        .filter((b) => b.qty > 0)
                        .map((b) => (
                          <div className="td-total-row" key={b.key}>
                            <span>
                              {b.label}
                              <em className="td-qty-inline"> ×{b.qty}</em>
                            </span>
                            <strong>
                              {tanggal ? formatRupiah(b.subtotal) : "—"}
                            </strong>
                          </div>
                        ))
                      }
                      <div className="td-total-divider" />
                    </>
                  )}

                  <div className="td-total-row total">
                    <span>Total Biaya</span>
                    <strong>
                      {tanggal && totalQty > 0 ? formatRupiah(totalHarga) : "—"}
                    </strong>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>

        {/* ── Sticky Footer ── */}
        <div className="td-footer">
          {view === "detail" ? (
            <>
              <button className="td-cancel" onClick={onClose}>Tutup</button>
              <button className="td-book" onClick={() => setView("form")}>
                <FaWhatsapp />
                Pesan Sekarang
              </button>
            </>
          ) : (
            <>
              <button className="td-cancel" onClick={() => setView("detail")}>
                Kembali
              </button>
              <button className="td-book" onClick={handleSendWA}>
                <FaWhatsapp />
                Konfirmasi via WhatsApp
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}