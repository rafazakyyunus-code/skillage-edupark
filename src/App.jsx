import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import WhyChoose from "./components/WhyChoose";
import ProductSection from "./components/ProductSection";
import ProgramSection from "./components/ProgramSection";
import GallerySection from "./components/GallerySection";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Hero />

      <About />

      <WhyChoose />

      <ProductSection />

      <ProgramSection />

      <GallerySection />

      <CTA />

      <Footer />
    </>
  );
}

export default App;