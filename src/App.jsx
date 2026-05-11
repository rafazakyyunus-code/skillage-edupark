import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* ───────── HOME ───────── */
import Hero from "./components/Hero";
import About from "./components/About";
import WhyChoose from "./components/WhyChoose";
import ProductSection from "./components/ProductSection";
import ProgramSection from "./components/ProgramSection";
import CTA from "./components/CTA";
import GallerySection from "./components/GallerySection";
import Tentangkami from "./pages/TentangKami/Tentangkami";

/* ───────── PUBLIC PAGES ───────── */
import Gallery from "./pages/gallery/Gallery";
import GalleryDetail from "./pages/gallery/GalleryDetail";
import Produk from "./pages/semuaProduk/Index";
import ProdukDetail from "./pages/semuaProduk/ProdukDetail";
import Hydroponic from "./pages/program/Hydroponic";
import VenueWorkshop from "./pages/program/VenueWorkshop";
import Peternakan from "./pages/program/Peternakan";
import VenueAlam from "./pages/venue/VenueAlam";
import VenueDetail from "./pages/venue/VenueDetail";
import Article from "./pages/article/Article";
import ArticleDetail from "./pages/articleDetail/ArticleDetail";

/* ───────── E-TIKET ───────── */
import ETicket from "./pages/Etiket/ETicket";

/* ───────── DASHBOARD ───────── */
import CreateArticle from "./pages/dashboard/CreateArticle";
import Editor from "./pages/dashboard/Editor";

/* ───────── UI ───────── */
function Home() {
  return (
    <>
      <Hero />
      <About />
      <WhyChoose />
      <ProductSection />
      <ProgramSection />
      <GallerySection />
      <CTA />
    </>
  );
}

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── GLOBAL ARTICLE STATE ───────── */
function useArticles() {
  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("edupark_articles");

    if (saved) {
      setAllArticles(JSON.parse(saved));
    } else {
      const seed = [
        {
          id: Date.now(),
          title: "Welcome to Edupark - Demo Article",
          author: "Demo Writer",
          category: "Education Technology",
          tags: ["demo", "edtech"],
          submitted: "2 hours ago",
          wordCount: 350,
          status: "pending",
          content:
            "<p>Demo article for testing writer & editor workflow...</p>",
        },
      ];

      setAllArticles(seed);
      localStorage.setItem("edupark_articles", JSON.stringify(seed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("edupark_articles", JSON.stringify(allArticles));
  }, [allArticles]);

  /* 🔥 WRITER → ADD ARTICLE */
  const addArticle = (articleData) => {
    const newArticle = {
      ...articleData,
      id: Date.now(),
      author: "Alex Thompson",
      role: "Writer",
      submitted: new Date().toLocaleString(),
      status: "pending",
    };

    setAllArticles((prev) => [newArticle, ...prev]);
    console.log("✅ Masuk ke Editor:", newArticle.title);
  };

  /* 🔥 EDITOR → UPDATE STATUS */
  const updateStatus = (articleId, newStatus, feedback = "") => {
    setAllArticles((prev) =>
      prev.map((a) =>
        a.id === articleId
          ? { ...a, status: newStatus, feedback }
          : a
      )
    );

    console.log(`Update: ${newStatus}`, articleId);  };

  return { articles: allArticles, addArticle, updateStatus };
}

/* ───────── APP ───────── */
function App() {
  const location = useLocation();
  const { articles, addArticle, updateStatus } = useArticles();

  /* Hide navbar/footer di dashboard */
  const hideLayout = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideLayout && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* PUBLIC */}
          <Route
            path="/"
            element={
              <AnimatedPage>
                <Home />
              </AnimatedPage>
            }
          />

          <Route
            path="/tentang-kami"
            element={
              <AnimatedPage>
                <Tentangkami />
              </AnimatedPage>
            }
          />

          {/* E-TIKET */}
          <Route
            path="/e-ticket"
            element={
              <AnimatedPage>
                <ETicket />
              </AnimatedPage>
            }
          />

          {/* PROGRAM */}
          <Route
            path="/program/hydroponic"
            element={
              <AnimatedPage>
                <Hydroponic />
              </AnimatedPage>
            }
          />

          <Route
            path="/program/venue-workshop"
            element={
              <AnimatedPage>
                <VenueWorkshop />
              </AnimatedPage>
            }
          />

          <Route
            path="/program/peternakan"
            element={
              <AnimatedPage>
                <Peternakan />
              </AnimatedPage>
            }
          />

          <Route
            path="/program/venue-alam"
            element={
              <AnimatedPage>
                <VenueAlam />
              </AnimatedPage>
            }
          />

          {/* GALLERY */}
          <Route
            path="/gallery"
            element={
              <AnimatedPage>
                <Gallery />
              </AnimatedPage>
            }
          />

          <Route
            path="/gallery/:id"
            element={
              <AnimatedPage>
                <GalleryDetail />
              </AnimatedPage>
            }
          />

          {/* PRODUK */}
          <Route
            path="/produk"
            element={
              <AnimatedPage>
                <Produk />
              </AnimatedPage>
            }
          />

          <Route
            path="/produk/kategori/:kategori"
            element={
              <AnimatedPage>
                <Produk />
              </AnimatedPage>
            }
          />

          <Route
            path="/produk/:id"
            element={
              <AnimatedPage>
                <ProdukDetail />
              </AnimatedPage>
            }
          />

          {/* ARTICLE */}
          <Route
            path="/article"
            element={
              <AnimatedPage>
                <Article articles={articles} />
              </AnimatedPage>
            }
          />

          <Route
            path="/article/:id"
            element={
              <AnimatedPage>
                <ArticleDetail articles={articles} />
              </AnimatedPage>
            }
          />

          {/* VENUE */}
          <Route
            path="/venue/:id"
            element={
              <AnimatedPage>
                <VenueDetail />
              </AnimatedPage>
            }
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard/create-article"
            element={
              <CreateArticle onExternalSubmit={addArticle} />
            }
          />

          <Route
            path="/dashboard/editor"
            element={
              <Editor
                externalArticles={articles}
                onUpdateStatus={updateStatus}
              />
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<h1>404 Not Found</h1>} />

        </Routes>
      </AnimatePresence>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;