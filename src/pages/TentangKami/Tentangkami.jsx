import "./Tentangkami.css";
import HeroBg from "../../assets/images/pemandangan sekolah.png";
import JourneyImg from "../../assets/images/cerita.png";
import { GraduationCap, UsersRound, TreePine, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

const FIREBASE_URL = "https://skillage-edupark-default-rtdb.firebaseio.com";

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="tk-star-picker" aria-label="Pilih bintang">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`tk-star-btn ${star <= (hovered || value) ? "active" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          aria-label={`${star} bintang`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function TentangKami() {
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  const [form, setForm] = useState({ name: "", message: "", rating: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // "success" | "error"
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);

  /* ── Fetch testimonials dari Firebase ── */
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${FIREBASE_URL}/testimonials.json`);
        const data = await res.json();
        if (data) {
          const list = Object.entries(data)
            .map(([id, val]) => ({ id, ...val }))
            .sort((a, b) => b.timestamp - a.timestamp);
          setTestimonials(list);
        } else {
          setTestimonials([]);
        }
      } catch {
        setTestimonials([]);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  /* ── Submit testimoni baru ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError("Nama tidak boleh kosong.");
    if (!form.message.trim()) return setFormError("Pesan tidak boleh kosong.");
    if (form.rating === 0) return setFormError("Pilih setidaknya 1 bintang.");

    setFormError("");
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        message: form.message.trim(),
        rating: form.rating,
        timestamp: Date.now(),
      };
      const res = await fetch(`${FIREBASE_URL}/testimonials.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const { name: id } = await res.json();

      setTestimonials((prev) => [{ id, ...payload }, ...prev]);
      setForm({ name: "", message: "", rating: 0 });
      setSubmitStatus("success");
      setShowForm(false);
    } catch {
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 4000);
    }
  };

  const renderStars = (count) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < count ? "star-filled" : "star-empty"}>
        ★
      </span>
    ));

  return (
    <>
      {/* HERO */}
      <section
        className="tk-hero fade-section"
        style={{ backgroundImage: `url(${HeroBg})` }}
      >
        <div className="tk-hero-overlay"></div>
        <div className="tk-hero-content">
          <span className="tk-hero-tag">TENTANG EDUPARK</span>
          <h1>Tentang Kami</h1>
          <p>
            Pelajari lebih lanjut tentang perjalanan Edupark kami dan komitmen kami terhadap
            pembelajaran berbasis alam.
          </p>
        </div>
      </section>

      {/* PERJALANAN (JOURNEY) */}
      <section className="tk-journey">
        <div className="tk-journey-container">
          <div className="tk-journey-upper">
            <div className="tk-journey-img-wrapper">
              <img src={JourneyImg} alt="Perjalanan Edupark" />
            </div>
            <div className="tk-journey-text">
              <span className="section-tag">CERITA KAMI</span>
              <h2>Perjalanan Edupark</h2>
              <h4>Akar Perjalanan Kami</h4>
              <p>
                Bermula dari keprihatinan kami terhadap data yang menunjukkan peningkatan
                signifikan jumlah anak dengan spektrum autisme di Indonesia, Edupark hadir
                sebagai solusi ruang tumbuh yang holistik. Kami memahami bahwa metode belajar
                konvensional seringkali belum cukup. Oleh karena itu, Edupark dirancang
                sebagai wadah untuk mengasah sensorik-motorik, pembelajaran eksperimental,
                serta kecerdasan tambahan anak melalui interaksi langsung dengan alam.
              </p>
              <h4>Oase di Tengah Kepadatan Urban</h4>
              <p>
                Kami menyadari bahwa bagi masyarakat di kota padat seperti Jakarta,
                Bekasi, dan Bogor, tekanan rutinitas seringkali memicu kejenuhan.
                Edupark hadir sebagai destinasi "pelarian positif" di mana pengunjung dapat
                melepas penat sembari mempelajari siklus pertanian berkelanjutan.
                Kami membawa suasana pedesaan yang asri ke dalam jangkauan masyarakat kota,
                memberikan ketenangan sekaligus ilmu pengetahuan baru.
              </p>
            </div>
          </div>

          <div className="tk-journey-lower">
            <h4>Konsep Integrated Farm & Pertanian Terpadu</h4>
            <p>
              Edupark mengusung konsep Integrated Farm (Pertanian Terpadu), sebuah ekosistem mandiri yang
              memadukan pertanian, peternakan, dan perkebunan dalam satu siklus yang saling menguntungkan.
              Di sini, pengunjung tidak hanya melihat, tetapi terlibat dalam:
            </p>
            <ul className="tk-journey-list">
              <li>
                <strong>Stimulasi Alamiah:</strong> Menggunakan tekstur tanah, tanaman, dan interaksi hewan
                untuk mendukung perkembangan saraf sensorik anak.
              </li>
              <li>
                <strong>Edukasi Berkelanjutan:</strong> Mempelajari bagaimana limbah ternak menjadi nutrisi
                bagi tanaman, menciptakan sistem pangan yang ramah lingkungan.
              </li>
              <li>
                <strong>Kemandirian & Empati:</strong> Melalui kegiatan bercocok tanam dan merawat hewan,
                kami membangun karakter, kemandirian, dan kecerdasan emosional bagi setiap individu.
              </li>
            </ul>
            <h4>Komitmen Kami</h4>
            <p>
              Edupark adalah tempat di mana inklusivitas bertemu dengan keberlanjutan. Kami berkomitmen untuk
              menyediakan lingkungan yang hangat bagi anak-anak istimewa untuk berkembang, sekaligus menjadi
              pusat pembelajaran pertanian bagi siapa saja yang ingin kembali ke alam.
            </p>
            <blockquote className="tk-journey-quote">
              "Di Edupark, kami percaya bahwa alam adalah guru terbaik untuk menyembuhkan, mendidik, dan menginspirasi."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ALASAN / KEUNGGULAN */}
      <section className="tk-reason">
        <span className="section-tag center">KEUNGGULAN KAMI</span>
        <h2>Kenapa memilih Skillage Edupark?</h2>
        <div className="tk-reason-grid">
          <div className="reason-card">
            <div className="icon"><UsersRound size={40} color="#22c55e" /></div>
            <h4>Pembelajaran Interaktif</h4>
            <p>Metode belajar aktif yang melibatkan eksplorasi langsung di alam terbuka.</p>
          </div>
          <div className="reason-card">
            <div className="icon"><GraduationCap size={40} color="#22c55e" /></div>
            <h4>Mentor Ahli</h4>
            <p>Didampingi oleh tenaga pendidik profesional dan ahli lingkungan berpengalaman.</p>
          </div>
          <div className="reason-card">
            <div className="icon"><TreePine size={40} color="#22c55e" /></div>
            <h4>Berbasis Alam</h4>
            <p>Kurikulum yang terintegrasi dengan ekosistem alam yang asri dan terjaga.</p>
          </div>
          <div className="reason-card">
            <div className="icon"><ShieldCheck size={40} color="#22c55e" /></div>
            <h4>Lingkungan Aman</h4>
            <p>Keamanan fasilitas yang terjamin untuk kenyamanan belajar seluruh peserta.</p>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIAL (FIREBASE) ===== */}
      <section className="tk-testimonial fade-section">
        <div className="tk-testimonial-header">
          <span className="tk-section-tag">TESTIMONI</span>
          <h2>Lalu apa kata mereka?</h2>
          <p className="tk-testimonial-sub">
            Ceritakan pengalamanmu bersama Edupark dan bantu pengunjung lain mengenal kami lebih baik.
          </p>

          {/* Tombol buka form */}
          {!showForm && (
            <button
            className="tk-review-toggle-btn"
            onClick={() => setShowForm(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Tulis Testimoni
          </button>
          )}
        </div>

        {/* ── FORM TESTIMONI ── */}
        {showForm && (
          <div className="tk-review-form-wrapper">
            <form className="tk-review-form" onSubmit={handleSubmit} noValidate>
              <h3>Bagikan Pengalamanmu</h3>

              <div className="tk-form-group">
                <label htmlFor="tk-name">Nama</label>
                <input
                  id="tk-name"
                  type="text"
                  placeholder="Nama lengkap kamu"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  maxLength={60}
                />
              </div>

              <div className="tk-form-group">
                <label>Rating</label>
                <StarRating
                  value={form.rating}
                  onChange={(r) => setForm((f) => ({ ...f, rating: r }))}
                />
              </div>

              <div className="tk-form-group">
                <label htmlFor="tk-message">Pesan</label>
                <textarea
                  id="tk-message"
                  placeholder="Ceritakan pengalamanmu di Edupark..."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  maxLength={400}
                />
                <span className="tk-char-count">{form.message.length}/400</span>
              </div>

              {formError && <p className="tk-form-error">{formError}</p>}

              <div className="tk-form-actions">
                <button
                  type="button"
                  className="tk-form-cancel"
                  onClick={() => { setShowForm(false); setFormError(""); }}
                >
                  Batal
                </button>
                <button type="submit" className="tk-form-submit" disabled={submitting}>
                  {submitting ? "Mengirim..." : "Kirim Testimoni"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── STATUS NOTIF ── */}
        {submitStatus === "success" && (
          <div className="tk-submit-notice success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11"></polyline>
            </svg>
            Terima kasih! Testimonimu telah berhasil dikirim.
          </div>
        )}

        {submitStatus === "error" && (
          <div className="tk-submit-notice error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Gagal mengirim. Coba lagi beberapa saat.
          </div>
        )}

        {/* ── DAFTAR TESTIMONI ── */}
        {loadingTestimonials ? (
          <div className="tk-testimonial-loading">
            <span className="tk-spinner"></span>
            <p>Memuat testimoni...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="tk-testimonial-empty">
            <p>Belum ada testimoni. Jadilah yang pertama! 🌱</p>
          </div>
        ) : (
          <div className="tk-testimonial-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="tk-testimonial-card">
                <div className="tk-testimonial-avatar">
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <h4>{t.name}</h4>
                <p>"{t.message}"</p>
                <span className="stars tk-stars-row">{renderStars(t.rating)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="tk-cta fade-section">
        <h2>Kunjungi Edupark Hari Ini</h2>
        <p>Mulailah petualangan belajar bersama Edupark sekarang juga.</p>
        <a
          href="https://wa.me/6285219801259?text=Halo%20Admin%20Skillage%20Edupark%2C%20saya%20tertarik%20untuk%20mengunjungi%20Edupark%20dan%20memulai%20petualangan%20belajar.%20Boleh%20tahu%20info%20mengenai%20program%20dan%20jadwal%20kegiatan%20yang%20tersedia%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="tk-cta-btn"
        >
          Hubungi Kami
        </a>
      </section>
    </>
  );
}