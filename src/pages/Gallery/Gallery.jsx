import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getDatabase, ref, onValue } from "firebase/database"
import "./Gallery.css"

const itemsPerPage = 6
const CATEGORIES = ["Semua", "Peternakan", "Perkebunan", "Workshop", "Pengunjung"]

export default function Gallery() {
  const [galleryData, setGalleryData]       = useState([])
  const [loading, setLoading]               = useState(true)
  const [currentPage, setCurrentPage]       = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  // ── Realtime listener dari Firebase ──────────────────────────────────
  useEffect(() => {
    const db  = getDatabase()
    const galleryRef = ref(db, "gallery")

    const unsub = onValue(galleryRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const arr = Object.entries(data).map(([key, val]) => ({
          id: key,   // Firebase key dipakai sebagai id (untuk link ke detail)
          ...val,
        }))
        // Urutkan terbaru di atas
        arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        setGalleryData(arr)
      } else {
        setGalleryData([])
      }
      setLoading(false)
    })

    return () => unsub()
  }, [])

  // ── Filter & Pagination ───────────────────────────────────────────────
  const filteredData =
    selectedCategory === "Semua"
      ? galleryData
      : galleryData.filter(item => item.category === selectedCategory)

  const totalPages   = Math.ceil(filteredData.length / itemsPerPage)
  const indexOfFirst = (currentPage - 1) * itemsPerPage
  const currentItems = filteredData.slice(indexOfFirst, indexOfFirst + itemsPerPage)

  const handleCategory = (cat) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
  }

  return (
    <div className="gallery-page">

      {/* HERO */}
      <div className="gallery-hero">
        <h1>Gallery Edupark</h1>
        <p>Dokumentasi kegiatan, fasilitas, dan aktivitas Edupark</p>
      </div>

      <div className="gallery-content">

        {/* SIDEBAR – sticky */}
        <aside className="gallery-sidebar">
          <h3>Kategori</h3>
          {CATEGORIES.map(cat => {
            const count = cat === "Semua"
              ? galleryData.length
              : galleryData.filter(i => i.category === cat).length
            return (
              <button
                key={cat}
                className={selectedCategory === cat ? "active" : ""}
                onClick={() => handleCategory(cat)}
              >
                <span>{cat}</span>
                <span className="sidebar-badge">{count}</span>
              </button>
            )
          })}
        </aside>

        {/* GRID */}
        <div className="gallery-grid">

          {/* Loading state */}
          {loading && (
            <div className="gallery-feedback">
              <div className="gallery-spinner" />
              <p>Memuat gallery...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && currentItems.length === 0 && (
            <div className="gallery-feedback">
              <span className="gallery-feedback-icon">🖼️</span>
              <p>Belum ada foto di kategori ini.</p>
            </div>
          )}

          {/* Cards */}
          {!loading && currentItems.map((item, index) => (
            <Link
              to={`/gallery/${item.id}`}
              key={item.id}
              className="gallery-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img src={item.image} alt={item.title} />
              <div className="card-overlay">
                <h4>{item.title}</h4>
                <span>{item.category}</span>
              </div>
            </Link>
          ))}

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >‹</button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >›</button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}