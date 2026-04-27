import { motion } from "framer-motion";
import "./About.css";

export default function About() {
  return (
    <section className="about">
      <div className="about-container">

        {/* IMAGE */}
        <motion.div
          className="about-image"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=900&q=80"
            alt="Edupark"
          />

          <div className="experience">
            <h2>15+</h2>
            <span>YEARS OF EXCELLENCE</span>
          </div>
        </motion.div>

        {/* CONTENT */}
        <motion.div
          className="about-content"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="tag">ABOUT OUR EDUPARK</span>

          <h2>
            Harmoni Alam untuk <br />
            Tumbuh Kembang dan <br />
            Ketenangan Jiwa.
          </h2>

          <p>
            Edupark lahir dari sebuah visi besar untuk menghadirkan ruang belajar
            berbasis alam yang inklusif, menyenangkan, dan penuh makna.
          </p>

          <div className="features">

            <motion.div className="feature" whileHover={{ y: -6 }}>
              <div className="icon">🌿</div>
              <div>
                <h4>Eco-Certified</h4>
                <p>Sustainable facilities and practices.</p>
              </div>
            </motion.div>

            <motion.div className="feature" whileHover={{ y: -6 }}>
              <div className="icon">🎯</div>
              <div>
                <h4>Active Learning</h4>
                <p>Engaging hands-on curriculum.</p>
              </div>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}