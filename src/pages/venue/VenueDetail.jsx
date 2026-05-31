import { useParams, Link } from "react-router-dom";
import "./VenueDetail.css";

const aktivitas = [
  {
  title: "Area Sawah",
  desc: "Area persawahan alami...",
  image: "/images/Sawah.jpeg",
  badge: "Edukasi Pertanian",

  detail: "Area persawahan alami yang dirancang sebagai sarana edukasi pertanian dan wisata berbasis alam. Pengunjung dapat belajar langsung proses menanam padi dari awal hingga panen.",

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
    desc: "Kolam alami...",
    image: "/images/Kolam edukasi.jpeg",
    badge: "Ekosistem Air",

    detail:
      "Kolam edukasi ini digunakan untuk mengenalkan berbagai jenis ekosistem air. Pengunjung dapat mengamati ikan dan makhluk hidup lainnya secara langsung.",

    features: [
      "🐟 Observasi berbagai jenis ikan",
      "💧 Belajar ekosistem air",
      "📚 Edukasi interaktif untuk pelajar",
      "📸 Spot foto edukatif",
    ],

    info: {
      durasi: "30 - 60 Menit",
      cocok: "Anak-anak & Pelajar",
      lokasi: "Zona Air Edupark",
    },
  },
  
  {
    title: "Pancoran Air",
    desc: "Sumber air alami...",
    image: "/images/mata-air-edupark2.jpg",
    badge: "Sumber Mata Air",

    detail:
      "Pancoran air merupakan sumber air alami yang jernih dan menyegarkan. Tempat ini juga menjadi sarana edukasi tentang siklus air dan ekosistem mikro.",

    features: [
      "💦 Melihat sumber air alami",
      "🌿 Edukasi siklus air",
      "🧪 Observasi ekosistem mikro",
      "📸 Spot alami yang aesthetic",
    ],

    info: {
      durasi: "30 - 45 Menit",
      cocok: "Semua usia",
      lokasi: "Area Sumber Air",
    },
  },

  {
    title: "Taman Alam",
    desc: "Area taman hijau...",
    image: "/images/alam.jpeg",
    badge: "Rekreasi & Edukasi",

    detail:
      "Taman alam menyediakan ruang terbuka hijau untuk kegiatan belajar dan rekreasi. Cocok untuk bersantai, piknik, dan aktivitas keluarga.",

    features: [
      "🌳 Area piknik keluarga",
      "🎒 Kegiatan outdoor",
      "📸 Spot foto alam",
      "🌼 Edukasi tanaman",
    ],

    info: {
      durasi: "Bebas",
      cocok: "Keluarga & Umum",
      lokasi: "Area Taman Edupark",
    },
  },
];

export default function VenueDetail() {
  const { id } = useParams();
  const data = aktivitas[id];

return (
  <div className="venue-detail-page">
    
    <section className="detail-wrapper">
      
      {/* LEFT TEXT */}
      <div className="detail-text">
        <span className="detail-tag">TENTANG KAMI</span>

        <h1>
          {data.title} di Edupark
        </h1>

        <p className="detail-desc">
          {data.desc}
        </p>

        <p className="detail-desc highlight">
          Edupark menghadirkan pengalaman belajar langsung di alam dengan konsep interaktif dan menyenangkan. 
          Setiap pengunjung dapat merasakan suasana alami sekaligus mendapatkan wawasan baru tentang lingkungan.
        </p>

        <Link to="/program/venue-alam" className="back-btn">
          ← Kembali
        </Link>
      </div>

      {/* RIGHT IMAGE */}
      <div className="detail-image">
        <img src={data.image} alt={data.title} />
      </div>

    </section>

  </div>
);
}