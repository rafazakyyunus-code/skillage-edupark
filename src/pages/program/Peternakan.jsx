import { Link } from "react-router-dom";
import "./ProgramPage.css";
import programData from "./Programdata";   // ← sesuaikan path jika perlu
import kambing from "/src/assets/images/beri makan domba.png";
import { MessageCircle, Leaf } from 'lucide-react';

// Ambil heroImage dari sumber terpusat
const { heroImage } = programData.find(p => p.key === "peternakan");

export default function Peternakan() {
  const hewan = [
    { 
      // Icon: Ulat/Larva beruas (Budidaya Maggot)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#854d0e' }}>
          <path d="M4 12a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1a2 2 0 0 1 2 2" />
          <circle cx="20" cy="12" r="0.5" fill="currentColor" />
        </svg>
      ), 
      name: "Budidaya Maggot", 
      desc: "Pelajari proses budidaya maggot BSF sebagai pakan ternak organik" 
    },
    { 
      // Icon: Domba berbulu tebal (Domba)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#6b7280' }}>
          {/* Efek bulu domba melingkar-lingkar */}
          <path d="M12 4a3 3 0 0 1 3 3 2.5 2.5 0 0 1 2 4.5 3.5 3.5 0 0 1-.5 6.5h-9a3.5 3.5 0 0 1-.5-6.5 2.5 2.5 0 0 1 2-4.5 3 3 0 0 1 3-3z" fill="rgba(243, 244, 246, 0.6)" />
          {/* Kaki domba */}
          <path d="M9 18v3M15 18v3" />
          {/* Kepala/Telinga */}
          <path d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#e5e7eb" />
          <path d="M9.5 9.5c-.5 0-1 .5-1 1M14.5 9.5c.5 0 1 .5 1 1" />
        </svg>
      ), 
      name: "Domba", 
      desc: "Mengenal jenis domba yang lucu dan cara merawatnya dengan benar" 
    },
    { 
      // Icon: Ayam Jago/Ayam Bertelur dengan Telur (Ayam Bertelur)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#ea580c' }}>
          {/* Siluet ayam */}
          <path d="M12 4c.5-1 1.5-1.5 2.5-1s1.5 1.5 1 2.5" /> {/* Jengger */}
          <path d="M8 13c0-4.4 3.6-8 8-8s6 2 6 5c0 4-3 8-7 10H9c-2 0-3-1.5-3-3.5 0-1 .5-2 1.5-2.5" /> 
          <circle cx="13" cy="7" r="1" fill="currentColor" /> {/* Mata */}
          {/* Telur di bawah ayam */}
          <path d="M6 19a2 3 0 1 0 4 0 2 3 0 1 0-4 0" fill="#fbd5a9" stroke="#b45309" strokeWidth="1.5" />
        </svg>
      ), 
      name: "Ayam Bertelur", 
      desc: "Beternak ayam organik bebas kandang dengan metode alami" 
    },
    { 
      // Icon: Ikan Kumis/Lele (Ikan Lele)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#334155' }}>
          {/* Badan ikan meliuk */}
          <path d="M22 12c-4-3-9-4-13-2-2.5 1.2-4.5 3.5-7 3.5 2.5 0 4.5 2.3 7 3.5 4 2 9 1 13-2z" fill="rgba(71, 85, 105, 0.2)" />
          {/* Sirip ekor */}
          <path d="M2 13.5v-3" />
          {/* Kumis khas lele di bagian depan/kanan kepala */}
          <path d="M18 10c.5-1.5 2-2 3-2M18 14c.5 1.5 2 2 3 2" />
        </svg>
      ), 
      name: "Ikan Lele", 
      desc: "Budidaya ikan air tawar yang menguntungkan dan mudah dipelajari" 
    },
  ];

  return (
    <div className="program-page">

      {/* ===== HERO ===== */}
      <section
        className="program-hero peternakan-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="badge">
            <Leaf size={15} />
            Program Kami
          </span>
          <h1>Peternakan</h1>
          <p>Kenali, rawat, dan pelajari hewan ternak langsung di lapangan bersama ahlinya.</p>
          <div className="hero-btns">
            <a href="#daftar" className="btn-primary">Daftar Sekarang</a>
            <a href="#hewan" className="btn-outline">Lihat Hewan</a>
          </div>
        </div>
      </section>

      {/* ===== TENTANG ===== */}
      <section className="program-about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <span className="tag">Program Peternakan</span>
              <h2>Dekat dengan Hewan, <br /><span className="green">Dekat dengan Alam</span></h2>
              <p>
                Program Peternakan Edupark memberikan pengalaman langsung berinteraksi dengan hewan ternak.
                Peserta belajar cara memberi makan, merawat, hingga memahami siklus hidup hewan ternak
                secara menyenangkan dan edukatif.
              </p>
              <div className="stats-row">
                {/* <div className="stat"><strong>300+</strong><span>Peserta</span></div> */}
                <div className="stat"><strong>3+</strong><span>Jenis Hewan</span></div>
                <div className="stat"><strong>2 Ha</strong><span>Tempat</span></div>
              </div>
            </div>
            <div className="about-visual">
              <div className="visual-card">
                <div className="visual-image">
                  <img src={kambing} alt="Peternakan Edupark" />
                </div>
                <p>Area peternakan seluas 2 hektar yang asri!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HEWAN ===== */}
      <section className="program-features" id="hewan">
        <div className="container">
          <h2 className="section-title">Hewan Ternak Kami</h2>
          <div className="features-grid">
            {hewan.map((h, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{h.icon}</div>
                <h3>{h.name}</h3>
                <p>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="program-cta" id="daftar">
        <div className="container">
          <h2>Tertarik Bergabung?</h2>
          <p>Hubungi kami untuk informasi jadwal program Peternakan Edupark</p>
          <div className="cta-btns">
            <a
              href="https://wa.me/6285219801259?text=Assalamualaikum%20saya%20ingin%20bertanya%20tentang%20Skillage%20Edupark"
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