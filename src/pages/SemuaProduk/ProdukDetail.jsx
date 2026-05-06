import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Globe, Lock } from 'lucide-react';
import { PRODUCTS } from "./SemuaProdukData";
import "./ProdukDetail.css";

export default function ProdukDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product) return <h2>Produk tidak ditemukan</h2>;

  return (
    <div className="pd-root">
      <div className="pd-container">
        {/* LEFT IMAGE */}
        <div className="pd-image-section">
          <img src={product.image} alt={product.name} className="pd-main-image" />

          <div className="pd-thumbnails">
            {/* Thumbnail dibuat dalam wrapper agar bisa diatur kelonjongannya */}
            <div className="pd-thumb-wrapper active">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="pd-thumb-wrapper">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="pd-thumb-wrapper">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="pd-thumb-wrapper pd-thumb-more">
              <span>4</span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="pd-info">
          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-rating">
            <span className="stars">⭐⭐⭐⭐⭐</span> 
            <span className="rating-text">(4.9 / 5, 2.4k Students)</span>
          </div>

          <h2 className="pd-price">
            Rp {product.price.toLocaleString("id-ID")}
          </h2>
          <p className="pd-price-note">One-time payment. Lifetime access included.</p>

          <p className="pd-desc">{product.desc}</p>

          {/* List dengan icon centang custom */}
          <ul className="pd-features">
            <li>
              <span className="pd-check">✓</span> 
              Produk berkualitas tinggi dari peternakan organik.
            </li>
            <li>
              <span className="pd-check">✓</span> 
              Hands-on experience dengan standar industri Fortune 500.
            </li>
            <li>
              <span className="pd-check">✓</span> 
              Mendapatkan dukungan penuh dari tim ahli kami.
            </li>
          </ul>

          <div className="pd-actions">
            <button className="pd-buy">
              <span className="cart-icon">🛒</span> Beli Sekarang
            </button>

            <button
              className="pd-back"
              onClick={() => navigate("/produk")}
            >
              ← Kembali ke Katalog
            </button>
          </div>

          {/* Footer Info Tambahan */}
          <div className="pd-footer-info flex gap-6 mt-8">
            <div className="pd-footer-item flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheck size={18} className="text-blue-500" /> 
              <span>Verified Institution</span>
            </div>
            
            <div className="pd-footer-item flex items-center gap-2 text-sm text-gray-600">
              <Globe size={18} className="text-blue-500" /> 
              <span>Global Certificate</span>
            </div>
            
            <div className="pd-footer-item flex items-center gap-2 text-sm text-gray-600">
              <Lock size={18} className="text-blue-500" /> 
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}