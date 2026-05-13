// src/pages/Etiket/ETicket.jsx

import "./ETicket.css";
import {
  FaTicketAlt,
  FaUsers,
  FaTree,
  FaCheckCircle,
  FaShoppingCart,
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";

export default function ETicket() {
  return (
    <div className="eticket-page">

      {/* HERO */}
      <section className="et-hero">
        <div className="et-hero-left">

          <span className="et-badge">
            Welcome to the Future of Learning
          </span>

          <h1>
            Where <span>Learning</span>
            <br />
            Meets Nature.
          </h1>

          <p>
            Explore interactive exhibits and outdoor wonders designed for
            curious minds. Book your visit today and experience the perfect
            blend of education and excitement in our lush green parks.
          </p>

          <div className="et-hero-buttons">

            <button className="et-buy-btn">
              <FaTicketAlt />
              Buy Tickets Online
            </button>

            <button className="et-view-btn">
              View Attractions
            </button>

          </div>
        </div>

        <div className="et-hero-right">

          <div className="et-image-wrapper">

            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
              alt="forest"
            />

            <div className="et-floating-card">

              <div className="et-avatars">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <p>Join 1,000+ students visiting this week!</p>

            </div>

          </div>

        </div>
      </section>

      {/* PACKAGES */}
      <section className="et-packages">

        <div className="et-title">
          <h2>Educational Packages</h2>

          <p>
            Choose the perfect experience for your visit. From individual
            explorers to large school groups, we have a package tailored for
            you.
          </p>
        </div>

        <div className="et-package-grid">

          {/* CARD 1 */}
          <div className="et-card">

            <div className="et-icon">
              <FaUsers />
            </div>

            <h3>Grup Sekolah</h3>

            <p className="et-desc">
              Structured tours and workshops designed specifically
              for classroom learning.
            </p>

            <h1>
              20k<span>/student</span>
            </h1>

            <ul>
              <li>
                <FaCheckCircle />
                Guided Educational Tour
              </li>

              <li>
                <FaCheckCircle />
                Hands-on Workshop
              </li>

              <li>
                <FaCheckCircle />
                Resource Teacher Pack
              </li>
            </ul>

            <button>Book Group Visit</button>
          </div>

          {/* CARD 2 */}
          <div className="et-card et-active">

            <span className="et-best">
              BEST VALUE
            </span>

            <div className="et-icon">
              <FaUsers />
            </div>

            <h3>Hiburan keluarga</h3>

            <p className="et-desc">
              All-access pass for parents and kids.
              A full day of adventure and bonding.
            </p>

            <h1>
              50k<span>/keluarga</span>
            </h1>

            <ul>
              <li>
                <FaCheckCircle />
                Admission for 4 (2+2)
              </li>

              <li>
                <FaCheckCircle />
                Lunch Vouchers Included
              </li>

              <li>
                <FaCheckCircle />
                Interactive App Access
              </li>
            </ul>

            <button className="et-active-btn">
              Pilih Paket
            </button>
          </div>

          {/* CARD 3 */}
          <div className="et-card">

            <div className="et-image-top">

              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop"
                alt="nature"
              />

              <div className="et-floating-icon">
                <FaTree />
              </div>

            </div>

            <h3>Menjelajah alam</h3>

            <p className="et-desc">
              Guided trail walks and wildlife encounters
              for the ultimate outdoor enthusiast.
            </p>

            <h1>
              15k<span>/orang</span>
            </h1>

            <ul>
              <li>
                <FaCheckCircle />
                Expert Naturalist Guide
              </li>

              <li>
                <FaCheckCircle />
                Binocular Rental
              </li>

              <li>
                <FaCheckCircle />
                Trail Completion Medal
              </li>
            </ul>

            <button>Book Trail</button>
          </div>

        </div>
      </section>

      {/* MANAGE */}
      <section className="et-manage">

        <div className="et-title">
          <h2>Manage Your Visit</h2>
        </div>

        <div className="et-manage-grid">

          {/* CARD */}
          <div className="et-manage-card">

            <div className="et-manage-icon">
              <FaShoppingCart />
            </div>

            <h3>Instan tiket</h3>

            <p>
              Skip the queue and secure your spot today
              with our fast online booking.
            </p>

            <button className="et-card-beli">
              Beli Tiket secara online
            </button>

          </div>

          {/* CARD */}
          <div className="et-manage-card">

            <div className="et-manage-icon et-gray">
              <FaSearch />
            </div>

            <h3>Ticket Status</h3>

            <input
              type="text"
              placeholder="Masukkan ID Booking"
            />

            <button className="et-secondary-btn et-status-btn">
              Cek status tiket
            </button>

          </div>

          {/* CARD */}
          <div className="et-manage-card">

            <div className="et-manage-icon">
              <FaCalendarAlt />
            </div>

            <h3>Pesan Grup</h3>

            <p>
              Merencanakan acara untuk lebih dari 20 orang?
              Dapatkan harga spesial dan koordinotor khusus.
            </p>

            <button>
              Pesan kunjungan kelompok
            </button>

          </div>

        </div>
      </section>

    </div>
  );
}