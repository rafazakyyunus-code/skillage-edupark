import { useParams, useNavigate } from "react-router-dom";
import "./AttractionDetail.css";
import { attractions } from "./Attractions";
const Attractions = [
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
    id: 13,
    title: "Deer Sanctuary",
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1200&auto=format&fit=crop",
    category: "Animals",
    location: "Outdoor Habitat",
    desc:
      "Observe deer families in protected habitats.",
  },
];

export default function AttractionDetail() {

  const { id } = useParams();

  const navigate = useNavigate();

  const attraction = attractions.find(
    (item) => String(item.id) === String(id)
  );

  const recentPosts = attractions.filter(
    (item) => item.id !== attraction?.id
  );

  if (!attraction) {
    return (
      <div className="not-found">
        Attraction Not Found
      </div>
    );
  }

  return (
    <div className="article-detail-page">

      <div className="article-detail-container">

        {/* MAIN */}
        <div className="article-main-content">

          <span className="article-category">
            {attraction.category}
          </span>

          <h1>{attraction.title}</h1>

          <div className="article-meta-detail">
            <span>By Edupark Team</span>
            <span>•</span>
            <span>Updated Today</span>
          </div>

          <img
            className="main-image"
            src={attraction.image}
            alt={attraction.title}
          />

          <div className="article-rich-text-content">

            <p>
              {attraction.desc}
            </p>

            <p>
              Explore immersive educational
              experiences surrounded by nature,
              sustainability, and interactive
              learning designed for all ages.
            </p>

            <h2>
              Discover the Experience
            </h2>

            <p>
              This attraction provides engaging
              activities that combine education,
              creativity, and environmental
              awareness in one unforgettable
              destination.
            </p>

            <img
              className="secondary-image"
              src={attraction.image}
              alt=""
            />

            <h2>
              Educational Benefits
            </h2>

            <p>
              Visitors gain practical experience,
              teamwork skills, and deeper
              understanding of sustainable living
              concepts through interactive
              exploration.
            </p>

          </div>

        </div>

        {/* SIDEBAR */}
        <div className="article-sidebar">

          {/* SEARCH */}
          <div className="sidebar-card">

            <h3>Search</h3>

            <div className="search-box">

              <input
                type="text"
                placeholder="Search attractions..."
              />

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

            </div>
          </div>

          {/* RECENT */}
          <div className="sidebar-card">

            <h3>Recent Attractions</h3>

            <div className="recent-posts-list">

              {recentPosts.map((item) => (

                <div
                  className="recent-post clickable-post"
                  key={item.id}
                  onClick={() =>
                    navigate(`/attractions/${item.id}`)
                  }
                >

                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <div className="recent-post-info">
                    <p>{item.title}</p>
                    <span>{item.category}</span>
                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* CATEGORIES */}
          <div className="sidebar-card">

            <h3>Categories</h3>

            <ul className="sidebar-categories-list">

              <li>
                <span>Nature</span>
                <span className="cat-count">
                  06
                </span>
              </li>

              <li>
                <span>Animals</span>
                <span className="cat-count">
                  06
                </span>
              </li>

              <li>
                <span>Workshops</span>
                <span className="cat-count">
                  06
                </span>
              </li>

            </ul>

          </div>

          {/* CTA */}
          <div className="cta-sidebar">

            <h4>
              Ready to explore?
            </h4>

            <p>
              Join Edupark and discover
              unforgettable educational
              experiences today.
            </p>

            <button
              onClick={() =>
                navigate("/e-tiket")
              }
            >
              Visit Edupark
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}