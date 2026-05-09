import "./Footer.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Leaf } from 'lucide-react';

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-left">
        <h2 className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Leaf size={28} className="text-green-600" /> 
          Skillage Edupark
        </h2>
          <p>
            Tempat wisata edukasi terbaik di bidang pertanian,
            peternakan, dan perkebunan.
          </p>

          <div className="social-icons">
            <a href="#"><FaWhatsapp /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTiktok /></a>
          </div>
        </div>

        {/* MENU */}
        <div className="footer-menu">
          <h3>Menu</h3>
          <ul>
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/tentang-kami">Tentang Kami</Link></li>
            <li><Link to="/program/hydroponic">Program</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/produk">Produk</Link></li>
            <li><Link to="/article">Artikel</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-middle">
  <h3>Kontak</h3>

  <a
    href="https://www.google.com/maps?q=-6.478,107.004"
    target="_blank"
    rel="noopener noreferrer"
    className="contact-item"
  >
    <FaMapMarkerAlt /> Jonggol, Bogor, Jawa Barat
  </a>

  <a
  href="https://wa.me/6281234567890?text=Halo%20saya%20ingin%20bertanya%20tentang%20Edupark"
  target="_blank"
  rel="noopener noreferrer"
  className="contact-item"
>
  <FaPhoneAlt /> +62 812 3456 7890
</a>

  <a href="mailto:info@edupark.com" className="contact-item">
    <FaEnvelope /> info@edupark.com
  </a>
</div>

        {/* MAP */}
        <div className="footer-right">
          <MapContainer
            center={[-6.478, 107.004]}
            zoom={13}
            scrollWheelZoom={false}
            className="map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[-6.478, 107.004]} icon={customIcon}>
              <Popup>Skillage Edupark</Popup>
            </Marker>
          </MapContainer>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Edupark Educational Initiative</p>
      </div>
    </footer>
  );
}