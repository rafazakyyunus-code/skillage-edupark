import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logo-icon">🌿</span>
        <span className="logo-text">Edupark</span>
      </div>

      <ul className="nav-links">
        <li className="active">Beranda</li>
        <li>Tentang Kami</li>
        <li>Program Kami</li>
        <li>Galeri</li>
        <li>Produk</li>
        <li>Artikel</li>
        <li>E-tiket</li>
      </ul>

      <button className="btn-contact">Hubungi Kami</button>
    </nav>
  );
}