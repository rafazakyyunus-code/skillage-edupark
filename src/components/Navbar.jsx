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

  {/* DROPDOWN PROGRAM */}
  <li className="dropdown">
    Program Kami 
    <ul className="dropdown-menu">
      <li>Hydroponic</li>
      <li>Venue Workshop</li>
      <li>Peternakan</li>
      <li>Venue Alam</li>
    </ul>
  </li>

  <li>Galeri</li>

  {/* DROPDOWN PRODUK */}
  <li className="dropdown">
    Produk
    <ul className="dropdown-menu">
      <li>Semua Produk</li>
      <li>Peternakan</li>
      <li>Sayuran</li>
      <li>Saprodi</li>
    </ul>
  </li>

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