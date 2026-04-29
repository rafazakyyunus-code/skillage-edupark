import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Komponen Halaman
import Hero from "./components/Hero";
import About from "./components/About";
import WhyChoose from "./components/WhyChoose";
import ProductSection from "./components/ProductSection";
import ProgramSection from "./components/ProgramSection";
import CTA from "./components/CTA";
import GallerySection from "./components/GallerySection";
import Tentangkami from "./components/Tentangkami";

import Gallery from "./pages/Gallery/Gallery";
import GalleryDetail from "./pages/Gallery/GalleryDetail";

// Pastikan path import sesuai dengan struktur folder kamu
import Produk from "./pages/SemuaProduk/Index";
import ProdukDetail from "./pages/SemuaProduk/ProdukDetail";

import Artikel from "./pages/Artikel/index";
import Hydroponic from "./pages/program/Hydroponic";
import VenueWorkshop from "./pages/program/VenueWorkshop";
import Peternakan from "./pages/program/Peternakan";
import VenueAlam from "./components/VenueAlam";


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

/* ANIMASI HALAMAN GESER */
function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
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
        <Routes location={location} key={location.pathname}>
          {/* HOME */}
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/tentang-kami" element={<AnimatedPage><Tentangkami /></AnimatedPage>} />

          {/* PROGRAM */}
          <Route path="/program/hydroponic" element={<AnimatedPage><Hydroponic /></AnimatedPage>} />
          <Route path="/program/venue-workshop" element={<AnimatedPage><VenueWorkshop /></AnimatedPage>} />
          <Route path="/program/peternakan" element={<AnimatedPage><Peternakan /></AnimatedPage>} />
          <Route path="/program/venue-alam" element={<AnimatedPage><VenueAlam /></AnimatedPage>} />

          {/* WHY */}
          <Route path="/why/lingkungan" element={<AnimatedPage><VenueAlam /></AnimatedPage>} />
          <Route path="/why/program" element={<AnimatedPage><Hydroponic /></AnimatedPage>} />
          <Route path="/why/fasilitas" element={<AnimatedPage><VenueWorkshop /></AnimatedPage>} />
          <Route path="/why/instruktur" element={<AnimatedPage><Peternakan /></AnimatedPage>} />

          {/* GALLERY */}
          <Route path="/gallery" element={<AnimatedPage><Gallery /></AnimatedPage>} />
          <Route path="/gallery/:id" element={<AnimatedPage><GalleryDetail /></AnimatedPage>} />

          {/* PRODUK */}
          {/* Urutan penting: Kategori harus di atas detail agar slug tidak tertangkap oleh :id */}
          <Route path="/produk" element={<AnimatedPage><Produk /></AnimatedPage>} />
          <Route path="/produk/kategori/:kategori" element={<AnimatedPage><Produk /></AnimatedPage>} />
          <Route path="/produk/:id" element={<AnimatedPage><ProdukDetail /></AnimatedPage>} />

          {/* ARTIKEL */}
          <Route path="/artikel" element={<AnimatedPage><Artikel /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default App;
