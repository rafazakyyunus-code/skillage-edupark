import { Link } from "react-router-dom";
import "./ProgramPage.css";
import programData from "./Programdata";   // ← sesuaikan path jika perlu
import workshop from "/src/assets/images/rawat tanaman.png";
import { MessageCircle, Leaf } from 'lucide-react';

// Ambil heroImage dari sumber terpusat
const { heroImage } = programData.find(p => p.key === "venue-workshop");

export default function VenueWorkshop() {
  const facilities = [
    { 
      // Icon: Pot & Tumbuhan Baru (Belajar Menanam)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#16a34a' }}>
          <path d="M12 10V2M12 2L9 5M12 2l3 3" /> {/* Tunas tumbuh */}
          <path d="M6 10h12l-1 11H7Z" /> {/* Pot tanaman */}
        </svg>
      ), 
      title: "Belajar Menanam", 
      desc: "Belajar menanam tumbuhan dengan cara yang benar dan menyenangkan" 
    },
    { 
      // Icon: Ulat/Maggot (Budidaya Maggot)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#854d0e' }}>
          {/* Struktur meliuk beruas khas larva/maggot */}
          <path d="M4 12a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1a2 2 0 0 1 2 2" />
          <circle cx="20" cy="12" r="0.5" fill="currentColor" />
        </svg>
      ), 
      title: "Budidaya Maggot", 
      desc: "Belajar proses budidaya maggot BSF untuk pakan ternak organik" 
    },
    { 
      // Icon: Ayam / Kepala Hewan Ternak (Memberi Makan Hewan)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#ea580c' }}>
          {/* Siluet ayam sederhana: Jengger, paruh, dan kepala */}
          <path d="M12 4c.5-1 1.5-1.5 2.5-1s1.5 1.5 1 2.5" /> {/* Jengger */}
          <path d="M8 12c0-4.4 3.6-8 8-8s6 2 6 5c0 4-3 8-7 10H9c-2 0-3-1.5-3-3.5 0-1 .5-2 1.5-2.5" /> 
          <path d="M22 9l-3 1.5L16.5 9" fill="#f97316" stroke="none" /> {/* Paruh */}
          <circle cx="13" cy="7" r="1" fill="currentColor" /> {/* Mata */}
        </svg>
      ), 
      title: "Memberi Makan Hewan", 
      desc: "Praktek memberikan makan hewan ternak dengan cara yang benar" 
    },
    { 
      // Icon: Kompas Petualang (Jelajah Alam)
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', color: '#0284c7' }}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="rgba(2, 132, 199, 0.2)" />
        </svg>
      ), 
      title: "Jelajah Alam", 
      desc: "Belajar hal-hal menarik yang ada di alam Edupark Skillage" 
    },
  ];

  return (
    <div className="program-page">

      {/* ===== HERO ===== */}
      <section
        className="program-hero workshop-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="badge">
            <Leaf size={15} />
            Program Kami
          </span>
          <h1>Venue Workshop</h1>
          <p>Ruang ideal untuk pelatihan, seminar, dan kegiatan edukatif bersama alam.</p>
          <div className="hero-btns">
            <a
              href="https://wa.me/6285219801259?text=Halo%20Admin%20Skillage%20Edupark%2C%20saya%20tertarik%20untuk%20memesan%20Venue%20Workshop%20untuk%20mengadakan%20acara%20pelatihan%2Fseminar.%20Boleh%20tahu%20informasi%20mengenai%20prosedur%20pemesanan%20dan%20ketersediaan%20jadwalnya%3F"
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pesan Sekarang
            </a>
            <a href="#fasilitas" className="btn-outline">Lihat Fasilitas</a>
          </div>
        </div>
      </section>

      {/* ===== TENTANG ===== */}
      <section className="program-about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <span className="tag">Tentang Tempat</span>
              <h2>Belajar Lebih Bermakna <br /><span className="green">Di Alam Terbuka</span></h2>
              <p>
                Melalui lokakarya ini, peserta dapat belajar tentang cara merawat tanaman, mengenal siklus
                pertumbuhan, hingga memahami kehidupan hewan ternak secara nyata. Suasana alam yang asri
                membuat proses belajar menjadi lebih santai, seru, dan mudah dipahami.
              </p>
              <div className="stats-row">
                <div className="stat"><strong>200+</strong><span>Kapasitas</span></div>
                <div className="stat"><strong>50+</strong><span>Acara/Tahun</span></div>
                <div className="stat"><strong>4</strong><span>Ruangan</span></div>
              </div>
            </div>
            <div className="about-visual">
              <div className="visual-card">
                <div className="visual-image">
                  <img src={workshop} alt="Tempat Lokakarya Edupark" />
                </div>
                <p>Lokasi nyaman dan profesional menanti Anda!</p>
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
            {facilities.map((f, i) => (
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
          <h2>Siap Memesan Tempat?</h2>
          <p>Hubungi kami untuk informasi ketersediaan dan harga sewa lokasi</p>
          <div className="cta-btns">
            <a
              href="https://wa.me/6285219801259?text=Assalamualaikum%20Admin%20Skillage%20Edupark%2C%20saya%20ingin%20bertanya%20mengenai%20ketersediaan%20jadwal%20dan%20harga%20sewa%20lokasi%20untuk%20Venue%20Workshop.%20Terima%20kasih."
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