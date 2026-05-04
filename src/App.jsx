import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* HOME */
import Hero from "./components/Hero";
import About from "./components/About";
import WhyChoose from "./components/WhyChoose";
import ProductSection from "./components/ProductSection";
import ProgramSection from "./components/ProgramSection";
import CTA from "./components/CTA";
import GallerySection from "./components/GallerySection";
import Tentangkami from "./components/Tentangkami";

/* PAGES */
import Gallery from "./pages/Gallery/Gallery";
import GalleryDetail from "./pages/Gallery/GalleryDetail";

import Produk from "./pages/SemuaProduk/Index";
import ProdukDetail from "./pages/SemuaProduk/ProdukDetail";

import Hydroponic from "./pages/program/Hydroponic";
import VenueWorkshop from "./pages/program/VenueWorkshop";
import Peternakan from "./pages/program/Peternakan";

import VenueAlam from "./pages/venue/VenueAlam";
import VenueDetail from "./pages/venue/VenueDetail";

/* ARTICLE */
import Article from "./pages/Article/Article";
import ArticleDetail from "./pages/ArticleDetail/ArticleDetail";

/* DASHBOARD */
import CreateArticle from "./pages/Dashboard/CreateArticle";

/* HOME COMPONENT */
function Home() {
  return (
    <>
      <Hero />
      <About />
      <WhyChoose />
      <ProductSection />
      <Tentangkami />
      <ProgramSection />
      <GallerySection />
      <CTA />
    </>
  );
}

/* ANIMATION */
function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  /* ❗ HIDE NAVBAR DI DASHBOARD */
  const hideLayoutRoutes = ["/dashboard"];
  const hideLayout = hideLayoutRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideLayout && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* HOME */}
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/tentang-kami" element={<AnimatedPage><Tentangkami /></AnimatedPage>} />

          {/* PROGRAM */}
          <Route path="/program/hydroponic" element={<AnimatedPage><Hydroponic /></AnimatedPage>} />
          <Route path="/program/venue-workshop" element={<AnimatedPage><VenueWorkshop /></AnimatedPage>} />
          <Route path="/program/peternakan" element={<AnimatedPage><Peternakan /></AnimatedPage>} />
          <Route path="/program/venue-alam" element={<AnimatedPage><VenueAlam /></AnimatedPage>} />

          {/* GALLERY */}
          <Route path="/gallery" element={<AnimatedPage><Gallery /></AnimatedPage>} />
          <Route path="/gallery/:id" element={<AnimatedPage><GalleryDetail /></AnimatedPage>} />

          {/* PRODUK */}
          <Route path="/produk" element={<AnimatedPage><Produk /></AnimatedPage>} />
          <Route path="/produk/kategori/:kategori" element={<AnimatedPage><Produk /></AnimatedPage>} />
          <Route path="/produk/:id" element={<AnimatedPage><ProdukDetail /></AnimatedPage>} />

          {/* ARTICLE */}
          <Route path="/article" element={<AnimatedPage><Article /></AnimatedPage>} />
          <Route path="/article/:id" element={<AnimatedPage><ArticleDetail /></AnimatedPage>} />

          {/* VENUE */}
          <Route path="/venue/:id" element={<AnimatedPage><VenueDetail /></AnimatedPage>} />

          {/* 🔥 DASHBOARD */}
          <Route path="/dashboard/create-article" element={<CreateArticle />} />

        </Routes>
      </AnimatePresence>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;