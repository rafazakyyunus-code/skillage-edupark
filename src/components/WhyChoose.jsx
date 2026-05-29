import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./WhyChoose.css";

/**
 * WhyChoose — Slider section di homepage.
 *
 * Props:
 *   articles  — array artikel dari Firebase (sama persis dengan
 *               yang dikirim ke <ArticlePage> dan <ArticleDetail>).
 *
 * Komponen ini hanya menampilkan artikel berstatus 'published'
 * agar sinkron dengan halaman Article & ArticleDetail.
 */
export default function WhyChoose({ articles = [] }) {
  const navigate = useNavigate();

  // ✅ Filter hanya artikel published — sama logikanya dengan Article.jsx
  const publishedArticles = articles.filter((a) => a.status === "published");

  // Fallback: jika belum ada artikel dari Firebase, tampilkan skeleton / empty state
  if (publishedArticles.length === 0) {
    return (
      <section className="why">
        <h2>Artikel Terbaru</h2>
        <p className="subtitle">Memuat artikel...</p>
        <div className="slider-wrapper">
          <div className="slider-track">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="why-card skeleton-card">
                <div className="skeleton-img" />
                <div className="card-content">
                  <div className="skeleton-line long" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Duplikasi array supaya slider infinite terlihat mulus
  const sliderItems = [...publishedArticles, ...publishedArticles];

  // Helper strip HTML untuk preview teks
  const stripHtml = (html = "") =>
    html.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 80) + "...";

  return (
    <section className="why">
      <h2>Artikel Terbaru</h2>
      <p className="subtitle">
        Temukan wawasan terkini seputar edukasi, teknologi, dan inspirasi belajar.
      </p>

      {/* INFINITE AUTO-SCROLL SLIDER */}
      <div className="slider-wrapper">
        <motion.div
          className="slider-track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          // Pause on hover (handled by CSS: slider-wrapper:hover .slider-track)
        >
          {sliderItems.map((article, index) => (
            <div
              key={`${article.id}-${index}`}
              className="why-card"
              onClick={() => navigate(`/article/${article.id}`)}
            >
              {/* Gambar artikel — sama sumbernya dengan Article.jsx & ArticleDetail.jsx */}
              <img
                src={
                  article.image ||
                  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800"
                }
                alt={article.title}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800";
                }}
              />

              <div className="card-content">
                {/* Badge kategori */}
                {article.category && (
                  <span className="why-category-badge">{article.category}</span>
                )}
                <h4>{article.title}</h4>
                <p>{stripHtml(article.content)}</p>
                <span className="why-read-more">Baca Selengkapnya →</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Tombol lihat semua artikel */}
      <button className="why-see-all" onClick={() => navigate("/article")}>
        Lihat Semua Artikel
      </button>
    </section>
  );
}