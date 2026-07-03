import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TicketDetailModal from "../pages/Etiket/TicketDetailModal";
import "./WhyChoose.css";

/**
 * WhyChoose — Slider section di homepage.
 *
 * Props:
 *   tickets  — array paket wisata dari Firebase (ticketsOnline).
 *
 * Klik "Lihat Detail →" membuka TicketDetailModal langsung di homepage,
 * menampilkan detail paket yang dipilih (sama persis dengan TicketsOnline.jsx).
 */
export default function WhyChoose({ tickets = [] }) {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [initialView, setInitialView]         = useState("detail");

  function openDetail(e, ticket) {
    e.stopPropagation(); // Cegah card onClick ikut terpicu
    setInitialView("detail");
    setSelectedPackage(ticket);
  }

  function openForm(e, ticket) {
    e.stopPropagation();
    setInitialView("form");
    setSelectedPackage(ticket);
  }

  // Fallback skeleton
  if (tickets.length === 0) {
    return (
      <section className="why">
        <h2>Paket Wisata Kami</h2>
        <p className="subtitle">Memuat paket wisata...</p>
        <div className="slider-wrapper">
          <div className="slider-track">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="why-card skeleton-card">
                <div className="skeleton-img" />
                <div className="card-content">
                  <div className="skeleton-line long" />
                  <div className="skeleton-line short" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Duplikasi array supaya slider infinite terlihat mulus
  const sliderItems = [...tickets, ...tickets];

  return (
    <>
      <section className="why">
        <h2>Paket Wisata Kami</h2>
        <p className="subtitle">
          Temukan pengalaman wisata edukasi, outbound, dan petualangan alam yang tak terlupakan.
        </p>

        {/* INFINITE AUTO-SCROLL SLIDER */}
        <div className="slider-wrapper">
          <motion.div
            className="slider-track"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {sliderItems.map((ticket, index) => (
              <div
                key={`${ticket.id ?? ticket.firebaseId}-${index}`}
                className="why-card"
                onClick={() => navigate("/tickets-online")}
              >
                {/* Gambar paket */}
                <div className="why-card-img-wrap">
                  <img
                    src={
                      ticket.image ||
                      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800"
                    }
                    alt={ticket.title}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800";
                    }}
                  />
                  {ticket.featured && (
                    <span className="why-featured-badge">⭐ Unggulan</span>
                  )}
                </div>

                <div className="card-content">
                  {/* Badge kategori */}
                  {ticket.category && (
                    <span className="why-category-badge">{ticket.category}</span>
                  )}

                  <h4>{ticket.title}</h4>

                  {/* Fitur utama (maks 2 item) */}
                  {ticket.features && ticket.features.length > 0 && (
                    <ul className="why-features-list">
                      {ticket.features.slice(0, 2).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  )}

                  {/* Harga */}
                  <div className="why-price-row">
                    <span className="why-price-label">Weekday</span>
                    <span className="why-price-value">{ticket.weekday}</span>
                  </div>
                  {ticket.weekend && (
                    <div className="why-price-row">
                      <span className="why-price-label">Weekend</span>
                      <span className="why-price-value">{ticket.weekend}</span>
                    </div>
                  )}

                  {/* Tombol aksi */}
                  <div className="why-actions">
                    <button
                      className="why-btn-detail"
                      onClick={(e) => openDetail(e, ticket)}
                    >
                      Lihat Detail →
                    </button>
                    <button
                      className="why-btn-book"
                      onClick={(e) => openForm(e, ticket)}
                    >
                      Pesan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Tombol lihat semua paket */}
        <button className="why-see-all" onClick={() => navigate("/tickets-online")}>
          Lihat Semua Paket
        </button>
      </section>

      {/* Modal detail paket — muncul di atas homepage */}
      <TicketDetailModal
        selected={selectedPackage}
        initialView={initialView}
        onClose={() => setSelectedPackage(null)}
      />
    </>
  );
}