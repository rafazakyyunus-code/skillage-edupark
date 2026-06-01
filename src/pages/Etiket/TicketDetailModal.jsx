// src/pages/Etiket/TicketDetailModal.jsx

import "./TicketDetailModal.css";
import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimes,
  FaWhatsapp,
  FaArrowLeft,
  FaUsers,
  FaTag,
  FaLeaf,
} from "react-icons/fa";

// ─── Helpers ───────────────────────────────────────────────────

function isWeekend(dateStr) {
  if (!dateStr) return false;
  const day = new Date(dateStr + "T00:00:00").getDay();
  return day === 0 || day === 6;
}

function parseRupiah(str) {
  return parseInt(str.replace(/[^\d]/g, ""), 10) || 0;
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

// ─── Component ─────────────────────────────────────────────────

export default function TicketDetailModal({ selected, initialView = "detail", onClose }) {
  const [view, setView]       = useState(initialView);
  const [nama, setNama]       = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jumlah, setJumlah]   = useState(1);
  const [errors, setErrors]   = useState({});

  // Reset setiap kali paket/initialView berubah
  useEffect(() => {
    if (selected) {
      setView(initialView);
      setNama("");
      setTanggal("");
      setJumlah(1);
      setErrors({});
    }
  }, [selected, initialView]);

  if (!selected) return null;

  const weekend      = isWeekend(tanggal);
  const pricePerUnit = parseRupiah(weekend ? selected.weekend : selected.weekday);
  const totalHarga   = pricePerUnit * jumlah;
  const dayType      = weekend ? "Weekend" : "Weekday";

  function validate() {
    const e = {};
    if (!nama.trim()) e.nama    = "Nama pemesan wajib diisi.";
    if (!tanggal)     e.tanggal = "Tanggal kunjungan wajib dipilih.";
    if (jumlah < 1)   e.jumlah  = "Jumlah tiket minimal 1.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSendWA() {
    if (!validate()) return;
    const message =
      `🌿 *Booking Skillage Edupark*\n\n` +
      `• *Paket*      : ${selected.title}\n` +
      `• *Nama*       : ${nama.trim()}\n` +
      `• *Tanggal*    : ${formatDateDisplay(tanggal)} (${dayType})\n` +
      `• *Jumlah*     : ${jumlah} Tiket/Paket\n` +
      `• *Harga/unit* : ${formatRupiah(pricePerUnit)}\n` +
      `• *Total Biaya*: ${formatRupiah(totalHarga)}\n\n` +
      `Mohon instruksi pembayaran selanjutnya, terima kasih. 🙏`;
    window.open(
      `https://wa.me/6285219801259?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

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

          {/* ════════════════ DETAIL VIEW ════════════════ */}
          {view === "detail" && (
            <>
              <div className="td-hero">
                <span className="td-badge">Destinasi Populer</span>
                <img src={selected.image} alt={selected.title} />
              </div>

              <div className="td-prices">
                <div className="td-price-card">
                  <div className="td-price-icon" aria-hidden="true">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <small>HARGA WEEKDAY</small>
                    <strong>{selected.weekday}</strong>
                  </div>
                </div>
                <div className="td-price-card">
                  <div className="td-price-icon" aria-hidden="true">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <small>HARGA WEEKEND</small>
                    <strong>{selected.weekend}</strong>
                  </div>
                </div>
              </div>

              <div className="td-section-label">
                <span>Detail Paket</span>
              </div>

              <div className="td-features">
                <div><FaCheckCircle />Kolam anak dengan wahana interaktif</div>
                <div><FaCheckCircle />Family slide aman untuk segala usia</div>
                <div><FaCheckCircle />Gazebo dan area santai keluarga</div>
                <div><FaCheckCircle />Fasilitas keamanan lengkap</div>
                <div><FaCheckCircle />Area foto instagramable</div>
                <div><FaCheckCircle />Pemandu wisata profesional</div>
              </div>
            </>
          )}

          {/* ════════════════ FORM VIEW ════════════════ */}
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

                {/* Nama */}
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

                {/* Tanggal */}
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

                {/* Jumlah */}
                <div className={`td-field ${errors.jumlah ? "has-error" : ""}`}>
                  <label htmlFor="td-jumlah">
                    <FaTag />
                    Jumlah Tiket / Paket
                  </label>
                  <div className="td-qty-row">
                    <button
                      type="button"
                      className="td-qty-btn"
                      onClick={() => setJumlah((q) => Math.max(1, q - 1))}
                      aria-label="Kurangi"
                    >−</button>
                    <input
                      id="td-jumlah"
                      type="number"
                      min={1}
                      value={jumlah}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        setJumlah(isNaN(v) || v < 1 ? 1 : v);
                        if (errors.jumlah) setErrors((p) => ({ ...p, jumlah: "" }));
                      }}
                    />
                    <button
                      type="button"
                      className="td-qty-btn"
                      onClick={() => setJumlah((q) => q + 1)}
                      aria-label="Tambah"
                    >+</button>
                  </div>
                  {errors.jumlah && <span className="td-error">{errors.jumlah}</span>}
                </div>

                {/* Total */}
                <div className="td-total-box">
                  <div className="td-total-row">
                    <span>Harga per tiket ({dayType})</span>
                    <strong>{tanggal ? formatRupiah(pricePerUnit) : "—"}</strong>
                  </div>
                  <div className="td-total-row">
                    <span>Jumlah tiket</span>
                    <strong>× {jumlah}</strong>
                  </div>
                  <div className="td-total-divider" />
                  <div className="td-total-row total">
                    <span>Total Biaya</span>
                    <strong>{tanggal ? formatRupiah(totalHarga) : "—"}</strong>
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