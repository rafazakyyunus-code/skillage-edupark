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
            Skillage Edupark adalah destinasi wisata edukasi yang menghadirkan pengalaman belajar interaktif di bidang pertanian, peternakan, dan perkebunan. Menggabungkan edukasi, alam, dan rekreasi dalam suasana yang asri dan menyenangkan untuk semua kalangan.  
          </p>

          <div className="social-icons">
            <a href="https://wa.me/6285219801259?text=Assalamualaikum%20saya%20ingin%20bertanya%20tentang%20Skillage%20Edupark"><FaWhatsapp /></a>
            <a href="https://www.instagram.com/skillageislamicschool/"><FaInstagram /></a>
            <a href="https://www.facebook.com/profile.php?id=61550884861070"><FaFacebook /></a>
            <a href="https://www.tiktok.com/@skillageislamicschool?is_from_webapp=1&sender_device=pc"><FaTiktok /></a>
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
    href="https://maps.app.goo.gl/Q4tPCCYMqAcBhd4B8"
    target="_blank"
    rel="noopener noreferrer"
    className="contact-item"
  >
    <FaMapMarkerAlt />
    Jl. Raya Jonggol Dayeuh, Kp. Tegal Putat RT.01/RW.06,
    Sukasirna, Jonggol, Bogor, Jawa Barat 16830
  </a>

  <a
    href="https://wa.me/6285219801259?text=Assalamualaikum%20saya%20ingin%20bertanya%20tentang%20Skillage%20Edupark"
    target="_blank"
    rel="noopener noreferrer"
    className="contact-item"
  >
    <FaPhoneAlt /> +62 852-1980-1259    
  </a>

  <a
    href="https://mail.google.com/mail/u/0/#search/skillageislamic%40gmail.com"
    target="_blank"
    rel="noopener noreferrer"
    className="contact-item"
  >
    <FaEnvelope /> info@skillageislamic.sch.id
  </a>
</div>

{/* MAP */}
<div className="footer-right">
  <MapContainer
    center={[-6.478, 107.004]}
    zoom={15}
    scrollWheelZoom={false}
    className="map"
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

    <Marker position={[-6.478, 107.004]} icon={customIcon}>
      <Popup>
        SMK Skill Village Islamic School
      </Popup>
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