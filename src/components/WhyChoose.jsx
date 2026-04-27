import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./WhyChoose.css";

export default function WhyChoose() {
  const navigate = useNavigate();

    const data = [
    {
      title: "Lingkungan Asri & Alami",
      path: "/why/lingkungan",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
    },
    {
      title: "Program Edukasi Terstruktur",
      path: "/why/program",
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
    },
    {
      title: "Fasilitas Ramah Anak",
      path: "/why/fasilitas",
      img: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80"
    },
    {
      title: "Instruktur Profesional",
      path: "/why/instruktur",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
    },
  ];

  return (
    <section className="why">
      <h2>Edupark</h2>
      <p className="subtitle">
        Kami menghadirkan pengalaman belajar yang berbeda dan bermakna.
      </p>

      {/* 🔥 SLIDER */}
      <div className="slider-wrapper">
        <motion.div
          className="slider-track"
          animate={{ x: ["0%", "-50%"] }}
          duration={20}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...data, ...data].map((item, index) => (
            <div
              key={index}
              className="why-card"
              onClick={() => navigate(item.path)}
            >
              <img src={item.img} alt={item.title} />

              <div className="card-content">
                <h4>{item.title}</h4>
                <p>Klik untuk lihat detail →</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}