import { motion } from "framer-motion";
import "./ProductSection.css";


const products = [
  {
    title: "Pupuk Bokashi",
    img: "https://picsum.photos/300?random=1",
    desc: "Exploring plant biology and cultural practices in our living laboratory.",
  },
  {
    title: "Terong Ungu",
    img: "https://picsum.photos/300?random=2",
    desc: "Studying local crop species and insect ecosystems in protected habitats.",
  },
  {
    title: "Toge",
    img: "https://picsum.photos/300?random=3",
    desc: "Hands-on organic farming skills from seed germination to harvesting.",
  },
  {
    title: "Cabe-Cabean",
    img: "https://picsum.photos/300?random=4",
    desc: "Creative expression using natural pigments and organic materials.",
  },
];

export default function ProductSection() {
  return (
    <section className="product-section">
      <div className="container">

        {/* HEADER */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Produk Edupark</h2>
          <div className="underline"></div>
          <p>
            Temukan beragam program interaktif kami yang dirancang untuk
            menginspirasi kepemimpinan lingkungan.
          </p>
        </motion.div>

        {/* GRID */}
        <div className="card-grid">
          {products.map((item, index) => (
            <motion.div
              key={item.title}
              className="card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <img
                src={item.img}
                alt={item.title}
                onError={(e) => {
                  console.log("Image error:", item.img);
                  e.target.src = "https://via.placeholder.com/300";
                }}
              />

              <div className="card-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <button className="card-btn">Learn More</button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="center-btn">
          <button className="primary-btn">Selengkapnya</button>
        </div>

      </div>
    </section>
  );
}