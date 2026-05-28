import "./Attractions.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaGlobe,
  FaTools,
  FaLeaf,
  FaPaw,
} from "react-icons/fa";

/* ================= DATA ================= */

export const attractions = [

  /* WORKSHOPS */

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

  /* NATURE */

  {
    id: 4,
    title: "Adventure Trail",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    category: "Nature",
    location: "Outdoor",
    desc:
      "Nature hiking paths with scenic landscapes.",
  },

  {
    id: 5,
    title: "Hydroponics Lab",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop",
    category: "Nature",
    location: "Research Zone",
    desc:
      "Explore innovative sustainable farming systems.",
  },

  /* ANIMALS */

  {
    id: 6,
    title: "Deer Sanctuary",
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1200&auto=format&fit=crop",
    category: "Animals",
    location: "Outdoor Habitat",
    desc:
      "Observe deer families in protected habitats.",
  },

  {
    id: 7,
    title: "Butterfly Pavilion",
    image:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=1200&auto=format&fit=crop",
    category: "Animals",
    location: "Indoor Dome",
    desc:
      "A vibrant habitat full of butterfly species.",
  },

];

/* ================= COMPONENT ================= */

export default function Attractions() {

  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

  const filteredData =
    activeFilter === "All"
      ? attractions
      : attractions.filter(
          (item) =>
            item.category === activeFilter
        );

  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const startIndex =
    (page - 1) * itemsPerPage;

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

          <h2>
            Explore Our Attractions
          </h2>

          <p>
            Curated educational experiences
            for all ages.
          </p>

        </div>

        <div className="at-filters">

          <button
            className={
              activeFilter === "All"
                ? "active"
                : ""
            }
            onClick={() =>
              handleFilter("All")
            }
          >
            <FaGlobe />
            All
          </button>

          <button
            className={
              activeFilter === "Workshops"
                ? "active"
                : ""
            }
            onClick={() =>
              handleFilter("Workshops")
            }
          >
            <FaTools />
            Workshops
          </button>

          <button
            className={
              activeFilter === "Nature"
                ? "active"
                : ""
            }
            onClick={() =>
              handleFilter("Nature")
            }
          >
            <FaLeaf />
            Nature
          </button>

          <button
            className={
              activeFilter === "Animals"
                ? "active"
                : ""
            }
            onClick={() =>
              handleFilter("Animals")
            }
          >
            <FaPaw />
            Animals
          </button>

        </div>

      </div>

      {/* GRID */}
      <div className="at-grid">

        {currentItems.map((item) => (

          <div
            className="at-card"
            key={item.id}
          >

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

                <button
                  onClick={() =>
                    navigate(
                      `/attractions/${item.id}`
                    )
                  }
                >
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

          {[...Array(totalPages)].map(
            (_, i) => (

              <button
                key={i}
                className={
                  page === i + 1
                    ? "active-page"
                    : ""
                }
                onClick={() =>
                  setPage(i + 1)
                }
              >
                {i + 1}
              </button>

            )
          )}

        </div>

      )}

    </div>
  );
}