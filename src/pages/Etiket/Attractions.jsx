import { useState } from "react"

import {
  FaThLarge,
  FaTools,
  FaLeaf,
  FaPaw,
} from "react-icons/fa"

import "./Attractions.css"

const attractions = [

  /* WORKSHOPS */
  {
    id: 1,
    title: "Eco-Craft Studio",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    category: "WORKSHOPS",
    location: "Indoor",
    desc:
      "Hands-on sustainable art and craft activities using recycled materials.",
  },

  {
    id: 2,
    title: "Clay Workshop",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop",
    category: "WORKSHOPS",
    location: "Indoor",
    desc:
      "Creative clay crafting experiences for children and students.",
  },

  {
    id: 3,
    title: "Painting Corner",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
    category: "WORKSHOPS",
    location: "Indoor",
    desc:
      "Interactive painting sessions guided by professional mentors.",
  },

  {
    id: 4,
    title: "Science Lab",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
    category: "WORKSHOPS",
    location: "Indoor",
    desc:
      "Explore exciting science experiments in a fun environment.",
  },

  {
    id: 5,
    title: "Cooking Class",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1200&auto=format&fit=crop",
    category: "WORKSHOPS",
    location: "Indoor",
    desc:
      "Learn healthy cooking techniques with local ingredients.",
  },

  {
    id: 6,
    title: "Woodcraft Room",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    category: "WORKSHOPS",
    location: "Indoor",
    desc:
      "Build creative wooden projects with hands-on guidance.",
  },

  /* NATURE */
  {
    id: 7,
    title: "Adventure Trail",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    category: "NATURE",
    location: "Outdoor",
    desc:
      "Nature hiking paths with scenic landscapes and exploration routes.",
  },

  {
    id: 8,
    title: "Hydroponics Lab",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop",
    category: "NATURE",
    location: "Research",
    desc:
      "Discover innovative farming systems and sustainable agriculture.",
  },

  {
    id: 9,
    title: "Botany Garden",
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1200&auto=format&fit=crop",
    category: "NATURE",
    location: "Outdoor",
    desc:
      "Explore diverse tropical plants and educational greenery zones.",
  },

  {
    id: 10,
    title: "Forest Camping",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    category: "NATURE",
    location: "Outdoor",
    desc:
      "Camping activities surrounded by beautiful forest scenery.",
  },

  {
    id: 11,
    title: "River Walk",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
    category: "NATURE",
    location: "Outdoor",
    desc:
      "Relaxing educational river exploration with nature guides.",
  },

  {
    id: 12,
    title: "Greenhouse Tour",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1200&auto=format&fit=crop",
    category: "NATURE",
    location: "Indoor",
    desc:
      "Learn about plant ecosystems inside modern greenhouses.",
  },

  /* ANIMALS */
  {
    id: 13,
    title: "Deer Sanctuary",
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1200&auto=format&fit=crop",
    category: "ANIMALS",
    location: "Outdoor",
    desc:
      "Observe deer families roaming naturally within protected habitats.",
  },

  {
    id: 14,
    title: "Butterfly Pavilion",
    image:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=1200&auto=format&fit=crop",
    category: "ANIMALS",
    location: "Indoor",
    desc:
      "A colorful habitat showcasing beautiful butterfly species.",
  },

  {
    id: 15,
    title: "Bird House",
    image:
      "https://images.unsplash.com/photo-1501706362039-c6e13b4a6c06?q=80&w=1200&auto=format&fit=crop",
    category: "ANIMALS",
    location: "Outdoor",
    desc:
      "Discover rare bird species in natural habitats.",
  },

  {
    id: 16,
    title: "Rabbit Garden",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1200&auto=format&fit=crop",
    category: "ANIMALS",
    location: "Outdoor",
    desc:
      "Friendly rabbits that visitors can safely interact with.",
  },

  {
    id: 17,
    title: "Mini Zoo",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200&auto=format&fit=crop",
    category: "ANIMALS",
    location: "Outdoor",
    desc:
      "Educational animal encounters designed for young learners.",
  },

  {
    id: 18,
    title: "Fish Pond",
    image:
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1200&auto=format&fit=crop",
    category: "ANIMALS",
    location: "Outdoor",
    desc:
      "Interactive fish feeding and aquatic ecosystem learning.",
  },
]

export default function Attractions() {

  const [activeFilter, setActiveFilter] =
    useState("ALL")

  const [currentPage, setCurrentPage] =
    useState(1)

  const itemsPerPage = 6

  const filteredData =
    activeFilter === "ALL"
      ? attractions
      : attractions.filter(
          (item) =>
            item.category === activeFilter
        )

  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  )

  const startIndex =
    (currentPage - 1) * itemsPerPage

  const displayedItems =
    filteredData.slice(
      startIndex,
      startIndex + itemsPerPage
    )

  const handleFilter = (filter) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  return (
    <div className="attractions-page">

      {/* HERO */}
      <section className="hero-section">

        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400&auto=format&fit=crop"
          alt=""
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span>
            EDUPARK EXPERIENCE
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

          <div className="hero-buttons">

            <button className="primary-btn">
              Start Exploring
            </button>

            <button className="secondary-btn">
              View Map
            </button>

          </div>

        </div>
      </section>

      {/* HEADER */}
      <div className="section-header">

        <div>

          <h2>
            Explore Our Attractions
          </h2>

          <p>
            Curated educational experiences
            for all ages.
          </p>

        </div>

        {/* FILTER */}
        <div className="filter-buttons">

          <button
            className={
              activeFilter === "ALL"
                ? "active-filter"
                : ""
            }
            onClick={() =>
              handleFilter("ALL")
            }
          >
            <FaThLarge />
            All
          </button>

          <button
            className={
              activeFilter === "WORKSHOPS"
                ? "active-filter"
                : ""
            }
            onClick={() =>
              handleFilter("WORKSHOPS")
            }
          >
            <FaTools />
            Workshops
          </button>

          <button
            className={
              activeFilter === "NATURE"
                ? "active-filter"
                : ""
            }
            onClick={() =>
              handleFilter("NATURE")
            }
          >
            <FaLeaf />
            Nature
          </button>

          <button
            className={
              activeFilter === "ANIMALS"
                ? "active-filter"
                : ""
            }
            onClick={() =>
              handleFilter("ANIMALS")
            }
          >
            <FaPaw />
            Animals
          </button>

        </div>

      </div>

      {/* GRID */}
      <div className="attractions-grid">

        {displayedItems.map((item) => (

          <div
            className="attraction-card"
            key={item.id}
          >

            <div className="card-image">

              <img
                src={item.image}
                alt={item.title}
              />

              <span className="card-badge">
                {item.category}
              </span>

            </div>

            <div className="card-content">

              <h3>{item.title}</h3>

              <p>{item.desc}</p>

              <div className="card-footer">

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
      {totalPages > 1 && (

        <div className="pagination">

          {[...Array(totalPages)].map(
            (_, index) => (

              <button
                key={index}
                className={
                  currentPage === index + 1
                    ? "active-page"
                    : ""
                }
                onClick={() =>
                  setCurrentPage(index + 1)
                }
              >
                {index + 1}
              </button>

            )
          )}

        </div>

      )}

    </div>
  )
}