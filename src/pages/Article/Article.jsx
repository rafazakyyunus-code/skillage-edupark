import React, { useState } from "react";
import "./Article.css";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock3, ChevronLeft, ChevronRight } from "lucide-react";

export default function ArticlePage({ articles = [] }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // CRITICAL FILTER: Hanya tampilkan artikel dengan status 'published' di halaman publik!
  const publishedArticles = articles.filter((art) => art.status === "published");

  // Ambil daftar kategori unik dari artikel yang sudah terbit untuk tombol filter
  const categories = ["All", ...new Set(publishedArticles.map((a) => a.category).filter(Boolean))];

  // Filter artikel berdasarkan kategori yang dipilih
  const filteredArticles =
    selectedCategory === "All"
      ? publishedArticles
      : publishedArticles.filter((a) => a.category === selectedCategory);

  // Logika Paginasi
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage) || 1;
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Helper untuk memotong konten HTML Tiptap dengan aman sebagai ringkasan teks ringkas
  const renderSummary = (content) => {
    if (!content || typeof content !== "string") return "";
    // Menghilangkan tag HTML sementara untuk mengambil teks murni sebagai cuplikan deskripsi
    const pureText = content.replace(/<\/?[^>]+(>|$)/g, "");
    return pureText.length > 100 ? pureText.substring(0, 100) + "..." : pureText;
  };

  return (
    <div className="article-page">
      {/* HERO SECTION */}
      <section className="article-hero">
        <p className="breadcrumb">Home › Articles</p>
        <h1>Latest Articles</h1>
        <p className="article-hero-sub">
          Stay ahead with expert insights on pedagogical shifts, educational technology,
          and student success strategies in the 21st century.
        </p>
      </section>

      {/* FILTER BUTTONS */}
      <div className="article-filter">
        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1); // Reset ke halaman pertama setiap ganti kategori
              }}
            >
              {category}
            </button>
          ))}
        </div>
        <span className="filter-count">
          Showing {Math.min(indexOfLastArticle, filteredArticles.length)} of {filteredArticles.length} articles
        </span>
      </div>

      {/* ARTICLES GRID */}
      <section className="article-grid">
        {currentArticles.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#6b7280", padding: "60px 0" }}>
            <p style={{ fontSize: "16px", margin: 0 }}>Belum ada artikel publikasi tersedia saat ini.</p>
          </div>
        ) : (
          currentArticles.map((article) => (
            <div key={article.id} className="article-card">
              <div className="card-image-wrapper">
                <img 
                  src={article.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800"} 
                  alt={article.title} 
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800";
                  }}
                />
                <span className="card-category">{article.category || "General"}</span>
              </div>
              <div className="card-content">
                <div className="card-meta">
                  <span>
                    <CalendarDays size={14} /> {article.date || "Terbaru"}
                  </span>
                  <span>
                    <Clock3 size={14} /> {article.wordCount || 0} kata
                  </span>
                </div>
                <h3>{article.title}</h3>
                <p>{renderSummary(article.content)}</p>
                <button 
                  className="read-more" 
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  Read More →
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* PAGINATION PANEL */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* Prev */}
          <button
            className="pagination-arrow"
            onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Smart page numbers with ellipsis */}
          {(() => {
            const pages = [];
            const delta = 1;
            const left = currentPage - delta;
            const right = currentPage + delta;
            let last = 0;

            for (let i = 1; i <= totalPages; i++) {
              if (i === 1 || i === totalPages || (i >= left && i <= right)) {
                if (last && i - last > 1) {
                  pages.push("...");
                }
                pages.push(i);
                last = i;
              }
            }

            return pages.map((item, idx) =>
              item === "..." ? (
                <span key={`ellipsis-${idx}`} className="pagination-ellipsis">···</span>
              ) : (
                <button
                  key={item}
                  className={currentPage === item ? "active-page" : ""}
                  onClick={() => setCurrentPage(item)}
                >
                  {item}
                </button>
              )
            );
          })()}

          {/* Next */}
          <button
            className="pagination-arrow"
            onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}