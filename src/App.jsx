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
import Attractions from "./pages/Etiket/Attractions";

/* ───────── DASHBOARD ───────── */
import CreateArticle from "./pages/dashboard/CreateArticle";
import Editor from "./pages/dashboard/Editor";
import ContactPage from "./pages/contact/ContactPage";

/* ───────── FIREBASE ───────── */
import { db } from "./firebase";
import { ref, onValue, set, update } from "firebase/database";

/* ───────── FRAMER MOTION WRAPPER ───────── */
function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── CUSTOM HOOK FIREBASE ───────── */
function useArticles() {
  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    const articlesRef = ref(db, "articles");

    const unsubscribe = onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setAllArticles(list);
      } else {
        setAllArticles([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addArticle = async (newArticle) => {
    // Selalu buat ID baru dari timestamp agar tidak konflik
    const articleId = `art_${Date.now()}`;
    const { id: _ignore, ...cleanArticle } = newArticle; // buang id lama kalau ada

    await set(ref(db, `articles/${articleId}`), {
      ...cleanArticle,
      id: articleId,
    });
  };

  const updateStatus = async (
    articleId,
    newStatus,
    feedback = ""
  ) => {
    await update(ref(db, `articles/${articleId}`), {
      status: newStatus,
      feedback,
    });

    console.log(
      `Firebase Update: ${newStatus}`,
      articleId
    );
  };

  return {
    articles: allArticles,
    addArticle,
    updateStatus,
  };
}

/* ───────── APP ───────── */
function App() {
  const location = useLocation();

  const {
    articles,
    addArticle,
    updateStatus,
  } = useArticles();

  /* Hide navbar/footer dashboard */
  const hideLayout =
    location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideLayout && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes
          location={location}
          key={location.pathname}
        >
          {/* HOME */}
          <Route
            path="/"
            element={
              <AnimatedPage>
                <Hero />
                <About />
                <WhyChoose />
                <ProductSection />
                <ProgramSection />
                <GallerySection />
                <CTA />
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

          <Route
            path="/kontak"
            element={
              <AnimatedPage>
                <ContactPage />
              </AnimatedPage>
            }
          />

          {/* E-TIKET */}
          <Route
            path="/e-tiket"
            element={
              <AnimatedPage>
                <ETicket />
              </AnimatedPage>
            }
          />

          <Route
            path="/attractions"
            element={
              <AnimatedPage>
                <Attractions />
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

          {/* VENUE */}
          <Route
            path="/venue"
            element={
              <AnimatedPage>
                <VenueAlam />
              </AnimatedPage>
            }
          />

          <Route
            path="/venue/:id"
            element={
              <AnimatedPage>
                <VenueDetail />
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
                <ArticleDetail
                  articles={articles}
                />
              </AnimatedPage>
            }
          />

          {/* DASHBOARD ROUTES */}
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