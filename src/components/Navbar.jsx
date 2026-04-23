<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet"></link>

import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  // close saat resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) closeMenu();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // close dropdown saat klik luar
  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown")) {
      setOpenDropdown(null);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">

          {/* LOGO */}
          <div className="logo">
            🌿 <span>Edupark</span>
          </div>

          {/* MENU */}
          <ul className={menuOpen ? "nav-links active" : "nav-links"}>

<li>
  <Link to="/" onClick={closeMenu}>Beranda</Link>
</li>

  <li onClick={closeMenu}>Tentang Kami</li>

  {/* PROGRAM */}
  <li className={`dropdown ${openDropdown === "program" ? "open" : ""}`}>
    <span
      className="dropdown-title"
      onClick={(e) => {
        e.stopPropagation();
        toggleDropdown("program");
      }}
    >
      Program Kami
      <svg className="chevron" viewBox="0 0 24 24">
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"/>
      </svg>
    </span>

    <ul className={openDropdown === "program" ? "dropdown-menu show" : "dropdown-menu"}>
      <li><Link to="/program/hydroponic" onClick={closeMenu}>Hydroponic</Link></li>
      <li><Link to="/program/venue-workshop" onClick={closeMenu}>Venue Workshop</Link></li>
      <li><Link to="/program/peternakan" onClick={closeMenu}>Peternakan</Link></li>
      <li><Link to="/program/venue-alam" onClick={closeMenu}>Venue Alam</Link></li>
    </ul>
  </li>

 <li>
  <Link to="/gallery" onClick={closeMenu}>Galeri</Link>
</li>

  {/* PRODUK */}
  <li className={`dropdown ${openDropdown === "produk" ? "open" : ""}`}>
    <span
      className="dropdown-title"
      onClick={(e) => {
        e.stopPropagation();
        toggleDropdown("produk");
      }}
    >
      Produk
      <svg className="chevron" viewBox="0 0 24 24">
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"/>
      </svg>
    </span>

    <ul className={openDropdown === "produk" ? "dropdown-menu show" : "dropdown-menu"}>
      <li onClick={closeMenu}>Semua Produk</li>
      <li onClick={closeMenu}>Peternakan</li>
      <li onClick={closeMenu}>Sayuran</li>
      <li onClick={closeMenu}>Saprodi</li>
    </ul>
  </li>

  <li onClick={closeMenu}>Artikel</li>
  <li onClick={closeMenu}>E-Tiket</li>

</ul>

          {/* BUTTON */}
          <button className="btn-contact desktop-btn">
            Hubungi Kami
          </button>

          {/* HAMBURGER */}
          <div
            className={menuOpen ? "hamburger open" : "hamburger"}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      {menuOpen && <div className="overlay" onClick={closeMenu} />}
    </>
  );
}