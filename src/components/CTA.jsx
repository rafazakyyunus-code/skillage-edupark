  import "./CTA.css";
  import { useEffect, useRef } from "react";

  const articles = [
    {
      title: "Integrated Farm",
      date: "June 12, 2024",
      author: "Dr. Elena Vance",
      desc: "Perkembangan sektor pertanian tidak hanya berfokus pada produksi, tetapi juga edukasi dan pariwisata.",
      img: "https://images.unsplash.com/photo-1500595046743-cd271d694d30"
    },
    {
      title: "Budidaya Maggot",
      date: "May 28, 2024",
      author: "Prof. Marcus Thorne",
      desc: "Maggot adalah larva dari lalat Black Soldier Fly (BSF) yang bernilai tinggi untuk pakan ternak.",
      img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=60"
    },
    {
      title: "Hydroponic",
      date: "May 15, 2024",
      author: "Sarah Jenkins",
      desc: "Hidroponik adalah metode budidaya tanaman tanpa tanah menggunakan nutrisi dalam air.",
      img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4"
    }
  ];

  export default function CTA() {
    const sectionRef = useRef();

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            sectionRef.current.classList.add("show");
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(sectionRef.current);
    }, []);

    return (
      <section className="artikel" ref={sectionRef}>
        <h2>Artikel</h2>
        <p className="subtitle">
          Ikuti terus riset kami, kisah sukses, dan inisiatif lingkungan yang akan datang.
        </p>

        <div className="artikel-container">
          {articles.map((item, index) => (
            <div className="card" key={index}>
              <img src={item.img} alt={item.title} />

              <div className="card-content">
                <div className="meta">
                  <span>{item.date}</span>
                  <span> • {item.author}</span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.desc}</p>

                <button className="read-btn">Read More ↗</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }