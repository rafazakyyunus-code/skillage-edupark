import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getDatabase, ref, onValue } from "firebase/database"
import "./Gallery.css"

const itemsPerPage = 6

export default function Gallery() {
  const [galleryData, setGalleryData]           = useState([])
  const [categories, setCategories]             = useState(["Semua"])
  const [loading, setLoading]                   = useState(true)
  const [currentPage, setCurrentPage]           = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  useEffect(() => {
    const db = getDatabase()

    // Load gallery items
    const galleryRef = ref(db, "gallery")
    const unsubGallery = onValue(galleryRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const arr = Object.entries(data).map(([key, val]) => ({ id: key, ...val }))
        arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        setGalleryData(arr)
      } else {
        setGalleryData([])
      }
      setLoading(false)
    })

    // Load categories dynamically from Firebase
    const catRef = ref(db, "galleryCategories")
    const unsubCat = onValue(catRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const cats = Array.isArray(data)
          ? data.filter(Boolean)
          : Object.values(data).filter(Boolean)
        setCategories(["Semua", ...cats])
      } else {
        setCategories(["Semua"])
      }
    })

    return () => { unsubGallery(); unsubCat() }
  }, [])

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
        <div className="gallery-hero-content">
          <span className="gallery-hero-tag">Gallery Edupark</span>
          <h1>Galeri Kami</h1>
          <p>Dokumentasi kegiatan, fasilitas, dan aktivitas Edupark</p>
        </div>
      </div>

      <div className="gallery-content">

        {/* SIDEBAR */}
        <aside className="gallery-sidebar">
          <h3>Kategori</h3>
          {categories.map(cat => {
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

          {loading && (
            <div className="gallery-feedback">
              <div className="gallery-spinner" />
              <p>Memuat gallery...</p>
            </div>
          )}

          {!loading && currentItems.length === 0 && (
            <div className="gallery-feedback">
              <span className="gallery-feedback-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Icon: Stacked Images / Gallery Category Empty */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  style={{ width: '40px', height: '40px', color: '#9ca3af' }}
                >
                  {/* Bingkai belakang */}
                  <path d="M5 9H3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-2" />
                  {/* Bingkai depan */}
                  <rect x="8" y="2" width="14" height="14" rx="2" ry="2" />
                  <circle cx="13" cy="7" r="1" />
                  <polyline points="22 13 18 9 8 16" />
                </svg>
              </span>
              <p>Belum ada foto di kategori ini.</p>
            </div>
          )}

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