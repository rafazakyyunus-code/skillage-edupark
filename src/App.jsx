import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Home Components
import Hero from "./components/Hero";
import About from "./components/About";
import WhyChoose from "./components/WhyChoose";
import ProductSection from "./components/ProductSection";
import ProgramSection from "./components/ProgramSection";
import CTA from "./components/CTA";
import GallerySection from "./components/GallerySection";

import Tentangkami from "./components/Tentangkami";

import VenueAlam from "./components/VenueAlam";


// Gallery Pages
import Gallery from "./pages/Gallery/Gallery";
import GalleryDetail from "./pages/Gallery/GalleryDetail";

// Product Pages
import Produk from "./pages/SemuaProduk/Index";
import ProdukDetail from "./pages/SemuaProduk/ProdukDetail";

// Program Pages
import Hydroponic from "./pages/program/Hydroponic";
import VenueWorkshop from "./pages/program/VenueWorkshop";
import Peternakan from "./pages/program/Peternakan";

// ARTICLE PAGES
import Article from "./pages/Article/Article";
import ArticleDetail from "./pages/ArticleDetail/ArticleDetail";



/* HOME */
function Home() {
  return (
    <>
      <Hero />
      <About />
      <WhyChoose />
      <ProductSection />
      <Tentangkami/>
      <ProgramSection />
      <GallerySection />
      <CTA />
    </>
  );
}


/* PAGE ANIMATION */
function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}


function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes
          location={location}
          key={location.pathname}
        >
          {/* HOME */}
 
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/tentang-kami" element={<AnimatedPage><Tentangkami /></AnimatedPage>} />

          <Route
            path="/"
            element={
              <AnimatedPage>
                <Home />
              </AnimatedPage>
            }
          />
be642202c9f9eb8f129850a644207b38fc9d599d

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

          {/* WHY */}
          <Route
            path="/why/lingkungan"
            element={
              <AnimatedPage>
                <VenueAlam />
              </AnimatedPage>
            }
          />

          <Route
            path="/why/program"
            element={
              <AnimatedPage>
                <Hydroponic />
              </AnimatedPage>
            }
          />

          <Route
            path="/why/fasilitas"
            element={
              <AnimatedPage>
                <VenueWorkshop />
              </AnimatedPage>
            }
          />

          <Route
            path="/why/instruktur"
            element={
              <AnimatedPage>
                <Peternakan />
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
                <Article />
              </AnimatedPage>
            }
          />

          <Route
            path="/article/:id"
            element={
              <AnimatedPage>
                <ArticleDetail />
              </AnimatedPage>
            }
          />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default App;