import { Link } from "react-router-dom";
import "./VenueAlam.css";

export default function VenueAlam() {
  const aktivitas = [
    {
      title: "Area Sawah",
      desc: "Area persawahan alami untuk edukasi pertanian dan wisata. Belajar cara menanam padi tradisional langsung di habitatnya.",
      image: "/images/Sawah.jpeg",
      badge: "Edukasi Pertanian",
    },
    {
      title: "Kolam Edukasi",
      desc: "Kolam alami untuk pembelajaran ekosistem air. Amati berbagai jenis ikan dan fauna air.",
      image: "/images/Kolam edukasi.jpeg",
      badge: "Ekosistem Air",
    },
    {
      title: "Pancoran Air",
      desc: "Sumber air alami yang segar dan edukatif. Temukan bagaimana ekosistem air mikro berlangsung.",
      image: "/images/Pancoran Air.jpeg",
      badge: "Sumber Mata Air",
    },
    {
      title: "Taman Alam",
      desc: "Area taman hijau untuk kegiatan belajar dan rekreasi. Tempat yang sempurna untuk piknik keluarga.",
      image: "/images/alam.jpeg",
      badge: "Rekreasi & Edukasi",
    },
  ];

  return (
    <div className="venue-page">
      <section className="venue-hero">
        <div className="venue-hero-content">
          <h1>Venue Alam</h1>
          <p>
            Berbagai area alam yang dapat dinikmati dan dipelajari,
            dirancang untuk menghubungkan kembali Anda dengan alam semesta.
          </p>
        </div>
      </section>

      <section className="venue-section">
        <div className="venue-container">
          <div className="venue-grid">
            {aktivitas.map((item, i) => (
              <div className="venue-card" key={i}>
                <div className="venue-image">
                  <img src={item.image} alt={item.title} />
                  <span className="venue-badge">{item.badge}</span>
                </div>

                <div className="venue-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <Link to="#" className="venue-link">
                    Pelajari Selengkapnya →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="venue-cta">
        <h2>Ayo ke Venue Alam!</h2>
        <p>Hubungi kami untuk reservasi dan informasi lebih lanjut</p>
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noreferrer"
          className="venue-btn"
        >
          📱 WhatsApp Kami
        </a>
      </section>
    </div>
  );
}