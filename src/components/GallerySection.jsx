import "./GallerySection.css";
import { useEffect, useRef } from "react";

export default function GallerySection() {
  const sectionRef = useRef();

  useEffect(() => {
    const items = document.querySelectorAll(".gallery-item");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          items.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add("show");
            }, i * 120);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
  }, []);

  return (
    <section className="gallery" ref={sectionRef}>
      <div className="gallery-header">
        <div>
          <h2>Moment Edupark</h2>
          <p>
            Glimpses into the daily life and discovery at Edupark through our students' eyes.
          </p>
        </div>
        <button>View Full Gallery</button>
      </div>

      <div className="gallery-wrapper">

        <div className="col col-1">
          <div className="gallery-item"><img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6" /></div>
          <div className="gallery-item"><img src="https://images.unsplash.com/photo-1492496913980-501348b61469" /></div>
        </div>

        <div className="col col-2">
          <div className="gallery-item"><img src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8" /></div>
          <div className="gallery-item"><img src="https://images.unsplash.com/photo-1504593811423-6dd665756598" /></div>
        </div>

        <div className="col col-3">
          <div className="gallery-item"><img src="https://images.unsplash.com/photo-1517849845537-4d257902454a" /></div>
          <div className="gallery-item"><img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" /></div>
        </div>

        <div className="col col-4">
          <div className="gallery-item"><img src="https://images.unsplash.com/photo-1492724441997-5dc865305da7" /></div>
          <div className="gallery-item"><img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" /></div>
        </div>

      </div>
    </section>
  );
}