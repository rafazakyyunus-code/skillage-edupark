import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./AttractionDetail.css";
import { getAttractionById, getAllAttractions } from "./AttractionsService.JS";
import { MapPin } from 'lucide-react';

export default function AttractionDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [attraction, setAttraction] = useState(null);
  const [allData,    setAllData]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [data, all] = await Promise.all([
        getAttractionById(id),
        getAllAttractions(),
      ]);
      setAttraction(data);
      setAllData(all);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="article-detail-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#667085" }}>Loading...</p>
      </div>
    );
  }

  if (!attraction) {
    return <div className="not-found">Attraction Not Found</div>;
  }

  /* Semua attraction kecuali yang sedang ditampilkan */
  const others = allData.filter((item) => String(item.id) !== String(id));

  /* Recent: 5 terbaru (tanpa filter kategori) */
  const recentAttractions = others.slice(0, 5);

  /* Kategori unik dari seluruh data */
  const categoryList = Array.from(new Set(allData.map((a) => a.category).filter(Boolean)));

  /* Hitung jumlah per kategori (dari seluruh data, bukan hanya others) */
  const countByCategory = (cat) => allData.filter((a) => a.category === cat).length;

  /* Hasil pencarian */
  const searchResults = searchQuery.trim()
    ? allData.filter(
        (a) =>
          String(a.id) !== String(id) &&
          (a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.location?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  /* Klik kategori → navigasi ke halaman attractions dengan filter */
  const handleCategoryClick = (cat) => {
    navigate(`/attractions?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="article-detail-page">
      <div className="article-detail-container">

        {/* ===== MAIN ===== */}
        <div className="article-main-content">
          <span className="article-category">{attraction.category}</span>

          <h1>{attraction.title}</h1>

          <div className="article-meta-detail">
            <span>By Edupark Team</span>
            <span>•</span>
            <span>
              {attraction.updatedAt
                ? new Date(attraction.updatedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : attraction.createdAt
                ? new Date(attraction.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </span>
            {attraction.location && (
              <>
                <span>•</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <MapPin size={14} />
                {attraction.location}
              </span>
              </>
            )}
          </div>

          {/* Satu foto saja */}
          <img
            className="main-image"
            src={attraction.image}
            alt={attraction.title}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop";
            }}
          />

          <div className="article-rich-text-content">
            {/* Deskripsi asli dari database */}
            {attraction.desc && <p>{attraction.desc}</p>}

            {/* Full content dari admin jika ada (rich text) */}
            {attraction.fullContent && (
              <div dangerouslySetInnerHTML={{ __html: attraction.fullContent }} />
            )}
          </div>
        </div>

        {/* ===== SIDEBAR ===== */}
        <div className="article-sidebar">

          {/* SEARCH */}
          <div className="sidebar-card">
            <h3>Search</h3>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>

            {/* Hasil pencarian */}
            {searchQuery.trim() && (
              <div className="search-results" style={{ marginTop: 12 }}>
                {searchResults.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#9ca3af", padding: "8px 0" }}>
                    Tidak ada hasil untuk "{searchQuery}"
                  </p>
                ) : (
                  <div className="recent-posts-list">
                    {searchResults.slice(0, 5).map((item) => (
                      <div
                        className="recent-post clickable-post"
                        key={item.firebaseKey || item.id}
                        onClick={() => {
                          setSearchQuery("");
                          navigate(`/attractions/${item.id}`);
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=200&auto=format&fit=crop";
                          }}
                        />
                        <div className="recent-post-info">
                          <p>{item.title}</p>
                          <span>{item.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RECENT ATTRACTIONS */}
          <div className="sidebar-card">
            <h3>Recent Attractions</h3>
            {recentAttractions.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9ca3af" }}>Belum ada attraction lain.</p>
            ) : (
              <div className="recent-posts-list">
                {recentAttractions.map((item) => (
                  <div
                    className="recent-post clickable-post"
                    key={item.firebaseKey || item.id}
                    onClick={() => navigate(`/attractions/${item.id}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=200&auto=format&fit=crop";
                      }}
                    />
                    <div className="recent-post-info">
                      <p>{item.title}</p>
                      <span>{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CATEGORIES */}
          <div className="sidebar-card">
            <h3>Categories</h3>
            {categoryList.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9ca3af" }}>Belum ada kategori.</p>
            ) : (
              <ul className="sidebar-categories-list">
                {categoryList.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    style={{ cursor: "pointer" }}
                    className={activeCategory === cat ? "active-cat" : ""}
                  >
                    <span>{cat}</span>
                    <span className="cat-count">{countByCategory(cat)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CTA */}
          <div className="cta-sidebar">
            <h4>Ready to explore?</h4>
            <p>
              Join Edupark and discover unforgettable educational experiences
              today.
            </p>
            <button onClick={() => navigate("/e-tiket")}>Visit Edupark</button>
          </div>

        </div>
      </div>
    </div>
  );
}