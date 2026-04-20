import "./GallerySection.css";
import { useEffect, useRef } from "react";

export default function GallerySection() {
  const images = [
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a",
    "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    "https://images.unsplash.com/photo-1504593811423-6dd665756598",
    "https://images.unsplash.com/photo-1492496913980-501348b61469",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  ];

  const sectionRef = useRef();

  useEffect(() => {
    const items = document.querySelectorAll(".gallery-item");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("show");
            }, index * 150); // delay satu-satu
          });
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);
  }, []);

  return (
    <section className="gallery" ref={sectionRef}>
      <div className="gallery-header">
        <div>
          <h2>Moment Edupark</h2>
          <p>Glimpses into the daily life and discovery at Edupark.</p>
        </div>
        <button>View Full Gallery</button>
      </div>

      <div className="gallery-grid">
        {images.map((img, index) => (
          <div key={index} className="gallery-item">
            <img src={img} alt="gallery" />
          </div>
        ))}
      </div>
    </section>
  );
}