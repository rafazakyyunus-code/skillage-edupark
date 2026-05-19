import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getDatabase, ref, onValue } from "firebase/database"
import "./GalleryDetail.css"

export default function GalleryDetail() {
  const { id } = useParams()
  const [item, setItem]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const db      = getDatabase()
    // id dari URL adalah Firebase key langsung (bukan integer)
    const itemRef = ref(db, `gallery/${id}`)

    const unsub = onValue(itemRef, (snapshot) => {
      const data = snapshot.val()
      setItem(data ? { id, ...data } : null)
      setLoading(false)
    })

    return () => unsub()
  }, [id])

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="detail-loading">
        <div className="detail-spinner" />
        <p>Memuat data...</p>
      </div>
    )
  }

  /* ── Not found ── */
  if (!item) {
    return (
      <div className="detail-not-found">
        <div className="detail-nf-icon">🔍</div>
        <h2>Data tidak ditemukan</h2>
        <p>Item gallery yang kamu cari tidak ada atau telah dihapus.</p>
        <Link to="/gallery" className="detail-back-btn">← Kembali ke Gallery</Link>
      </div>
    )
  }

  /* ── Detail ── */
  return (
    <div className="detail-container">

      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <Link to="/gallery">Gallery</Link>
        <span>›</span>
        <span>{item.category}</span>
        <span>›</span>
        <span>{item.title}</span>
      </div>

      {/* Judul */}
      <h1 className="detail-title">{item.title}</h1>

      {/* Badge kategori */}
      <span className="detail-cat-badge">{item.category}</span>

      {/* Konten */}
      <div className="detail-content">

        <div className="detail-img-wrap">
          <img src={item.image} alt={item.title} />
        </div>

        <div className="detail-text">
          <h2 className="detail-desc-title">Tentang Foto Ini</h2>
          <p>{item.desc}</p>
          <p>
            Edupark menghadirkan pengalaman edukatif yang menyenangkan
            bagi keluarga dan pelajar. Setiap aktivitas dirancang
            untuk memberikan pembelajaran langsung di alam terbuka.
          </p>

          {/* Meta info */}
          <div className="detail-meta">
            <div className="detail-meta-item">
              <span className="detail-meta-label">Kategori</span>
              <span className="detail-meta-value">{item.category}</span>
            </div>
            {item.createdAt && (
              <div className="detail-meta-item">
                <span className="detail-meta-label">Ditambahkan</span>
                <span className="detail-meta-value">
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </span>
              </div>
            )}
          </div>

          <Link to="/gallery" className="detail-back-btn">← Kembali ke Gallery</Link>
        </div>

      </div>
    </div>
  )
}