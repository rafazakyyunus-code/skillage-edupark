import { Link } from "react-router-dom";
import "./ProgramPage.css";
import heroImage from "/src/assets/images/panen.jpg";
import workshop from "/src/assets/images/workshop1.jpg";
import { MessageCircle, Leaf } from 'lucide-react';

export default function VenueWorkshop() {
  const fasilitas = [
    { icon: "🏛️", title: "Belajar Menanam", desc: "Belajar menanam tumbuhan dengan cara yang benar dan menyenangkan" },
    { icon: "📽️", title: "Budidaya Maggot", desc: "Belajar proses budidaya maggot BSF untuk pakan ternak organik" },
    { icon: "🍽️", title: "Memberi Makan Hewan", desc: "Praktek memberikan makan hewan ternak dengan cara yang benar" },
    { icon: "🌿", title: "Jelajah Alam", desc: "Belajar hal-hal menarik yang ada di alam Edupark Skillage" },
  ];

  return (
    <div className="program-page">

      {/* ===== HERO ===== */}
      <section
        className="program-hero workshop-hero"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        {/* Overlay gelap */}
        <div className="hero-overlay" />

        {/* Konten hero — di-tengah oleh flexbox dari CSS */}
        <div className="hero-content">
          <span className="badge">
            <Leaf size={15} />
            Program Kami
          </span>
          <h1>Venue Workshop</h1>
          <p>Ruang ideal untuk pelatihan, seminar, dan kegiatan edukatif bersama alam.</p>
          <div className="hero-btns">
            <a href="#booking" className="btn-primary">Booking Sekarang</a>
            <a href="#fasilitas" className="btn-outline">Lihat Fasilitas</a>
          </div>
        </div>
      </section>

      {/* ===== TENTANG ===== */}
      <section className="program-about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <span className="tag">Tentang Venue</span>
              <h2>Belajar Lebih Bermakna <br /><span className="green">Di Alam Terbuka</span></h2>
              <p>
                Melalui workshop ini, peserta dapat belajar tentang cara merawat tanaman, mengenal siklus
                pertumbuhan, hingga memahami kehidupan hewan ternak secara nyata. Suasana alam yang asri
                membuat proses belajar menjadi lebih santai, seru, dan mudah dipahami.
              </p>
              <div className="stats-row">
                <div className="stat"><strong>200+</strong><span>Kapasitas</span></div>
                <div className="stat"><strong>50+</strong><span>Event/Tahun</span></div>
                <div className="stat"><strong>4</strong><span>Ruangan</span></div>
              </div>
            </div>
            <div className="about-visual">
              <div className="visual-card">
                <div className="visual-image">
                  <img src={workshop} alt="Venue Workshop Edupark" />
                </div>
                <p>Venue nyaman dan profesional menanti Anda!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FASILITAS ===== */}
      <section className="program-features" id="fasilitas">
        <div className="container">
          <h2 className="section-title">Yang Kami Ajarkan</h2>
          <div className="features-grid">
            {fasilitas.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="program-cta" id="booking">
        <div className="container">
          <h2>Siap Booking Venue?</h2>
          <p>Hubungi kami untuk informasi ketersediaan dan harga sewa venue</p>
          <div className="cta-btns">
            <a
              href="https://wa.me/6281234567890"
              className="btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={20} />
              WhatsApp Kami
            </a>
            <Link to="/" className="btn-outline">← Kembali ke Beranda</Link>
          </div>
        </div>
      </section>

    </div>
  );
}