import { Link } from "react-router-dom";
import "./ProgramPage.css";
import heroImage from "/src/assets/images/workshop.jpeg";
export default function VenueWorkshop() {
  const fasilitas = [
    { icon: "🏛️", title: "Ruang Serbaguna", desc: "Kapasitas hingga 200 peserta dengan AC & sound system" },
    { icon: "📽️", title: "Proyektor HD", desc: "Layar lebar untuk presentasi profesional" },
    { icon: "🍽️", title: "Catering", desc: "Tersedia paket konsumsi sesuai kebutuhan acara" },
    { icon: "🅿️", title: "Parkir Luas", desc: "Area parkir memadai untuk kendaraan roda 2 & 4" },
  ];

  return (
    <div className="program-page">
       <section
        className="program-hero workshop-hero"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="badge">🌿 Program Kami</span>
          <h1>Venue Workshop</h1>
          <p>Ruang ideal untuk pelatihan, seminar, dan kegiatan edukatif bersama alam.</p>
          <div className="hero-btns">
            <a href="#booking" className="btn-primary">Booking Sekarang</a>
            <a href="#fasilitas" className="btn-outline">Lihat Fasilitas</a>
          </div>
        </div>
      </section>

      <section className="program-about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <span className="tag">Tentang Venue</span>
              <h2>Belajar Lebih Bermakna <br /><span className="green">Di Alam Terbuka</span></h2>
              <p>
                Venue Workshop Edupark dirancang untuk menciptakan pengalaman belajar yang berbeda.
                Dikelilingi area hijau yang asri, peserta bisa fokus, kreatif, dan terinspirasi.
              </p>
              <div className="stats-row">
                <div className="stat"><strong>200+</strong><span>Kapasitas</span></div>
                <div className="stat"><strong>50+</strong><span>Event/Tahun</span></div>
                <div className="stat"><strong>4</strong><span>Ruangan</span></div>
              </div>
            </div>
            <div className="about-visual">
              <div className="visual-card">
                <div className="visual-icon">🏛️</div>
                <p>Venue nyaman dan profesional menanti Anda!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="program-features" id="fasilitas">
        <div className="container">
          <h2 className="section-title">Fasilitas Kami</h2>
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

      <section className="program-cta" id="booking">
        <div className="container">
          <h2>Siap Booking Venue?</h2>
          <p>Hubungi kami untuk informasi ketersediaan dan harga sewa venue</p>
          <div className="cta-btns">
            <a href="https://wa.me/6281234567890" className="btn-primary" target="_blank" rel="noreferrer">
              📱 WhatsApp Kami
            </a>
            <Link to="/" className="btn-outline">← Kembali ke Beranda</Link>
          </div>
        </div>
      </section>
    </div>
  );
}