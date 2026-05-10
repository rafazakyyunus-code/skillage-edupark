import { Link } from "react-router-dom";
import "./VenueAlam.css";
import { MessageCircle, Leaf } from 'lucide-react';

export default function VenueAlam() {
  const aktivitas = [
  {
    title: "Area Sawah",
    desc: "Area persawahan alami untuk edukasi pertanian dan wisata.",
    image: "/images/Sawah.jpeg",
    badge: "Edukasi Pertanian",

    detail: `
    Area persawahan alami yang dirancang sebagai sarana edukasi pertanian dan wisata berbasis alam.
    Pengunjung dapat belajar langsung proses menanam padi dari awal hingga panen.
    `,

    features: [
      "🌾 Belajar menanam padi",
      "👨‍🌾 Interaksi dengan petani",
      "📸 Spot foto alam",
      "🌱 Edukasi ekosistem sawah"
    ],

    info: {
      durasi: "1 - 2 Jam",
      cocok: "Pelajar & Keluarga",
      lokasi: "Area Edupark"
    }
  },
     {
    title: "Kolam Edukasi",
    desc: "Kolam alami untuk pembelajaran ekosistem air.",
    image: "/images/Kolam edukasi.jpeg",
    badge: "Ekosistem Air",

    detail: `
    Kolam edukasi ini digunakan untuk mengenalkan berbagai jenis ekosistem air.
    Pengunjung dapat mengamati ikan dan makhluk hidup lainnya secara langsung.
    `,

    features: [
      "🐟 Observasi ikan",
      "💧 Belajar ekosistem air",
      "📷 Spot edukasi",
    ],

    info: {
      durasi: "30 - 60 Menit",
      cocok: "Anak-anak & Pelajar",
      lokasi: "Zona Air"
    }
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
  <div className="hero-overlay"></div>

  <div className="venue-hero-content">
    <span className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <Leaf size={18} className="text-green-500" />
      Edupark Experience
    </span>
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
    <div 
      className="venue-card reveal"
      key={i}
      style={{ animationDelay: `${i * 0.15}s` }}
    >
                <div className="venue-image">
                  <img src={item.image} alt={item.title} />
                  <span className="venue-badge">{item.badge}</span>
                </div>

                <div className="venue-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <Link to={`/venue/${i}`} className="venue-link">
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
          className="btn-primary" 
          target="_blank" 
          rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <MessageCircle size={20} /> 
          WhatsApp Kami
        </a>
      </section>
    </div>
  );
}