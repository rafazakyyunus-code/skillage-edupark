import { motion } from "framer-motion";
import "./WhyChoose.css";


export default function WhyChoose() {
  return (
    <section className="why">
      <motion.div
        className="why-header"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Mengapa Memilih Edupark?</h2>
        <p>Kami menghadirkan pengalaman belajar yang berbeda dan bermakna.</p>
      </motion.div>

      <div className="why-cards">
        {[
          "Lingkungan Asri & Alami",
          "Program Edukasi Terstruktur",
          "Fasilitas Ramah Anak",
          "Instruktur Profesional"
        ].map((item, index) => (
          <motion.div
            key={index}
            className="why-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
          >
            <h4>{item}</h4>
            <p>
              Edupark menyediakan fasilitas terbaik untuk mendukung pembelajaran berbasis alam.
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}