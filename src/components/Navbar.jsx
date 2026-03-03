import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        🌿 <span>Edupark</span>
      </div>

      <ul className={menuOpen ? "nav-links active" : "nav-links"}>
        <li>Beranda</li>
        <li>Tentang Kami</li>
        <li>Program Kami</li>
        <li>Galeri</li>
        <li>Produk</li>
        <li>Artikel</li>
        <li>E-tiket</li>
        <button className="btn-contact mobile-btn">Hubungi Kami</button>
      </ul>

      <button className="btn-contact desktop-btn">Hubungi Kami</button>

      <div
        className={menuOpen ? "hamburger open" : "hamburger"}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}