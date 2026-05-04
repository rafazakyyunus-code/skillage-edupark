import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "./ProdukCard";

import {
  PRODUCTS,
  CATEGORIES,
  SORT_OPTIONS,
  ITEMS_PER_PAGE,
  getPages,
} from "./SemuaProdukData";

import "./SemuaProduk.css";

/* 🔥 MAPPING URL → KATEGORI ASLI */
const kategoriMap = {
  "hewan-peternakan": "Hewan Peternakan",
  "sayuran": "Sayuran",
  "saprodi": "Saprodi",
};

export default function SemuaProduk() {
  const { kategori } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("terbaru");
  const [currentPage, setCurrentPage] = useState(1);

  /* 🔥 DERIVE ACTIVE CATEGORY FROM URL */
  const activeCategory = useMemo(() => {
    if (!kategori) return "Semua Produk";
    const key = decodeURIComponent(kategori).toLowerCase();
    const mappedCategory =
      kategoriMap[key] ||
      CATEGORIES.find((cat) => cat.toLowerCase().replace(/\s+/g, "-") === key);
    return mappedCategory || "Semua Produk";
  }, [kategori]);

  /* ── FILTER & SORT ── */
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCategory =
        activeCategory === "Semua Produk" || p.category === activeCategory;

      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    }).sort((a, b) => {
      if (sort === "harga-asc") return a.price - b.price;
      if (sort === "harga-desc") return b.price - a.price;
      return b.id - a.id;
    });
  }, [activeCategory, search, sort, PRODUCTS]);

  /* ── PAGINATION ── */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Tambahkan baris ini di bagian handleCategory agar tidak terasa "lompat" ke atas
const handleCategory = (cat) => {
  setCurrentPage(1);
  if (cat === "Semua Produk") {
    navigate("/produk");
  } else {
    const slug = cat.toLowerCase().replace(/\s+/g, "-");
    navigate(`/produk/kategori/${slug}`);
  }
};

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="sp-root">
      {/* HERO SECTION */}
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
          onChange={(e) => {
            setSort(e.target.value);
            setCurrentPage(1);
          }}
          className="sp-sort-select"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* MAIN CONTENT */}
      <div className="sp-container">
        <aside className="sp-sidebar">
          {/* Kategori List */}
          <ul className="sp-cat-list">
            {CATEGORIES.map((cat) => (
              <li
                key={cat}
                className={activeCategory === cat ? "active" : ""}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>

          {/* 🔥 TAMBAHKAN PROMO BOX DI SINI */}
          <div className="sp-promo-box">
            <span className="sp-promo-label">PROMO MINGGU INI</span>
            <p className="sp-promo-text">
              Dapatkan diskon 20% untuk semua merchandise!
            </p>
            <a href="/promo" className="sp-promo-link">
              Lihat Promo
            </a>
          </div>
        </aside>

        <main className="sp-main">
          {paginatedProducts.length === 0 ? (
            <div className="sp-empty">
              <h3>Produk tidak ditemukan</h3>
            </div>
          ) : (
            <div className="sp-grid">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
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