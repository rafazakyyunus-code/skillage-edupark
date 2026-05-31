import "./Attractions.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaMapMarkerAlt, FaLeaf } from "react-icons/fa";
import { subscribeAttractions } from "./AttractionsService.JS";

export default function Attractions() {
  const navigate = useNavigate();

  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage]               = useState(1);

  /*
   * 8 item per halaman  → 2 baris × 4 kolom (desktop)
   *                      → 4 baris × 2 kolom (tablet)
   * Tidak ada lagi card "yatim" di baris terakhir halaman 1
   */
  const itemsPerPage = 8;

  useEffect(() => {
    const unsubscribe = subscribeAttractions((data) => {
      setAttractions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* Kategori dinamis dari data yang ada di Firebase */
  const categories = [
    "All",
    ...Array.from(new Set(attractions.map((a) => a.category).filter(Boolean))),
  ];

  const filteredData =
    activeFilter === "All"
      ? attractions
      : attractions.filter((item) => item.category === activeFilter);

  const totalPages   = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex   = (page - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="attractions-page" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
        <div style={{ textAlign:"center", color:"#667085" }}>
          <div className="at-spinner" />
          <p style={{ marginTop:16, fontSize:15 }}>Loading attractions...</p>
        </div>
      </div>
    );
  }

  /* ── EMPTY ── */
  if (!loading && attractions.length === 0) {
    return (
      <div className="attractions-page" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
        <div style={{ textAlign:"center", color:"#667085" }}>
          <FaLeaf style={{ fontSize:48, color:"#22c55e", marginBottom:16 }} />
          <p style={{ fontSize:18, fontWeight:700, color:"#08112b" }}>Belum ada attraction</p>
          <p style={{ marginTop:8 }}>Silakan tambahkan data melalui halaman Admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attractions-page">

      {/* HERO */}
      <section className="at-hero">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400&auto=format&fit=crop"
          alt=""
        />
        <div className="at-overlay" />
        <div className="at-hero-content">
          <span className="at-badge">ADVENTURE AWAITS</span>
          <h1>
            Discover the Wonder of
            <br />
            Learning
          </h1>
          <p>
            Explore interactive workshops, hidden nature trails, and majestic
            wildlife at Edupark Skillage.
          </p>
          <div className="at-buttons">
            <button className="at-primary">Start Exploring</button>
            <button className="at-secondary">View Map</button>
          </div>
        </div>
      </section>

      {/* HEADER + FILTER */}
      <div className="at-header">
        <div>
          <h2>Explore Our Attractions</h2>
          <p>Curated educational experiences for all ages.</p>
        </div>

        <div className="at-filters">
          {categories.map((label) => (
            <button
              key={label}
              className={activeFilter === label ? "active" : ""}
              onClick={() => handleFilter(label)}
            >
              {label === "All" && <FaGlobe />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="at-grid">
        {currentItems.map((item) => (
          <div className="at-card" key={item.firebaseKey || item.id}>
            <div className="at-image">
              <img
                src={
                  item.image ||
                  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop"
                }
                alt={item.title || item.name}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop";
                }}
              />
              <span className="at-tag">{item.category}</span>
            </div>

            <div className="at-content">
              {/* Judul — CSS min-height menjaga kesejarajan */}
              <h3>{item.title || item.name}</h3>

              {/* Deskripsi — CSS line-clamp yang memotong, bukan JS */}
              <p>{item.desc}</p>

              <div className="at-footer">
                <span className="at-location">
                  <FaMapMarkerAlt />
                  {item.location}
                </span>
                <button onClick={() => navigate(`/attractions/${item.id}`)}>
                  Explore More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION — hanya muncul kalau lebih dari 1 halaman */}
      {totalPages > 1 && (
        <div className="at-pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ‹
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active-page" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}