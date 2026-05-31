// src/pages/SemuaProduk/Index.jsx
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "./ProdukCard";

import {
  useProdukData,
  useProdukCategories,
  SORT_OPTIONS,
  ITEMS_PER_PAGE,
  getPages,
} from "./SemuaProdukData";

import "./SemuaProduk.css";

export default function SemuaProduk() {
  const { kategori } = useParams();
  const navigate     = useNavigate();

  const { products, loading } = useProdukData();
  const CATEGORIES            = useProdukCategories(); // 🔥 realtime dari Firebase

  const [search,      setSearch]      = useState("");
  const [sort,        setSort]        = useState("terbaru");
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Derive active category dari URL ── */
  const activeCategory = useMemo(() => {
    if (!kategori) return "Semua Produk";
    const key = decodeURIComponent(kategori).toLowerCase();
    return (
      CATEGORIES.find(
        (cat) => cat.toLowerCase().replace(/\s+/g, "-") === key
      ) || "Semua Produk"
    );
  }, [kategori, CATEGORIES]);

  /* ── Hitung jumlah produk per kategori ── */
  const categoryCounts = useMemo(() => {
    const counts = { "Semua Produk": products.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== "Semua Produk") {
        counts[cat] = products.filter((p) => p.category === cat).length;
      }
    });
    return counts;
  }, [products, CATEGORIES]);

  /* ── Filter & sort ── */
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchCategory =
          activeCategory === "Semua Produk" || p.category === activeCategory;
        const matchSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.categoryLabel || p.category).toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
      })
      .sort((a, b) => {
        if (sort === "harga-asc")  return a.price - b.price;
        if (sort === "harga-desc") return b.price - a.price;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [activeCategory, search, sort, products]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategory = (cat) => {
    setCurrentPage(1);
    if (cat === "Semua Produk") {
      navigate("/produk");
    } else {
      navigate(`/produk/kategori/${cat.toLowerCase().replace(/\s+/g, "-")}`);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="sp-root">
      {/* HERO */}
      <section className="sp-hero">
        <div className="sp-hero-overlay" />
        <div className="sp-hero-content">
          <h1 className="sp-hero-title">
            Edupark Store
            <span className="sp-hero-subtitle">PRODUK EDUPARK</span>
          </h1>
        </div>
      </section>

      {/* SEARCH & SORT */}
      <div className="sp-searchbar">
        <div className="sp-search-wrap">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={handleSearch}
            className="sp-search-input"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
          className="sp-sort-select"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* MAIN */}
      <div className="sp-container">
        <aside className="sp-sidebar">
          <ul className="sp-cat-list">
            {CATEGORIES.map((cat) => (
              <li
                key={cat}
                className={activeCategory === cat ? "active" : ""}
                onClick={() => handleCategory(cat)}
              >
                <span>{cat}</span>
                <span className={`sp-cat-count ${activeCategory === cat ? "sp-cat-count-active" : ""}`}>
                  {categoryCounts[cat] ?? 0}
                </span>
              </li>
            ))}
          </ul>

          <div className="sp-promo-box">
            <span className="sp-promo-label">PROMO MINGGU INI</span>
            <p className="sp-promo-text">Dapatkan diskon 20% untuk semua merchandise!</p>
            <a href="/promo" className="sp-promo-link">Lihat Promo</a>
          </div>
        </aside>

        <main className="sp-main">
          {loading ? (
            <div style={{ padding: "80px 20px", textAlign: "center", color: "#64748b" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <svg
                  style={{ animation: "spin 1s linear infinite", width: "36px", height: "36px" }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor"></circle>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p style={{ fontSize: 15, margin: 0 }}>Memuat produk...</p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="sp-empty">
              <h3>Produk tidak ditemukan</h3>
              <p>Coba ubah kata kunci atau pilih kategori lain.</p>
            </div>
          ) : (
            <div className="sp-grid">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="sp-pagination">
              {getPages(currentPage, totalPages).map((page, i) =>
                page === "..." ? (
                  <span key={i}>...</span>
                ) : (
                  <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}