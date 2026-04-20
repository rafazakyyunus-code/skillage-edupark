import "./Footer.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
          <h2 className="logo">🌿 Skillage Edupark</h2>
          <p>
            Tempat wisata edukasi terbaik di bidang pertanian,
            peternakan, dan perkebunan.
          </p>

          {/* SOCIAL ICONS */}
          <div className="social-icons">
            <a href="#" target="_blank"><FaWhatsapp /></a>
            <a href="#" target="_blank"><FaInstagram /></a>
            <a href="#" target="_blank"><FaFacebook /></a>
            <a href="#" target="_blank"><FaTiktok /></a>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="footer-middle">
          <h3>Kontak</h3>
          <p>Jonggol, Bogor, Jawa Barat</p>
        </div>

        {/* RIGHT */}
        <div className="footer-right">
          <MapContainer
            center={[-6.478, 107.004]}
            zoom={13}
            scrollWheelZoom={true}
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