import { Link } from "react-router-dom";
import "./ProgramPage.css";
import heroImage from "/src/assets/images/hydroponicc.jpeg";
import kambing from "/src/assets/images/hidroponik.jpg";
import { MessageCircle, Leaf } from 'lucide-react';

export default function Hydroponic() {
  const features = [
    { icon: "💧", title: "Sistem NFT", desc: "Nutrient Film Technique untuk sayuran hijau optimal" },
    { icon: "🌱", title: "Deep Water Culture", desc: "Akar terendam langsung dalam larutan nutrisi" },
    { icon: "🏗️", title: "Vertical Farming", desc: "Maksimalkan ruang dengan sistem tanam vertikal" },
    { icon: "🔬", title: "Monitoring Nutrisi", desc: "Pantau pH dan EC larutan secara real-time" },
  ];

  const plants = [
    { name: "Selada", icon: "🥬" },
    { name: "Kangkung", icon: "🌿" },
    { name: "Bayam", icon: "🍃" },
    { name: "Kacang Panjang", icon: "🫘" },
    { name: "Pakcoy", icon: "🥗" },
    { name: "Cabe Rawit", icon: "🌶️" },
    { name: "Terong", icon: "🍆" },
    { name: "Toge", icon: "🌱" },
  ];

  return (
    <div className="program-page">

      {/* ===== HERO ===== */}
      <section
        className="program-hero hydroponic-hero"
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
          <h1>Hydroponic</h1>
          <p>Belajar bercocok tanam modern tanpa tanah. Teknologi masa depan, hasil nyata.</p>
          <div className="hero-btns">
            <a href="#daftar" className="btn-primary">Daftar Sekarang</a>
            <a href="#tentang" className="btn-outline">Pelajari Lebih</a>
          </div>
        </div>
      </section>

      {/* ===== TENTANG ===== */}
      <section className="program-about" id="tentang">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <span className="tag">Apa itu Hydroponic?</span>
              <h2>Pertanian Modern <br /><span className="green">Tanpa Batas Lahan</span></h2>
              <p>
                Hydroponics adalah metode pertanian modern tanpa menggunakan tanah sebagai media tanam.
                Sebaliknya, tanaman tumbuh dalam larutan air yang kaya akan nutrisi penting yang langsung
                diserap oleh akar.
              </p>
              <p>
                Di Edupark, kami menerapkan berbagai sistem hidroponik canggih untuk menghasilkan tanaman
                yang lebih sehat, bersih, dan bebas pestisida, sekaligus memberikan pengalaman belajar
                yang interaktif bagi pengunjung.
              </p>
              <div className="stats-row">
                <div className="stat"><strong>500+</strong><span>Peserta</span></div>
                <div className="stat"><strong>12</strong><span>Jenis Tanaman</span></div>
                <div className="stat"><strong>3</strong><span>Sistem NFT</span></div>
              </div>
            </div>
            <div className="about-visual">
              <div className="visual-card">
                <div className="visual-image">
                  <img src={kambing} alt="Hidroponik Edupark" />
                </div>
                <p>Skillage Edupark siap menyambutmu loh!!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FITUR ===== */}
      <section className="program-features">
        <div className="container">
          <h2 className="section-title">Sistem yang Kami Ajarkan</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TANAMAN ===== */}
      <section className="program-plants">
        <div className="container">
          <h2 className="section-title">Tanaman yang Ditanam</h2>
        </div>
        <div className="plants-wrapper">
          <div className="plants-track">
            {[...plants, ...plants].map((plant, i) => (
              <div className="plant-chip" key={i}>
                {plant.icon} {plant.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="program-cta" id="daftar">
        <div className="container">
          <h2>Tertarik Bergabung?</h2>
          <p>Hubungi kami untuk informasi jadwal dan harga program Hydroponic</p>
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