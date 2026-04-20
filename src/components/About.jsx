import { motion } from "framer-motion";
import "./About.css";

export default function About() {
  return (
    <section className="about">
      <motion.div
        className="about-image"
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <img
          src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238"
          alt="Edupark"
        />
        <div className="experience">
          <h2>15+</h2>
          <p>Years of Excellence</p>
        </div>
      </motion.div>

      <motion.div
        className="about-content"
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <span className="tag">ABOUT OUR EDUPARK</span>
        <h2>
          Harmoni Alam untuk Tumbuh Kembang dan Ketenangan Jiwa.
        </h2>
        <p>
          Edupark hadir sebagai ruang edukatif dan terapi alam yang inklusif.
        </p>

        <div className="features">
          <motion.div whileHover={{ y: -10 }}>
            <h4>Eco-Certified</h4>
            <p>Sustainable facilities and practices.</p>
          </motion.div>

          <motion.div whileHover={{ y: -10 }}>
            <h4>Active Learning</h4>
            <p>Engaging hands-on curriculum.</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}