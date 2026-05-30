import "./TicketDetailModal.css";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

export default function TicketDetailModal({
  selected,
  onClose,
}) {
  if (!selected) return null;

  return (
    <div className="td-overlay">

  <div className="td-modal">

    <button
      className="td-close"
      onClick={onClose}
    >
      <FaTimes />
    </button>

    <div className="td-scroll-content">

      <div className="td-header">

        <span className="td-badge">
          Destinasi Populer
        </span>

        <img
          src={selected.image}
          alt={selected.title}
        />

      </div>

      <div className="td-prices">

        <div className="td-price-card">
          <FaCalendarAlt />
          <div>
            <small>Harga Weekday</small>
            <strong>{selected.weekday}</strong>
          </div>
        </div>

        <div className="td-price-card">
          <FaCalendarAlt />
          <div>
            <small>Harga Weekend</small>
            <strong>{selected.weekend}</strong>
          </div>
        </div>

      </div>

      <div className="td-content">

        <h2>{selected.title}</h2>

        <p>
          Nikmati pengalaman wisata edukasi
          yang menyenangkan dengan fasilitas
          lengkap dan area yang nyaman untuk
          seluruh keluarga.
        </p>

        <div className="td-features">

          <div>
            <FaCheckCircle />
            Kolam anak dengan wahana interaktif
          </div>

          <div>
            <FaCheckCircle />
            Gazebo dan area santai keluarga
          </div>

          <div>
            <FaCheckCircle />
            Fasilitas keamanan lengkap
          </div>

          <div>
            <FaCheckCircle />
            Area foto instagramable
          </div>

        </div>

      </div>

      <div className="td-footer">

        <button
          className="td-cancel"
          onClick={onClose}
        >
          Tutup
        </button>

        <button className="td-book">
          Pesan Sekarang
        </button>

      </div>

    </div>

  </div>

</div>
  );
}