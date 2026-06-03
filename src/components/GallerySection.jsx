import "./GallerySection.css";
import { useEffect, useRef, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function GallerySection() {
  const sectionRef = useRef();
  const navigate   = useNavigate();

  const [photos,  setPhotos]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db         = getDatabase();
    const galleryRef = ref(db, "gallery");

    const unsub = onValue(galleryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.entries(data).map(([key, val]) => ({ id: key, ...val }));
        arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setPhotos(arr.slice(0, 8));
      } else {
        setPhotos([]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (loading || photos.length === 0) return;

    const items    = document.querySelectorAll(".gallery-item");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          items.forEach((item, i) => {
            setTimeout(() => item.classList.add("show"), i * 120);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading, photos]);

  const FALLBACK = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&q=60";
  const getPhoto = (i) => photos[i] || { id: null, image: FALLBACK, title: "Edupark" };

  const columns = [
    [getPhoto(0), getPhoto(1)],
    [getPhoto(2), getPhoto(3)],
    [getPhoto(4), getPhoto(5)],
    [getPhoto(6), getPhoto(7)],
  ];

  return (
    <section className="gallery" ref={sectionRef}>

      {/* HEADER — di atas foto */}
      <div className="gallery-header">
        <h2>Momen Edupark</h2>
        <p>Sekilas tentang kehidupan sehari-hari dan penemuan di Edupark melalui sudut pandang siswa kami.</p>
      </div>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="gallery-wrapper">
          {[0, 1, 2, 3].map((col) => (
            <div key={col} className={`col col-${col + 1}`}>
              <div className="gallery-item skeleton-item" />
              <div className="gallery-item skeleton-item" />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && photos.length === 0 && (
        <div className="gallery-empty">
          <span>🖼️</span>
          <p>Belum ada foto di gallery. Tambahkan melalui dashboard.</p>
        </div>
      )}

      {/* GRID 4 KOLOM */}
      {!loading && photos.length > 0 && (
        <div className="gallery-wrapper">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className={`col col-${colIndex + 1}`}>
              {col.map((photo, rowIndex) => (
                <div
                  key={`${colIndex}-${rowIndex}`}
                  className="gallery-item"
                  onClick={() => photo.id && navigate(`/gallery/${photo.id}`)}
                  style={{ cursor: photo.id ? "pointer" : "default" }}
                >
                  <img
                    src={photo.image}
                    alt={photo.title || "Gallery Edupark"}
                    onError={(e) => { e.target.src = FALLBACK; }}
                  />
                  {photo.id && (
                    <div className="gallery-item-overlay">
                      <span className="overlay-title">{photo.title}</span>
                      {photo.category && (
                        <span className="overlay-cat">{photo.category}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* BUTTON DI BAWAH GRID */}
      <div className="gallery-footer">
        <button
          className="gallery-footer-btn"
          onClick={() => navigate("/gallery")}
        >
          Lihat Galeri Selengkapnya
        </button>
      </div>

    </section>
  );
}