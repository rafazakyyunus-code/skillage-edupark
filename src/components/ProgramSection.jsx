import { motion } from "framer-motion";
import "./ProgramSection.css";

export default function ProgramSection() {
  const programs = [
    {
      title: "Hydroponic",
      desc: "Exploring plant biology and structures in our living laboratory.",
      img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800&q=80"
    },
    {
      title: "Intergreatif farm",
      desc: "Studying local bird species and insect ecosystems in protected habitats.",
      img: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80"
    },
    {
      title: "Maggot",
      desc: "Hands-on organic farming skills from seeding to harvesting.",
      img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80"
    },
    {
      title: "Venue alam",
      desc: "Creative expression using natural pigments and organic materials.",
      img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
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
          Discover our diverse range of interactive programs designed to inspire environmental leadership.
        </p>
      </motion.div>

      <motion.div
        className="program-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {programs.map((itemData, index) => (
          <motion.div
            key={index}
            className="program-card"
            variants={item}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <div className="img-wrapper">
              <img src={itemData.img} alt={itemData.title} />
            </div>

            <div className="program-content">
              <h4>{itemData.title}</h4>
              <p>{itemData.desc}</p>
              <span>Learn More →</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
}