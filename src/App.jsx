import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Hero from "./components/Hero";
import About from "./components/About";
import WhyChoose from "./components/WhyChoose";
import ProductSection from "./components/ProductSection";
import ProgramSection from "./components/ProgramSection";
import CTA from "./components/CTA";
import GallerySection from "./components/GallerySection";

import Gallery from "./pages/gallery/Gallery";
import GalleryDetail from "./pages/gallery/GalleryDetail";

import Hydroponic from "./pages/program/Hydroponic";
import VenueWorkshop from "./pages/program/Venueworkshop";
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
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default App;