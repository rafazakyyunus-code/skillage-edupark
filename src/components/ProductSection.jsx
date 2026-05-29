import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProdukData, formatRp } from "../pages/semuaProduk/SemuaProdukData";
import "./ProductSection.css";

export default function ProductSection() {
  const navigate = useNavigate();
  const { products, loading } = useProdukData();

  const displayProducts = products.slice(0, 4);

  return (
    <section className="product-section">
      <div className="ps-container">

        {/* ── HEADER ── */}
        <motion.div
          className="ps-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <h2>Produk Edupark</h2>
          <div className="ps-underline" />
          <p>
            Temukan beragam program interaktif kami yang dirancang untuk
            menginspirasi kepemimpinan lingkungan.
          </p>
        </motion.div>

        {/* ── STATES ── */}
        {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
          {/* Ikon Loading Spinner yang Berputar */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <svg style={{ animation: "spin 1s linear infinite", width: "32px", height: "32px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p>Memuat produk...</p>
        </div>
      ) : displayProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
          {/* Ikon Kotak Kosong (Package/Box) */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </div>
          <p>Belum ada produk tersedia.</p>
        </div>
      ) : (
          /* ── GRID ── */
          <div className="ps-grid">
            {displayProducts.map((item, index) => (
              <motion.div
                key={item.id}
                className="ps-card"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/produk/${item.id}`)}
              >
                {/* IMAGE */}
                <div className="ps-card-img">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=No+Image";
                    }}
                  />
                </div>

                {/* BODY */}
                <div className="ps-card-body">
                  {item.categoryLabel && (
                    <span className="ps-card-category">
                      {item.categoryLabel}
                    </span>
                  )}

                  <h3 className="ps-card-title">{item.name}</h3>
                  <p className="ps-card-desc">{item.desc}</p>
                  <div className="ps-card-price">{formatRp(item.price)}</div>

                  <button
                    className="ps-card-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/produk/${item.id}`);
                    }}
                  >
                    Lihat Detail
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── TOMBOL SELENGKAPNYA ── */}
        <div className="ps-center-btn">
          <button
            className="ps-primary-btn"
            onClick={() => navigate("/produk")}
          >
            Selengkapnya
          </button>
        </div>

      </div>
    </section>
  );
}