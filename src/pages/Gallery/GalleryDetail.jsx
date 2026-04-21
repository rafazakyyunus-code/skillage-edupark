import { useParams } from "react-router-dom"
import galleryData from "./GalleryData"
import "./GalleryDetail.css"

export default function GalleryDetail() {
  const { id } = useParams()
  const item = galleryData.find(d => d.id === parseInt(id))

  return (
    <div className="detail-container">

      {/* TITLE DI ATAS */}
      <h1 className="detail-title">{item.title}</h1>

      <div className="detail-content">
        <img src={item.image} alt={item.title} />

        <div className="detail-text">
          <p>{item.desc}</p>
          <p>
            Edupark menghadirkan pengalaman edukatif yang menyenangkan
            bagi keluarga dan pelajar. Setiap aktivitas dirancang
            untuk memberikan pembelajaran langsung di alam terbuka.
          </p>
        </div>
      </div>

    </div>
  )
}