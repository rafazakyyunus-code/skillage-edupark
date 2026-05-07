import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // 🔥 scroll behavior
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  const isProgramActive = location.pathname.startsWith("/program");
  const isProdukActive = location.pathname.startsWith("/produk");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200) closeMenu();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 80) {
        setShowNavbar(true);
        return;
      }

      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav className={`navbar ${showNavbar ? "show" : "hide"}`}>
        <div className="nav-container">

          {/* LOGO */}
          <div className="logo">
            <span className="leaf"></span>
            <span>Edupark</span>
          </div>

          {/* MENU */}
          <div className="nav-center">
            <ul className={menuOpen ? "nav-links active" : "nav-links"}>

              <li>
                <NavLink to="/" onClick={closeMenu}>Beranda</NavLink>
              </li>

              <li>
                <NavLink to="/tentang-kami" onClick={closeMenu}>
                  Tentang Kami
                </NavLink>
              </li>

              {/* PROGRAM */}
              <li className={`dropdown ${openDropdown === "program" ? "open" : ""} ${isProgramActive ? "active" : ""}`}>
                <span
                  className="dropdown-title"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("program");
                  }}
                >
                  Program Kami
                  <svg className="chevron" viewBox="0 0 24 24">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </span>

                <ul className={openDropdown === "program" ? "dropdown-menu show" : "dropdown-menu"}>
                  <li><NavLink to="/program/hydroponic" onClick={closeMenu}>Hydroponic</NavLink></li>
                  <li><NavLink to="/program/venue-workshop" onClick={closeMenu}>Venue Workshop</NavLink></li>
                  <li><NavLink to="/program/peternakan" onClick={closeMenu}>Peternakan</NavLink></li>
                  <li><NavLink to="/program/venue-alam" onClick={closeMenu}>Venue Alam</NavLink></li>
                </ul>
              </li>

              <li>
                <NavLink to="/gallery" onClick={closeMenu}>Galeri</NavLink>
              </li>

              {/* PRODUK */}
              <li className={`dropdown ${openDropdown === "produk" ? "open" : ""} ${isProdukActive ? "active" : ""}`}>
                <span
                  className="dropdown-title"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown("produk");
                  }}
                >
                  Produk
                  <svg className="chevron" viewBox="0 0 24 24">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </span>

                <ul className={openDropdown === "produk" ? "dropdown-menu show" : "dropdown-menu"}>
                  <li><NavLink to="/produk" onClick={closeMenu}>Semua Produk</NavLink></li>
                  <li><NavLink to="/produk/kategori/hewan-peternakan" onClick={closeMenu}>Peternakan</NavLink></li>
                  <li><NavLink to="/produk/kategori/sayuran" onClick={closeMenu}>Sayuran</NavLink></li>
                  <li><NavLink to="/produk/kategori/saprodi" onClick={closeMenu}>Saprodi</NavLink></li>
                </ul>
              </li>

              <li>
                <NavLink to="/article" onClick={closeMenu}>Artikel</NavLink>
              </li>

              <li>
                <NavLink to="/tiket" onClick={closeMenu}>E-Tiket</NavLink>
              </li>

            </ul>
          </div>

          {/* RIGHT */}
          <div className="nav-right">
           <NavLink to="/contact" className="btn-contact desktop-btn">
             Hubungi Kami
              </NavLink>

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

        </div>
      </nav>

      {menuOpen && <div className="overlay" onClick={closeMenu} />}
    </>
  );
}