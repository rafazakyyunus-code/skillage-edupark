import { Link } from "react-router-dom";
import "./ProgramPage.css";
import heroImage from "/src/assets/images/pertenakan domba.jpeg";
import kambing from "/src/assets/images/kambing.jpg";
import { MessageCircle, Leaf } from 'lucide-react';
export default function Peternakan() {
  const hewan = [
    { icon: "🪱", name: "Budidaya Maggot", desc: "Pelajari proses pemerahan susu segar" },
    { icon: "🐑", name: "Domba", desc: "Mengenal jenis Domba yang lucu  dan cara merawatnya" },
    { icon: "🐓", name: "Ayam Bertelur", desc: "Beternak ayam organik bebas kandang" },
    { icon: "𓆟", name: "Ikan Lele", desc: "Budidaya ikan air tawar yang menguntungkan" },
  ];

  return (
    <div className="program-page">
       <section
        className="program-hero peternakan-hero"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Leaf size={16} />
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
                <div className="stat"><strong>300+</strong><span>Peserta</span></div>
                <div className="stat"><strong>4+</strong><span>Jenis Hewan</span></div>
                <div className="stat"><strong>2 Ha</strong><span>Lahan</span></div>
              </div>
            </div>
            <div className="about-visual">
              <div className="visual-card">
                <div className="visual-image">
                  <img src={kambing} alt="Kambing" />
              </div>
                <p>Area peternakan seluas 2 hektar yang asri!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section className="program-cta" id="daftar">
        <div className="container">
          <h2>Tertarik Bergabung?</h2>
          <p>Hubungi kami untuk informasi jadwal program Peternakan Edupark</p>
          <div className="cta-btns">
          <a 
            href="https://wa.me/6281234567890" 
            className="btn-primary" 
            target="_blank" 
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
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