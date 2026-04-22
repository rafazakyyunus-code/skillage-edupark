import { Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";

import Hero from "./components/Hero";
import About from "./components/About";
import WhyChoose from "./components/WhyChoose";
import ProductSection from "./components/ProductSection";
import ProgramSection from "./components/ProgramSection";
import GallerySection from "./components/GallerySection";
import CTA from "./components/CTA";

import Hydroponic from "./pages/program/Hydroponic";
import VenueWorkshop from "./pages/program/Venueworkshop";
import Peternakan from "./pages/program/Peternakan";
import VenueAlam from "./components/VenueAlam";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* HALAMAN UTAMA */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <About />
              <WhyChoose />
              <ProductSection />
              <ProgramSection />
              <GallerySection />
              <CTA />
            </>
          }
        />

        {/* HALAMAN PROGRAM */}
        <Route path="/program/hydroponic" element={<Hydroponic />} />
        <Route path="/program/venue-workshop" element={<VenueWorkshop />} />
        <Route path="/program/peternakan" element={<Peternakan />} />
        <Route path="/program/venue-alam" element={<VenueAlam />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;