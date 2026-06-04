import "./ContactPage.css";
import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Leaf
} from "lucide-react";

const FIREBASE_URL = "https://skillage-edupark-default-rtdb.firebaseio.com";

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="cp-star-picker" aria-label="Pilih bintang">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`cp-star-btn ${star <= (hovered || value) ? "active" : ""}`}
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

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);

  // ── Testimonial state ──
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [form, setForm] = useState({ name: "", message: "", rating: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
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
      <span key={i} className={i < count ? "cp-star-filled" : "cp-star-empty"}>
        ★
      </span>
    ));

  const faqData = [
    {
      question: "Bagaimana cara mengunjungi Edupark?",
      answer:
        "Anda dapat memesan tiket langsung melalui website kami atau datang langsung ke lokasi Edupark.",
    },
    {
      question: "Bagaimana cara menghubungi Edupark?",
      answer:
        "Anda dapat menghubungi kami melalui WhatsApp, email resmi, atau media sosial Edupark.",
    },
    {
      question: "Apakah Edupark terbuka untuk umum?",
      answer:
        "Ya, Edupark terbuka untuk umum setiap hari mulai pukul 08.00 - 17.00 WIB.",
    },
  ];

  return (
    <div className="contact-page">

      {/* HERO */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>

        <div className="contact-hero-content">
          <span className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Leaf size={18} className="text-green-500" />
            Edu Wisata Alam
          </span>

          <h1>Hubungi Edupark</h1>

          <p>
            Nikmati pengalaman belajar di tengah alam hijau yang asri
            bersama Edupark. Hubungi kami untuk informasi program,
            kunjungan sekolah, dan wisata edukasi.
          </p>

          <div className="hero-buttons">
            <a
              href="https://wa.me/6285219801259?text=Halo%20Admin%20Skillage%20Edupark%2C%20saya%20ingin%20bertanya%20mengenai%20informasi%20program%2C%20kunjungan%20sekolah%2C%20atau%20wisata%20edukasi%20di%20Edupark.%20Boleh%20dibantu%20penjelasan%20lebih%20lanjut%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn primary"
            >
              Hubungi Sekarang
            </a>

            <a
              href="https://maps.app.goo.gl/uLQJPTZXPhtBB8Az8"
              target="_blank"
              rel="noreferrer"
              className="hero-btn secondary"
            >
              Lihat Lokasi
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="contact-cards" id="contact-card">
        <div className="contact-container cards-grid">

          <div className="contact-card">
            <div className="icon-wrap">
              <MapPin className="contact-icon" />
            </div>

            <h3>Alamat</h3>

            <p>
             Jl. Raya Jonggol-Dayeuh Kp. Tegal Putat, RT.01/RW.06, Sukasirna, Kec. Jonggol, Kabupaten Bogor, Jawa Barat 16830
            </p>
          </div>

          <div className="contact-card">
            <div className="icon-wrap">
              <Phone className="contact-icon" />
            </div>

            <h3>Telepon</h3>

            <p>+62 821-1125-6508</p>
            <p>+62 852-1980-1259 </p>
          </div>

          <div className="contact-card">
            <div className="icon-wrap">
              <Mail className="contact-icon" />
            </div>

            <h3>Email</h3>

            <p>skillageislamic@gmail.com</p>
            
          </div>

          <div className="contact-card">
            <div className="icon-wrap">
              <Clock className="contact-icon" />
            </div>

            <h3>Jam Operasional</h3>

            <p>Senin - Minggu</p>
            <p>08:00 - 17:00 WIB</p>
          </div>

        </div>
      </section>

      {/* MAP */}
<section className="map-section">
  <div className="contact-container">

    <div className="section-header">
      <h2>Jelajahi Edupark</h2>
      <div className="line"></div>
    </div>

    <div className="map-box">

      <iframe
          title="Street View"
          src="https://www.google.com/maps/embed?pb=!4v1778395217229!6m8!1m7!1sCAoSLEFGMVFpcE5ybXh0T0xkY2V1dVh4T2N5c0hMZm1hU1pOV0x4QmJ0cXh5!2m2!1d-6.49517589349693!2d107.052314!3f0!4f0!5f0.7820865974627469"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

      <div className="map-dark-overlay"></div>

      <div className="map-overlay-box">

        <span className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Leaf size={18} className="text-green-500" />
          Edu Wisata Alam
        </span>

        <h3>Street View Edupark</h3>

        <p>
          Jelajahi Edupark dengan tampilan
          Street View 360° interaktif.
        </p>

        <div className="map-buttons">

          <a
            href="https://maps.google.com/?q=Skill+Village+Islamic+School"
            target="_blank"
            rel="noreferrer"
            className="map-btn primary"
          >
            Buka Maps
          </a>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Skill+Village+Islamic+School"
            target="_blank"
            rel="noreferrer"
            className="map-btn secondary"
          >
            Lokasi Saya
          </a>

        </div>

      </div>

    </div>

  </div>
</section>

      {/* TESTIMONIAL */}
      <section className="testimonial-section">
        <div className="contact-container">

          <div className="section-header">
            <h2>Apa Kata Mereka</h2>
            <p className="cp-testimonial-sub">
              Ceritakan pengalamanmu bersama Edupark dan bantu pengunjung lain mengenal kami lebih baik.
            </p>

            {/* Tombol buka form */}
            {!showForm && (
              <button
                className="cp-review-toggle-btn"
                onClick={() => setShowForm(true)}
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
            <div className="cp-review-form-wrapper">
              <form className="cp-review-form" onSubmit={handleSubmit} noValidate>
                <h3>Bagikan Pengalamanmu</h3>

                <div className="cp-form-group">
                  <label htmlFor="cp-name">Nama</label>
                  <input
                    id="cp-name"
                    type="text"
                    placeholder="Nama lengkap kamu"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    maxLength={60}
                  />
                </div>

                <div className="cp-form-group">
                  <label>Rating</label>
                  <StarRating
                    value={form.rating}
                    onChange={(r) => setForm((f) => ({ ...f, rating: r }))}
                  />
                </div>

                <div className="cp-form-group">
                  <label htmlFor="cp-message">Pesan</label>
                  <textarea
                    id="cp-message"
                    placeholder="Ceritakan pengalamanmu di Edupark..."
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    maxLength={400}
                  />
                  <span className="cp-char-count">{form.message.length}/400</span>
                </div>

                {formError && <p className="cp-form-error">{formError}</p>}

                <div className="cp-form-actions">
                  <button
                    type="button"
                    className="cp-form-cancel"
                    onClick={() => { setShowForm(false); setFormError(""); }}
                  >
                    Batal
                  </button>
                  <button type="submit" className="cp-form-submit" disabled={submitting}>
                    {submitting ? "Mengirim..." : "Kirim Testimoni"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── STATUS NOTIF ── */}
          {submitStatus === "success" && (
            <div className="cp-submit-notice success">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11"></polyline>
              </svg>
              Terima kasih! Testimonimu telah berhasil dikirim.
            </div>
          )}

          {submitStatus === "error" && (
            <div className="cp-submit-notice error">
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
            <div className="cp-testimonial-loading">
              <span className="cp-spinner"></span>
              <p>Memuat testimoni...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="cp-testimonial-empty">
              <p>Belum ada testimoni. Jadilah yang pertama! 🌱</p>
            </div>
          ) : (
            <div className="testimonial-grid">
              {testimonials.map((t) => (
                <div key={t.id} className="testimonial-card">
                  <h4 className="cp-testimonial-name">{t.name}</h4>
                  <p>"{t.message}"</p>
                  <span className="cp-stars-row">{renderStars(t.rating)}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="contact-container">

          <div className="section-header">
            <h2>Pertanyaan Umum</h2>

            <p>
              Beberapa pertanyaan yang sering ditanyakan pengunjung.
            </p>
          </div>

          <div className="faq-box">

            {faqData.map((faq, index) => (
              <div
                className={`faq-item ${
                  openFaq === index ? "active" : ""
                }`}
                key={index}
              >
                <div
                  className="faq-question"
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                >
                  <h4>{faq.question}</h4>

                  <ChevronDown
                    size={20}
                    className={
                      openFaq === index ? "rotate" : ""
                    }
                  />
                </div>

                <div
                  className={`faq-answer ${
                    openFaq === index ? "show" : ""
                  }`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

    </div>
  );
}