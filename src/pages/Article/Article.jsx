import React, { useState } from "react";
import "./Article.css";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const articles = [
  // TECHNOLOGY
  {
    id: 1,
    category: "Technology",
    title: "The Future of Digital Learning",
    description: "AI and VR reshaping classrooms.",
    date: "Oct 24, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800",
  },
  {
    id: 2,
    category: "Technology",
    title: "AI Teachers in Modern Schools",
    description: "How AI helps educators.",
    date: "Oct 20, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
  },
  {
    id: 3,
    category: "Technology",
    title: "VR Learning Experience",
    description: "Immersive classroom learning.",
    date: "Oct 18, 2023",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
  },
  {
    id: 4,
    category: "Technology",
    title: "Smart Classroom Devices",
    description: "Modern hardware in schools.",
    date: "Oct 17, 2023",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
  },
  {
    id: 5,
    category: "Technology",
    title: "Coding for Students",
    description: "Teaching programming early.",
    date: "Oct 16, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
  },
  {
    id: 6,
    category: "Technology",
    title: "Future of Online Learning",
    description: "Remote education evolution.",
    date: "Oct 15, 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
  },

  // HIGHER ED
  {
    id: 7,
    category: "Higher Ed",
    title: "University Learning Trends",
    description: "Modern strategies in universities.",
    date: "Oct 14, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
  },
  {
    id: 8,
    category: "Higher Ed",
    title: "Campus Innovation",
    description: "New learning systems.",
    date: "Oct 13, 2023",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
  },
  {
    id: 9,
    category: "Higher Ed",
    title: "Scholarship Opportunities",
    description: "Helping students achieve dreams.",
    date: "Oct 12, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
  },
  {
    id: 10,
    category: "Higher Ed",
    title: "Research Programs",
    description: "Innovation through research.",
    date: "Oct 11, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
  },
  {
    id: 11,
    category: "Higher Ed",
    title: "Digital Libraries",
    description: "Accessing knowledge online.",
    date: "Oct 10, 2023",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800",
  },
  {
    id: 12,
    category: "Higher Ed",
    title: "Student Leadership",
    description: "Building future leaders.",
    date: "Oct 09, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
  },

  // K-12
  {
    id: 13,
    category: "K-12",
    title: "Better Learning for Kids",
    description: "Helping younger students grow.",
    date: "Oct 08, 2023",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
  },
  {
    id: 14,
    category: "K-12",
    title: "Creative Learning Activities",
    description: "Fun classroom exercises.",
    date: "Oct 07, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800",
  },
  {
    id: 15,
    category: "K-12",
    title: "Student Creativity",
    description: "Encouraging imagination.",
    date: "Oct 06, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
  },
  {
    id: 16,
    category: "K-12",
    title: "Healthy Study Habits",
    description: "Helping students stay productive.",
    date: "Oct 05, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
  },
  {
    id: 17,
    category: "K-12",
    title: "School Activities",
    description: "Extracurricular development.",
    date: "Oct 04, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
  },
  {
    id: 18,
    category: "K-12",
    title: "Future Young Leaders",
    description: "Growing confidence in kids.",
    date: "Oct 03, 2023",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800",
  },

  // EDTECH
  {
    id: 19,
    category: "EdTech",
    title: "Digital Tools in Education",
    description: "Apps and tools for teachers.",
    date: "Oct 02, 2023",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
  },
  {
    id: 20,
    category: "EdTech",
    title: "Smart Learning Apps",
    description: "Mobile apps for students.",
    date: "Oct 01, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
  },
  {
    id: 21,
    category: "EdTech",
    title: "Future AI Learning",
    description: "AI makes education smarter.",
    date: "Sep 30, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
  },
  {
    id: 22,
    category: "EdTech",
    title: "Online Classroom Tools",
    description: "Helping teachers online.",
    date: "Sep 29, 2023",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
  },
  {
    id: 23,
    category: "EdTech",
    title: "Learning Analytics",
    description: "Tracking student progress.",
    date: "Sep 28, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800",
  },
  {
    id: 24,
    category: "EdTech",
    title: "Future Education Platforms",
    description: "Next-gen online learning.",
    date: "Sep 27, 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
  },
];

const categories = [
  "All Categories",
  "Technology",
  "Higher Ed",
  "K-12",
  "EdTech",
];

function Article() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);

  const articlesPerPage = 6;

  const filteredArticles =
    selectedCategory === "All Categories"
      ? articles
      : articles.filter(
          (article) => article.category === selectedCategory
        );

  const totalPages = Math.ceil(
    filteredArticles.length / articlesPerPage
  );

  const startIndex =
    (currentPage - 1) * articlesPerPage;

  const currentArticles =
    filteredArticles.slice(
      startIndex,
      startIndex + articlesPerPage
    );

  const handleReadMore = (id) => {
    navigate(`/article/${id}`);
  };

  return (
    <div className="article-page">
      <section className="article-hero">
        <p className="breadcrumb">
          Home &gt; Articles
        </p>
        <h1>Latest Articles</h1>
      </section>

      <div className="article-filter">
        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "active"
                  : ""
              }
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <p>
          Showing {currentArticles.length} of{" "}
          {filteredArticles.length} articles
        </p>
      </div>

      <section className="article-grid">
        {currentArticles.map((article) => (
          <div
            className="article-card"
            key={article.id}
          >
            <img
              src={article.image}
              alt={article.title}
            />

            <div className="article-content">
              <span className="category-tag">
                {article.category}
              </span>

              <div className="article-meta">
                <span>
                  <CalendarDays size={14} />
                  {article.date}
                </span>

                <span>
                  <Clock3 size={14} />
                  {article.readTime}
                </span>
              </div>

              <h3>{article.title}</h3>
              <p>{article.description}</p>

              <button
                className="read-more"
                onClick={() =>
                  handleReadMore(article.id)
                }
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </section>

      <div className="pagination">
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev > 1 ? prev - 1 : prev
            )
          }
        >
          <ChevronLeft size={18} />
        </button>

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

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < totalPages
                ? prev + 1
                : prev
            )
          }
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default Article;