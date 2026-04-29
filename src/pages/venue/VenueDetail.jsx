import { useParams, Link } from "react-router-dom";
import "./VenueDetail.css";

const aktivitas = [
  {
    title: "Area Sawah",
    desc: "Area persawahan alami...",
    image: "/images/Sawah.jpeg",
    badge: "Edukasi Pertanian",
  },
  {
    title: "Kolam Edukasi",
    desc: "Kolam alami...",
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

export default function VenueDetail() {
  const { id } = useParams();
  const data = aktivitas[id];

  return (
    <>
      <div className="venue-detail-hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="badge">{data.badge}</span>
          <h1>{data.title}</h1>
          <p>{data.desc}</p>
        </div>
      </div>

      <div className="venue-detail-section">
        <div className="container detail-grid">
          <div className="detail-image">
            <img src={data.image} alt={data.title} />
          </div>

          <div className="detail-text">
            <h2>Tentang {data.title}</h2>
            <p>{data.desc}</p>

            <p>
              Edupark menghadirkan pengalaman belajar langsung di alam
              dengan konsep interaktif dan menyenangkan.
            </p>

            <Link to="/program/venue-alam" className="back-btn">
              ← Kembali
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}