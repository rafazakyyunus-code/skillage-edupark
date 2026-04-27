import { useParams, useNavigate } from "react-router-dom";
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
          <img src={product.image} alt={product.name} />

          <div className="pd-thumbnails">
            <img src={product.image} alt={product.name} />
            <img src={product.image} alt={product.name} />
            <img src={product.image} alt={product.name} />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="pd-info">

          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-rating">⭐⭐⭐⭐⭐ (4.9 / 5)</div>

          <h2 className="pd-price">
            Rp {product.price.toLocaleString("id-ID")}
          </h2>

          <p className="pd-desc">
            Produk berkualitas dari Edupark yang cocok untuk edukasi dan kebutuhan sehari-hari.
          </p>

          <ul className="pd-features">
            <li>✔ Produk berkualitas tinggi</li>
            <li>✔ Cocok untuk edukasi</li>
            <li>✔ Harga terjangkau</li>
          </ul>

          <div className="pd-actions">
            <button className="pd-buy">Beli Sekarang</button>

            <button
              className="pd-back"
              onClick={() => navigate("/produk")}
            >
              ← Kembali ke Katalog
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}