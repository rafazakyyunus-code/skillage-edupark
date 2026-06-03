import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import programData from "../pages/program/Programdata";   // ← sesuaikan path jika perlu
import "./ProgramSection.css";

export default function ProgramSection() {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="program">
      <motion.div
        className="program-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2>Program Kami</h2>
        <p>
          Temukan beragam program interaktif kami yang dirancang untuk menginspirasi
          kepemimpinan di bidang lingkungan.
        </p>
      </motion.div>

      <motion.div
        className="program-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {programData.map((itemData, index) => (
          <motion.div
            key={itemData.key}
            className="program-card"
            variants={item}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => navigate(itemData.path)}
          >
            <div className="img-wrapper">
              <img src={itemData.heroImage} alt={itemData.title} />
            </div>
            <div className="program-content">
              <h4>{itemData.title}</h4>
              <p>{itemData.desc}</p>
              <span>Pelajari Lebih →</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}