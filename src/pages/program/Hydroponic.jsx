import { Link } from "react-router-dom";
import "./ProgramPage.css";
import programData from "./Programdata";   // ← sesuaikan path jika perlu
import kambing from "/src/assets/images/hidroponik.jpg";
import { MessageCircle, Leaf } from 'lucide-react';

// Ambil heroImage dari sumber terpusat
const { heroImage } = programData.find(p => p.key === "hydroponic");

export default function Hydroponic() {
  const features = [
    { 
      // Icon: Droplet (Sistem NFT)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#3b82f6' }}>
          <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
        </svg>
      ), 
      title: "Sistem NFT", 
      desc: "Nutrient Film Technique untuk sayuran hijau optimal" 
    },
    { 
      // Icon: Sprout (Kultur Air Dalam)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#22c55e' }}>
          <path d="M7 20h10" />
          <path d="M10 20V14c0-2.2 1.8-4 4-4h4" />
          <path d="M14 10c0-3.3-2.7-6-6-6H4v4c0 3.3 2.7 6 6 6z" />
        </svg>
      ), 
      title: "Kultur Air Dalam", 
      desc: "Akar terendam langsung dalam larutan nutrisi" 
    },
    { 
      // Icon: Layers (Pertanian Vertikal)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#059669' }}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ), 
      title: "Pertanian Vertikal", 
      desc: "Maksimalkan ruang dengan sistem tanam vertikal" 
    },
    { 
      // Icon: Activity/Pulse (Monitoring Nutrisi)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#a855f7' }}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ), 
      title: "Monitoring Nutrisi", 
      desc: "Pantau pH dan EC larutan secara real-time" 
    },
  ];

  const plants = [
    { 
      name: "Selada", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: '#22c55e', marginRight: '6px' }}>
          {/* Lapisan daun selada yang keriting bertumpuk */}
          <path d="M12 21a6 6 0 0 0 6-6c0-2-1.5-3-2.5-4 .5-1.5 0-3.5-1.5-4.5A4.5 4.5 0 0 0 9.5 6.5C8.5 5.5 6.5 5 5.5 6.5c-1 1.5-1 3.5.5 4.5-1 1-2.5 2-2.5 4a6 6 0 0 0 6 6z" />
          <path d="M8 13.5c1.5-1 3.5-1 5 0M6.5 17c2-1.5 4.5-1.5 6.5 0" />
        </svg>
      ) 
    },
    { 
      name: "Kangkung", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: '#10b981', marginRight: '6px' }}>
          {/* Karakteristik daun kangkung yang runcing menjari panjang */}
          <path d="M12 22V13M12 13c-1.5-2.5-4-4.5-5-7.5C8 6.5 10.5 8 12 11c1.5-3 4-4.5 5-5.5-1 3-3.5 5-5 7.5z" />
          <path d="M12 16c-1-1.5-2.5-2.5-3.5-4.5.5.5 2 1.5 3.5 2c1.5-.5 3-1.5 3.5-2-1 2-2.5 3-3.5 4.5z" />
        </svg>
      ) 
    },
    { 
      name: "Bayam", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: '#16a34a', marginRight: '6px' }}>
          {/* Daun bayam bulat melebar/oval dengan urat daun jelas */}
          <path d="M12 22V11m0 0c-3-1-5-3.5-5-6.5a4 4 0 0 1 8 0c0 3-2 5.5-5 6.5z" />
          <path d="M12 16c-2-.5-3.5-2-4-3.5.5 0 2.5.5 4 1.5c1.5-1 3.5-1.5 4-1.5-.5 1.5-2 3-4 3.5z" />
          <path d="M9 7.5c1.5 1 3.5 1 5 0" />
        </svg>
      ) 
    },
    { 
      name: "Kacang Panjang", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: '#15803d', marginRight: '6px' }}>
          {/* Siluet meliuk panjang tipis seperti kacang panjang */}
          <path d="M16 3c-1 2-2 5-1 8s3 6 2 10M11 4c-1.5 3-1 7 .5 10.5S14 19 13 22" />
          <path d="M15 3.5a2.5 2.5 0 0 0-3.5.5" />
        </svg>
      ) 
    },
    { 
      name: "Pakcoy", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: '#65a30d', marginRight: '6px' }}>
          {/* Bentuk sendok khas pakcoy: gendut di bawah, melebar di atas */}
          <path d="M12 22c3.5 0 5-2.5 4.5-6.5C16 11 14.5 5 12 2 9.5 5 8 11 7.5 15.5c-.5 4 1 6.5 4.5 6.5z" />
          <path d="M9.5 16c1 2 1.5 3.5 2.5 3.5s1.5-1.5 2.5-3.5" />
          <path d="M12 22V13" />
        </svg>
      ) 
    },
    { 
      name: "Cabai Rawit", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: '#ef4444', marginRight: '6px' }}>
          {/* Cabai melengkung lancip dengan tangkai kecil di atas */}
          <path d="M14.5 3.5c-.5.5-1 1.5-.5 2.5C11 8 8 12 7 16c-.8 3.2.2 4.8 2 5 2.3.3 4.5-2 6-5.5 1.5-3.5 2.5-7.5 1.5-10.5-.3-.7-1.3-1.2-2-1.5z" />
          <path d="M14.5 5.5c-.5-1-1.5-2-2.5-2.5" />
        </svg>
      ) 
    },
    { 
      name: "Terong", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: '#9333ea', marginRight: '6px' }}>
          {/* Bentuk terong lonjong besar dengan mahkota/kelopak daun di kepala */}
          <path d="M8 9.5c0 4.5 1.5 9.5 4 11.5s4-2.5 4-11.5c0-2.5-.5-4-4-4s-4 1.5-4 4.5z" />
          <path d="M10 5.5c.5-1.5 1-2.5 2-2.5s1.5 1 2 2.5M9 7.5c1 .5 2-1 3-1s2 1.5 3 1" />
        </svg>
      ) 
    },
    { 
      name: "Toge", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: '#eab308', marginRight: '6px' }}>
          {/* Kepala kecambah bulat kecil dengan ekor meliuk tipis ke bawah */}
          <path d="M11 6c.5-2 2.5-3 3.5-1.5S13 7.5 11 8.5C9.5 9.5 8 11.5 8 14.5c0 4 2.5 5.5 2.5 5.5" />
          <circle cx="13" cy="5" r="1.5" fill="currentColor" stroke="none" />
          <path d="M7.5 12.5c1 .5 2 0 2-1" />
        </svg>
      ) 
    },
  ];

  return (
    <div className="program-page">

      {/* ===== HERO ===== */}
      <section
        className="program-hero hydroponic-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="badge">
            <Leaf size={15} />
            Program Kami
          </span>
          <h1>Hydroponic</h1>
          <p>Belajar bercocok tanam modern tanpa tanah. Teknologi masa depan, hasil nyata.</p>
          <div className="hero-btns">
            <a
              href="https://wa.me/6285219801259?text=Halo%20Admin%20Skillage%20Edupark%2C%20saya%20ingin%20mendaftar%20sekarang%20untuk%20program%20yang%20tersedia.%20Bagaimana%20alur%20pendaftaran%20dan%20persyaratan%20yang%20harus%20saya%20siapkan%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Daftar Sekarang
            </a>
            <a href="#tentang" className="btn-outline">Pelajari Lebih Lanjut</a>
          </div>
        </div>
      </section>

      {/* ===== TENTANG ===== */}
      <section className="program-about" id="tentang">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <span className="tag">Apa itu Hidroponik?</span>
              <h2>Pertanian Modern <br /><span className="green">Tanpa Batas Lahan</span></h2>
              <p>
                Hidroponik adalah metode pertanian modern tanpa menggunakan tanah sebagai media tanam.
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
              <div className="plant-chip" key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
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
          <p>Hubungi kami untuk informasi jadwal dan harga program Hidroponik</p>
          <div className="cta-btns">
            <a
              href="https://wa.me/6285219801259?text=Assalamualaikum%20Admin%20Skillage%20Edupark%2C%20saya%20tertarik%20bergabung%20dengan%20program%20Hidroponik.%20Boleh%20minta%20informasi%20lengkap%20mengenai%20jadwal%20pelaksanaan%20dan%20harganya%3F"
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