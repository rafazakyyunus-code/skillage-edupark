// src/pages/SemuaProduk/ProdukDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Globe, Lock } from "lucide-react";
import { useProdukData } from "./SemuaProdukData";
import "./ProdukDetail.css";

export default function ProdukDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { products, loading } = useProdukData(); // 🔥 realtime dari Firebase

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center", color: "#64748b" }}>
          {/* Ikon Spinner Berputar */}
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
          <p style={{ fontSize: 15, margin: 0 }}>Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  // id dari URL bisa berupa Firebase key (string)
  const product = products.find((p) => p.id === id || String(p.id) === id);

  if (!product) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
          <h2 style={{ color: "#1e293b" }}>Produk tidak ditemukan</h2>
          <button onClick={() => navigate("/produk")}
            style={{ marginTop: 16, padding: "10px 24px", background: "#16c35b", color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            ← Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  /* ── Keunggulan produk (dari Firebase atau fallback default) ── */
  const features = [
    product.feature1 || "Produk berkualitas tinggi dari peternakan organik.",
    product.feature2 || "Hands-on experience dengan standar industri Fortune 500.",
    product.feature3 || "Mendapatkan dukungan penuh dari tim ahli kami.",
  ];

  /* ── Handler untuk Tombol Beli via WhatsApp Dinamis ── */
  const handleBuyClick = () => {
    const namaProduk = product.name || "Produk Edupark";
    const hargaFormat = Number(product.price).toLocaleString("id-ID");
    
    // Menyusun teks otomatis (Menggunakan asteris '*' untuk format bold di WA)
    const textMessage = `Halo Admin Skillage Edupark, saya tertarik dan ingin membeli produk berikut:\n\n` +
                        `*Nama Produk:* ${namaProduk}\n` +
                        `*Harga:* Rp ${hargaFormat}\n\n` +
                        `Bagaimana prosedur pembayaran dan metode pengirimannya? Terima kasih.`;

    // Mengubah string pesan teks menjadi format URL-Safe (encode)
    const encodedText = encodeURIComponent(textMessage);
    
    // Membuka link chat WhatsApp di tab baru
    window.open(`https://wa.me/6285219801259?text=${encodedText}`, "_blank");
  };

  return (
    <div className="pd-root">
      <div className="pd-container">
        {/* LEFT: IMAGE */}
        <div className="pd-image-section">
          <img
            src={product.image}
            alt={product.name}
            className="pd-main-image"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="pd-thumbnails">
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

        {/* RIGHT: INFO */}
        <div className="pd-info">
          {/* Badge */}
          {product.badge && (
            <span style={{
              display: "inline-block", marginBottom: 10,
              padding: "3px 12px", fontSize: 11, fontWeight: 700, borderRadius: 4, color: "#fff",
              background: product.badgeColor === "red" ? "#ef4444" : "#16c35b",
            }}>
              {product.badge}
            </span>
          )}

          {/* Category */}
          <div style={{ fontSize: 12, fontWeight: 700, color: "#16c35b", letterSpacing: 1.2,
            textTransform: "uppercase", marginBottom: 8 }}>
            {product.categoryLabel || product.category}
          </div>

          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-rating">
            <span className="stars">⭐⭐⭐⭐⭐</span>
            <span className="rating-text">(4.9 / 5, 2.4k Students)</span>
          </div>

          <h2 className="pd-price">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </h2>
          <p className="pd-price-note">One-time payment. Lifetime access included.</p>

          <p className="pd-desc">{product.desc}</p>

          {/* Keunggulan dari Firebase */}
          <ul className="pd-features">
            {features.filter(Boolean).map((f, i) => (
              <li key={i}>
                <span className="pd-check">✓</span> {f}
              </li> // <-- Ubah menjadi </li>
            ))}
          </ul>

          <div className="pd-actions">
            {/* 🔥 Menambahkan event onClick ke fungsi handleBuyClick */}
            <button 
              className="pd-buy" 
              onClick={handleBuyClick}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {/* Ikon Keranjang Belanja (Shopping Cart) */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span>Beli Sekarang</span>
            </button>
            <button className="pd-back" onClick={() => navigate("/produk")}>
              ← Kembali ke Katalog
            </button>
          </div>

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