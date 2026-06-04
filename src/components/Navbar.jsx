import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MoreVertical, LogOut, LogIn } from "lucide-react";
import { getDatabase, ref, onValue } from "firebase/database";
import logoEdupark from '../../public/logo.png';
import "./Navbar.css";

export default function Navbar() {
  // ================= AUTH =================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  // ================= KATEGORI PRODUK DARI FIREBASE =================
  const [produkCategories, setProdukCategories] = useState([]);

  useEffect(() => {
    const db     = getDatabase();
    const catRef = ref(db, "produkCategories");
    const unsub  = onValue(catRef, (snap) => {
      const data = snap.val();
      if (data) {
        const cats = Array.isArray(data)
          ? data.filter(Boolean)
          : Object.values(data).filter(Boolean);
        setProdukCategories(cats);
      } else {
        setProdukCategories([]);
      }
    });
    return () => unsub();
  }, []);

  // ================= LOGIN =================
  const handleLogin = () => {
    setIsLoggedIn(true);
    setOpenProfile(false);
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    setIsLoggedIn(false);
    setOpenProfile(false);
  };

  // ================= LOCATION =================
  const location = useLocation();

  // ================= STATE =================
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // navbar show / hide
  const [showNavbar, setShowNavbar] = useState(true);

  // ================= NAVBAR PROGRESS =================
  const getNavProgress = () => {
    if (location.pathname === "/")                     return "12%";
    if (location.pathname === "/tentang-kami")         return "24%";
    if (location.pathname.startsWith("/program"))      return "40%";
    if (location.pathname === "/gallery")              return "55%";
    if (location.pathname.startsWith("/produk"))       return "70%";
    if (location.pathname === "/article")              return "82%";
    if (location.pathname === "/e-tiket")              return "90%";
    if (location.pathname === "/contact")              return "100%";
    return "0%";
  };

  // ================= ACTIVE PAGE =================
  const isProgramActive = location.pathname.startsWith("/program");
  const isProdukActive  = location.pathname.startsWith("/produk");

  // ================= TOGGLE DROPDOWN =================
  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => prev === name ? null : name);
  };

  // ================= CLOSE MENU =================
  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  // ================= AUTO CLOSE MENU =================
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200) closeMenu();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= CLICK OUTSIDE DROPDOWN =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) setOpenDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ================= NAVBAR SHOW / HIDE =================
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80)              setShowNavbar(true);
      else if (currentScrollY > lastScrollY) setShowNavbar(false);
      else                                   setShowNavbar(true);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className={`navbar ${showNavbar ? "show" : "hide"}`}>

        <div className="nav-container">

          {/* ================= LOGO ================= */}
          <div className="logo">
            <NavLink to="/" onClick={closeMenu}>
            <img src="../../public/logo.png" alt="Edupark Logo" className="logo-img" />
            </NavLink>
          </div>

          {/* ================= MENU ================= */}
          <div className="nav-center">
            <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

              {/* BERANDA */}
              <li>
                <NavLink to="/" onClick={closeMenu}>Beranda</NavLink>
              </li>

              {/* TENTANG */}
              <li>
                <NavLink to="/tentang-kami" onClick={closeMenu}>Tentang Kami</NavLink>
              </li>

              {/* ================= PROGRAM ================= */}
              <li className={`dropdown ${openDropdown === "program" ? "open" : ""} ${isProgramActive ? "active" : ""}`}>
                <button
                  type="button"
                  className="dropdown-title"
                  onClick={(e) => { e.stopPropagation(); toggleDropdown("program"); }}
                >
                  Program Kami
                  <svg className="chevron" viewBox="0 0 24 24">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </button>

                <ul className={`dropdown-menu ${openDropdown === "program" ? "show" : ""}`}>
                  <li><NavLink to="/program/hydroponic" onClick={closeMenu}>Hydroponic</NavLink></li>
                  <li><NavLink to="/program/venue-workshop" onClick={closeMenu}>Venue Workshop</NavLink></li>
                  <li><NavLink to="/program/peternakan" onClick={closeMenu}>Peternakan</NavLink></li>
                  <li><NavLink to="/program/venue-alam" onClick={closeMenu}>Venue Alam</NavLink></li>
                </ul>
              </li>

              {/* GALERI */}
              <li>
                <NavLink to="/gallery" onClick={closeMenu}>Galeri</NavLink>
              </li>

              {/* ================= PRODUK ================= */}
              <li className={`dropdown ${openDropdown === "produk" ? "open" : ""} ${isProdukActive ? "active" : ""}`}>
                <button
                  type="button"
                  className="dropdown-title"
                  onClick={(e) => { e.stopPropagation(); toggleDropdown("produk"); }}
                >
                  Produk
                  <svg className="chevron" viewBox="0 0 24 24">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </button>

                <ul className={`dropdown-menu scrollable ${openDropdown === "produk" ? "show" : ""}`}>
                  {/* Semua Produk */}
                  <li>
                    <NavLink to="/produk" end onClick={closeMenu}>
                      Semua Produk
                    </NavLink>
                  </li>

                  {/* Kategori dinamis dari Firebase */}
                  {produkCategories.map((cat) => (
                    <li key={cat}>
                      <NavLink
                        to={`/produk/kategori/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={closeMenu}
                      >
                        {cat}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              {/* ARTIKEL */}
              <li>
                <NavLink to="/article" onClick={closeMenu}>Artikel</NavLink>
              </li>

              {/* TIKET */}
              <li>
                <NavLink to="/e-tiket" onClick={closeMenu}>E-Tiket</NavLink>
              </li>

            </ul>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="nav-right">

            <NavLink to="/contact" className="btn-contact desktop-btn">
              Hubungi Kami
            </NavLink>

            {/* ================= PROFILE MENU ================= */}
            <div className="profile-menu">
              <button
                className="profile-btn"
                onClick={(e) => { e.stopPropagation(); setOpenProfile(!openProfile); }}
              >
                <MoreVertical size={24} />
              </button>

              <div className={`profile-dropdown ${openProfile ? "show" : ""}`}>
                {!isLoggedIn ? (
                  <NavLink to="/login">
                    <button>
                      <LogIn size={18} />
                      Login
                    </button>
                  </NavLink>
                ) : (
                  <NavLink to="/">
                    <button onClick={handleLogout}>
                      <LogOut size={18} />
                      Logout
                    </button>
                  </NavLink>
                )}
              </div>
            </div>

            {/* ================= HAMBURGER ================= */}
            <button
              type="button"
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

          </div>
        </div>

        {/* ================= NAVBAR PROGRESS ================= */}
        <div className="scroll-progress">
          <div className="scroll-progress-bar" style={{ width: getNavProgress() }}></div>
        </div>

      </nav>

      {/* ================= OVERLAY ================= */}
      {menuOpen && (
        <div className="overlay" onClick={closeMenu}></div>
      )}
    </>
  );
}