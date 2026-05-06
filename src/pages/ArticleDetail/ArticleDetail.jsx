import React, { useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import "./ArticleDetail.css";

import { Search } from "lucide-react";



const articles = [

  {

    id: 1,

    title: "The Impact of Sustainable Architecture on Modern Learning",

    author: "Admin Edupark",

    date: "12 February 2026",

    category: "Education",

    image:

      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000",

    image2:

      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000",

  },

  {

    id: 2,

    title: "AI Teachers in Modern Schools",

    author: "Admin Edupark",

    date: "10 February 2026",

    category: "Technology",

    image:

      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000",

    image2:

      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000",

  },

  {

    id: 3,

    title: "Future Learning Innovation",

    author: "Admin Edupark",

    date: "8 February 2026",

    category: "Education",

    image:

      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000",

    image2:

      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000",

  },

  {

    id: 4,

    title: "Digital Learning Trends in 2026",

    author: "Admin Edupark",

    date: "5 February 2026",

    category: "Technology",

    image:

      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000",

    image2:

      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000",

  }

];



function ArticleDetail() {

  const { id } = useParams();

  const navigate = useNavigate();



  const [searchTerm, setSearchTerm] = useState("");



  const article =

    articles.find(

      (item) =>item.id=== Number(id)

    ) || articles[0];



  const filteredPosts = articles.filter((item) =>

    item.title

      .toLowerCase()

      .includes(searchTerm.toLowerCase())

  );



  const handleSearch = (e) => {

    setSearchTerm(e.target.value);

  };



  const handlePostClick = (postId) => {

    navigate(`/article/${postId}`);

    window.scrollTo(0, 0);

  };



  return (

    <div className="article-detail-page">

      <div className="article-detail-container">



        {/* LEFT CONTENT */}

        <div className="article-main-content">

          <span className="article-category">

            {article.category}

          </span>



          <h1>{article.title}</h1>



          <div className="article-meta-detail">

            <span>By {article.author}</span>

            <span>{article.date}</span>

          </div>



          <img

            src={article.image}

            alt={article.title}

            className="main-image"

          />



          <p>

            Sustainable learning spaces improve

            student productivity and create

            healthier environments.

          </p>



          <h2>Creating a Connection with Nature</h2>



          <p>

            Natural lighting and open spaces help

            students feel calmer and more engaged.

          </p>



          <img

            src={article.image2}

            alt="secondary"

            className="secondary-image"

          />



          <h2>Flexibility and Collaboration</h2>



          <p>

            Modern classrooms support teamwork,

            creativity, and adaptability.

          </p>

        </div>



        {/* SIDEBAR */}

        <div className="article-sidebar">



          {/* SEARCH */}

          <div className="sidebar-card">

            <h3>Search</h3>



            <div className="search-box">

              <input

                type="text"

                placeholder="Search articles..."

                value={searchTerm}

                onChange={handleSearch}

              />

              <Search size={18} />

            </div>

          </div>



          {/* RECENT POSTS */}

          <div className="sidebar-card">

            <h3>Recent Posts</h3>



            {filteredPosts.length > 0 ? (

              filteredPosts.map((item) => (

                <div

                  className="recent-post clickable-post"

                  key={item.id}

                  onClick={() =>

                    handlePostClick(item.id)

                  }

                >

                  <img

                    src={item.image}

                    alt={item.title}

                  />



                  <div>

                    <p>{item.title}</p>

                    <span>{item.date}</span>

                  </div>

                </div>

              ))

            ) : (

              <p>No articles found.</p>

            )}

          </div>



          {/* CATEGORY */}

          <div className="sidebar-card">

            <h3>Categories</h3>



            <ul>

              <li>Architecture (12)</li>

              <li>Education (24)</li>

              <li>Technology (15)</li>

              <li>Events (05)</li>

            </ul>

          </div>



          {/* CTA */}

          <div className="cta-sidebar">

            <h3>Ready to explore?</h3>



            <p>

              Join our community and explore

              Edupark today.

            </p>



            <button>

              Visit Edupark Now

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}



export default ArticleDetail;