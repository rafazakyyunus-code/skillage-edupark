import { useState } from "react"
import { Link } from "react-router-dom"
import "./Gallery.css";
import galleryData from "./GalleryData"

const itemsPerPage = 4

export default function Gallery() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  // Filter kategori
  const filteredData =
    selectedCategory === "Semua"
      ? galleryData
      : galleryData.filter(item => item.category === selectedCategory)

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirst, indexOfLast)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <div className="gallery-page">

      {/* HERO */}
      <div className="gallery-hero">
        <h1>Gallery Edupark</h1>
        <p>Dokumentasi kegiatan, fasilitas, dan aktivitas Edupark.</p>
      </div>

      <div className="gallery-content">

        {/* SIDEBAR */}
        <div className="gallery-sidebar">
          <h3>Kategori</h3>

          {["Semua", "Peternakan", "Perkebunan", "Workshop", "Pengunjung"].map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => {
                setSelectedCategory(cat)
                setCurrentPage(1)
              }}
            >
              {cat}
            </button>
          ))}

        </div>

        {/* GRID */}
        <div className="gallery-grid">

          {currentItems.map(item => (
            <Link
              to={`/gallery/${item.id}`}
              key={item.id}
              className="gallery-card"
            >
              <img src={item.image} alt={item.title} />
              <div className="card-body">
                <h4>{item.title}</h4>
              </div>
            </Link>
          ))}

          {/* PAGINATION */}
          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  )
}