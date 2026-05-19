import "./Attractions.css";
import { useState } from "react";

import {
  FaGlobe,
  FaTools,
  FaLeaf,
  FaPaw,
} from "react-icons/fa";

const attractions = [

  /* ================= WORKSHOPS ================= */

  {
    id: 1,
    title: "Eco-Craft Studio",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    category: "Workshops",
    location: "Creative Zone",
    desc:
      "Hands-on sustainable art and craft activities using recycled materials.",
  },

  {
    id: 2,
    title: "Science Workshop",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
    category: "Workshops",
    location: "Indoor Lab",
    desc:
      "Interactive science experiments for young learners.",
  },

  {
    id: 3,
    title: "Art Experience",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
    category: "Workshops",
    location: "Art Hall",
    desc:
      "Painting, sketching, and creative teamwork activities.",
  },

  {
    id: 4,
    title: "Coding Camp",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    category: "Workshops",
    location: "Tech Room",
    desc:
      "Learn coding and digital creativity through fun activities.",
  },

  {
    id: 5,
    title: "Creative Lab",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
    category: "Workshops",
    location: "Workshop Area",
    desc:
      "Educational group projects and interactive collaboration.",
  },

  {
    id: 6,
    title: "Innovation Hub",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    category: "Workshops",
    location: "Main Building",
    desc:
      "Build and explore innovative educational ideas together.",
  },

  /* ================= NATURE ================= */

  {
    id: 7,
    title: "Adventure Trail",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    category: "Nature",
    location: "Outdoor",
    desc:
      "Nature hiking paths with scenic landscapes.",
  },

  {
    id: 8,
    title: "Hydroponics Lab",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop",
    category: "Nature",
    location: "Research Zone",
    desc:
      "Explore innovative sustainable farming systems.",
  },

  {
    id: 9,
    title: "Botany Garden",
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1200&auto=format&fit=crop",
    category: "Nature",
    location: "Educational Garden",
    desc:
      "Discover tropical plants and green ecosystems.",
  },

  {
    id: 10,
    title: "Forest Camp",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    category: "Nature",
    location: "Camping Area",
    desc:
      "Outdoor exploration and camping adventures.",
  },

  {
    id: 11,
    title: "Waterfall Trek",
    image:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop",
    category: "Nature",
    location: "Mountain Trail",
    desc:
      "Exciting trekking routes with hidden waterfalls.",
  },

  {
    id: 12,
    title: "Greenhouse Tour",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1200&auto=format&fit=crop",
    category: "Nature",
    location: "Indoor Greenhouse",
    desc:
      "Learn about sustainable plant cultivation.",
  },

  /* ================= ANIMALS ================= */

  {
    id: 13,
    title: "Deer Sanctuary",
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1200&auto=format&fit=crop",
    category: "Animals",
    location: "Outdoor Habitat",
    desc:
      "Observe deer families in protected habitats.",
  },

  {
    id: 14,
    title: "Butterfly Pavilion",
    image:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=1200&auto=format&fit=crop",
    category: "Animals",
    location: "Indoor Dome",
    desc:
      "A vibrant habitat full of butterfly species.",
  },

  {
    id: 15,
    title: "Bird Sanctuary",
    image:
      "https://images.unsplash.com/photo-1501706362039-c6e80948bb91?q=80&w=1200&auto=format&fit=crop",
    category: "Animals",
    location: "Forest Zone",
    desc:
      "Explore tropical birds in natural environments.",
  },

  {
    id: 16,
    title: "Rabbit Garden",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1200&auto=format&fit=crop",
    category: "Animals",
    location: "Kids Area",
    desc:
      "Interactive feeding and play sessions with rabbits.",
  },

  {
    id: 17,
    title: "Mini Zoo",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200&auto=format&fit=crop",
    category: "Animals",
    location: "Family Zone",
    desc:
      "Meet friendly farm animals and exotic species.",
  },

  {
    id: 18,
    title: "Aquatic World",
    image:
      "https://images.unsplash.com/photo-1520301255226-bf5f144451c1?q=80&w=1200&auto=format&fit=crop",
    category: "Animals",
    location: "Aquarium",
    desc:
      "Discover underwater creatures and marine life.",
  },

];

export default function Attractions() {

  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

  const filteredData =
    activeFilter === "All"
      ? attractions
      : attractions.filter(
          (item) => item.category === activeFilter
        );

  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const startIndex = (page - 1) * itemsPerPage;

  const currentItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  return (
    <div className="attractions-page">

      {/* HERO */}
      <section className="at-hero">

        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400&auto=format&fit=crop"
          alt=""
        />

        <div className="at-overlay"></div>

        <div className="at-hero-content">

          <span className="at-badge">
            ADVENTURE AWAITS
          </span>

          <h1>
            Discover the Wonder of
            <br />
            Learning
          </h1>

          <p>
            Explore interactive workshops,
            hidden nature trails, and majestic
            wildlife at Edupark Skillage.
          </p>

          <div className="at-buttons">

            <button className="at-primary">
              Start Exploring
            </button>

            <button className="at-secondary">
              View Map
            </button>

          </div>

        </div>
      </section>

      {/* HEADER */}
      <div className="at-header">

        <div>
          <h2>Explore Our Attractions</h2>

          <p>
            Curated educational experiences for all ages.
          </p>
        </div>

        <div className="at-filters">

          <button
            className={activeFilter === "All" ? "active" : ""}
            onClick={() => handleFilter("All")}
          >
            <FaGlobe />
            All
          </button>

          <button
            className={activeFilter === "Workshops" ? "active" : ""}
            onClick={() => handleFilter("Workshops")}
          >
            <FaTools />
            Workshops
          </button>

          <button
            className={activeFilter === "Nature" ? "active" : ""}
            onClick={() => handleFilter("Nature")}
          >
            <FaLeaf />
            Nature
          </button>

          <button
            className={activeFilter === "Animals" ? "active" : ""}
            onClick={() => handleFilter("Animals")}
          >
            <FaPaw />
            Animals
          </button>

        </div>
      </div>

      {/* GRID */}
      <div className="at-grid">

        {currentItems.map((item) => (

          <div className="at-card" key={item.id}>

            <div className="at-image">

              <img
                src={item.image}
                alt={item.title}
              />

              <span className="at-tag">
                {item.category}
              </span>

            </div>

            <div className="at-content">

              <h3>{item.title}</h3>

              <p>{item.desc}</p>

              <div className="at-footer">

                <span>
                  🌿 {item.location}
                </span>

                <button>
                  Explore More →
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* PAGINATION */}
      {activeFilter === "All" && (
        <div className="at-pagination">

          {[...Array(totalPages)].map((_, i) => (

            <button
              key={i}
              className={page === i + 1 ? "active-page" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>

          ))}

        </div>
      )}

    </div>
  );
}