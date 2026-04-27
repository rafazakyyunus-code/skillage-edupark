// src/pages/SemuaProduk/ProductCard.jsx
import { useState } from "react";
import { formatRp } from "./SemuaProdukData"; // ✅ FIX CASE
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="sp-card">
      {/* IMAGE */}
      <div className="sp-card-img-wrap">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="sp-card-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="sp-card-img-fallback">🌿</div>
        )}

        {product.badge && (
          <span
            className={`sp-card-badge ${
              product.badgeColor === "red"
                ? "sp-badge-red"
                : "sp-badge-green"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* BODY */}
      <div className="sp-card-body">
        <span className="sp-card-category">
          {product.categoryLabel.toUpperCase()}
        </span>

        <h3 className="sp-card-name">{product.name}</h3>

        <div className="sp-card-price">
          {formatRp(product.price)}
        </div>

        <p className="sp-card-desc">{product.desc}</p>

        <Link to={`/produk/${product.id}`} className="sp-card-btn">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View Detail
        </Link>
      </div>
    </div>
  );
}