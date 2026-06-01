// src/pages/Etiket/TicketsOnline.jsx

import "./TicketsOnline.css";
import { useState } from "react";
import TicketDetailModal from "./TicketDetailModal";

import {
  FaSwimmingPool,
  FaTree,
  FaCampground,
  FaArrowRight,
} from "react-icons/fa";

export default function TicketsOnline() {

  const [selectedPackage, setSelectedPackage] = useState(null);
  // "detail" = buka modal di view detail
  // "form"   = buka modal langsung di view form (dari tombol Pesan Sekarang card)
  const [initialView, setInitialView] = useState("detail");

  const packages = [
    {
      title: "Paket Keluarga",
      icon: <FaSwimmingPool />,
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200",
      weekday: "Rp 1.500.000",
      weekend: "Rp 750.000",
    },
    {
      title: "Paket Rombongan",
      icon: <FaTree />,
      image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200",
      weekday: "Rp 1.000.000",
      weekend: "Rp 550.000",
      featured: true,
    },
    {
      title: "Tiket Per Orang",
      icon: <FaCampground />,
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
      weekday: "Rp 150.000",
      weekend: "Rp 50.000",
    },
  ];

  function openDetail(item) {
    setInitialView("detail");
    setSelectedPackage(item);
  }

  function openForm(item) {
    setInitialView("form");
    setSelectedPackage(item);
  }

  return (
    <div className="ticket-page">

      {/* HERO */}
      <section className="ticket-hero">

        <span className="ticket-badge">PILIHAN PAKET</span>

        <h1>
          Pilih Paket Wisata
          <span> Terbaik Anda</span>
        </h1>

        <p>
          Paket yang dirancang untuk memberikan pengalaman edukasi,
          rekreasi dan konservasi alam yang tak terlupakan.
        </p>

      </section>

      {/* PACKAGE GRID */}
      <section className="ticket-grid">

        {packages.map((item, index) => (
          <div
            className={`ticket-card ${item.featured ? "featured" : ""}`}
            key={index}
          >
            <div className="ticket-image">
              <img src={item.image} alt={item.title} />
            </div>

            <div className="ticket-content">

              <span className="ticket-category">
                {item.icon}
                Paket Wisata
              </span>

              <h3>{item.title}</h3>

              <div className="price-wrapper">
                <div className="price-box">
                  <small>Harga Weekday</small>
                  <strong>{item.weekday}</strong>
                </div>
                <div className="price-box">
                  <small>Harga Weekend</small>
                  <strong>{item.weekend}</strong>
                </div>
              </div>

              <div className="ticket-buttons">

                {/* Pesan Sekarang → buka modal di view form */}
                <button
                  className="book-btn"
                  onClick={() => openForm(item)}
                >
                  Pesan Sekarang
                </button>

                {/* Selengkapnya → buka modal di view detail */}
                <button
                  className="detail-btn"
                  onClick={() => openDetail(item)}
                >
                  Selengkapnya
                  <FaArrowRight />
                </button>

              </div>

            </div>
          </div>
        ))}

      </section>

      {/* MISSION */}
      <section className="ticket-mission">

        <div className="mission-image">
          <div className="glow"></div>
        </div>

        <div className="mission-content">

          <span>MISI KAMI</span>

          <h2>
            Melindungi Alam Sambil
            Menginspirasi Generasi Muda
          </h2>

          <p>
            Nusantara Edupark bukan sekadar tempat wisata.
            Kami adalah pusat konservasi dan edukasi terpadu
            yang menghubungkan manusia dengan alam.
          </p>

          <ul>
            <li>✔ Kurikulum edukasi berbasis konservasi</li>
            <li>✔ Fasilitas ramah lingkungan</li>
            <li>✔ Pemberdayaan masyarakat lokal</li>
          </ul>

          <button>Selengkapnya Tentang Kami</button>

        </div>

      </section>

      {/* MODAL */}
      <TicketDetailModal
        selected={selectedPackage}
        initialView={initialView}
        onClose={() => setSelectedPackage(null)}
      />

    </div>
  );
}