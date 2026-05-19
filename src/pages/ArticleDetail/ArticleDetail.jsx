import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ArticleDetail.css";

export default function ArticleDetail({ articles = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Cari artikel berdasarkan ID dinamis (string/angka) dari Firebase
  const article = articles.find((item) => String(item.id) === String(id));

  // Ambil SEMUA rekomendasi artikel bertipe 'published' yang lain untuk sidebar (scrollable)
  const otherRecentPosts = articles
    .filter((item) => String(item.id) !== String(id) && item.status === "published");

  // Hitung kategori unik beserta jumlah artikelnya untuk sidebar
  const categoryMap = {};
  articles
    .filter((a) => a.status === "published")
    .forEach((a) => {
      if (a.category) categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
    });

  // Handler search — navigate ke halaman artikel dengan query
  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/article?search=${encodeURIComponent(trimmed)}`);
    }
  };

  // Tampilan fallback jika artikel tidak ditemukan atau sedang loading dari Firebase
  if (!article) {
    return (
      <div style={{ padding: "120px 5%", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#111827", marginBottom: "8px" }}>Artikel Tidak Ditemukan</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
          Artikel yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <button
          onClick={() => navigate("/article")}
          style={{
            padding: "10px 20px",
            background: "#1b3a2a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          ← Kembali ke Daftar Artikel
        </button>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <div className="article-detail-container">

        {/* MAIN CONTENT */}
        <div className="article-main-content">
          <span className="article-category">{article.category || "General"}</span>
          <h1>{article.title}</h1>

          <div className="article-meta-detail">
            <span>By {article.author || "Admin Edupark"}</span>
            <span>•</span>
            <span>{article.date || "Terbaru"}</span>
          </div>

          <img
            className="main-image"
            src={article.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800"}
            alt={article.title}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800";
            }}
          />

          {/* Menampilkan konten teks HTML editor Tiptap/Firebase secara aman */}
          <div
            className="article-rich-text-content"
            style={{ fontSize: "16px", lineHeight: "1.8", color: "#374151" }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* SHARE SECTION */}
          <div className="share-section">
            <span className="share-label">Share This Article:</span>
            <div className="share-icons">
              <button
                className="share-icon-btn"
                aria-label="Share on Facebook"
                onClick={() =>
                  window.open(
                    `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                    "_blank"
                  )
                }
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </button>
              <button
                className="share-icon-btn"
                aria-label="Share on Twitter"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`,
                    "_blank"
                  )
                }
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </button>
              <button
                className="share-icon-btn"
                aria-label="Share on LinkedIn"
                onClick={() =>
                  window.open(
                    `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                    "_blank"
                  )
                }
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR RIGHT */}
        <div className="article-sidebar">

          {/* SEARCH */}
          <div className="sidebar-card">
            <h3>Search</h3>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                style={{ cursor: "pointer", flexShrink: 0 }}
                onClick={handleSearch}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
          </div>

          {/* RECENT POSTS — semua artikel, scrollable */}
          <div className="sidebar-card">
            <h3>Recent Posts</h3>
            <div className="recent-posts-list">
              {otherRecentPosts.map((item) => (
                <div
                  className="recent-post clickable-post"
                  key={item.id}
                  onClick={() => navigate(`/article/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800"}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800";
                    }}
                  />
                  <div className="recent-post-info">
                    <p>{item.title}</p>
                    <span>{item.date || "Terbaru"}</span>
                  </div>
                </div>
              ))}

              {otherRecentPosts.length === 0 && (
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, textAlign: "center", padding: "10px 0" }}>
                  Tidak ada artikel terbaru lainnya.
                </p>
              )}
            </div>
          </div>

          {/* CATEGORIES */}
          {Object.keys(categoryMap).length > 0 && (
            <div className="sidebar-card">
              <h3>Categories</h3>
              <ul className="sidebar-categories-list">
                {Object.entries(categoryMap).map(([cat, count]) => (
                  <li
                    key={cat}
                    className={article.category === cat ? "active-cat" : ""}
                    onClick={() => navigate(`/article?category=${encodeURIComponent(cat)}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <span>{cat}</span>
                    <span className="cat-count">{String(count).padStart(2, "0")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="cta-sidebar">
            <h4>Ready to explore?</h4>
            <p>Join our community and experience the future of education firsthand.</p>
            <button onClick={() => navigate("/")}>Visit Edupark Now</button>
          </div>

        </div>
      </div>
    </div>
  );
}