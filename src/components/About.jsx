import { motion } from "framer-motion";
import { Leaf, Target } from 'lucide-react';
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
            src="public/images/about-edupark.jpg"
            alt="Edupark"
          />

          <div className="experience">
            <h2>15+</h2>
            <span>TAHUN PENGALAMAN</span>
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
          <span className="tag">TENTANG EDUPARK KAMI</span>

          <h2>
            Harmoni Alam untuk <br />
            Tumbuh Kembang dan <br />
            Ketenangan Jiwa.
          </h2>

          <p>
            Edupark lahir dari sebuah visi besar untuk menjawab dua tantangan nyata 
            di masyarakat kita saat ini: kebutuhan ruang terapi inklusif bagi anak-anak
            berkebutuhan khusus dan kerinduan warga urban akan ruang terbuka hijau yang edukatif.
          </p>

          <div className="features">

            <motion.div className="feature" whileHover={{ y: -6 }}>
              <div className="icon">
                <Leaf size={24} className="text-green-600" />
              </div>
              <div>
                <h4>Tersertifikasi Eko</h4>
                <p>Fasilitas dan praktik yang berkelanjutan.</p>
              </div>
            </motion.div>

            <motion.div className="feature" whileHover={{ y: -6 }}>
              <div className="icon">
                <Target size={24} className="text-blue-600" />
              </div>
              <div>
                <h4>Pembelajaran Aktif</h4>
                <p>Kurikulum praktik langsung yang menarik.</p>
              </div>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}