import "./CTA.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeAttractions } from "../pages/Etiket/AttractionsService.js";

export default function CTA() {
  const sectionRef = useRef();
  const navigate = useNavigate();

  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Ambil data real-time dari Firebase */
  useEffect(() => {
    const unsubscribe = subscribeAttractions((data) => {
      setAttractions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* Intersection Observer untuk animasi masuk */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("show");
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* 3 attraction terbaru berdasarkan createdAt */
  const latestAttractions = [...attractions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <section className="artikel" ref={sectionRef}>
      <h2>Attraction Terbaru</h2>
      <p className="subtitle">
        Jelajahi pengalaman edukatif terbaru yang siap menanti kamu di Edupark Skillage.
      </p>

      {loading ? (
        <div className="cta-loading">
          <div className="cta-spinner" />
          <p>Memuat attraction...</p>
        </div>
      ) : latestAttractions.length === 0 ? (
        <p className="cta-empty">Belum ada attraction yang tersedia.</p>
      ) : (
        <>
          <div className="artikel-container">
            {latestAttractions.map((item) => (
              <div className="card" key={item.firebaseKey || item.id}>
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={item.title || item.name}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop";
                  }}
                />

                <div className="card-content">
                  <div className="meta">
                    <span>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                    {item.category && <span> • {item.category}</span>}
                  </div>

                  <h3>{item.title || item.name}</h3>
                  <p>{item.desc}</p>

                  <button
                    className="read-btn"
                    onClick={() => navigate(`/attractions/${item.id}`)}
                  >
                    Explore More ↗
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol lihat semua */}
          <div className="cta-see-all">
            <button className="see-all-btn" onClick={() => navigate("/attractions")}>
              Lihat Semua Attraction →
            </button>
          </div>
        </>
      )}
    </section>
  );
}