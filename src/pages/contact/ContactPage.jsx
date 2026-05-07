import "./ContactPage.css";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Star,
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="contact-page">

      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-overlay"></div>

        <div className="contact-hero-content">
          <h1>Hubungi Kami</h1>
          <p>
            Hubungi Edupark untuk informasi lebih lanjut mengenai program
            pendidikan dan kunjungan wisata edukasi kami.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="contact-cards">
        <div className="contact-container cards-grid">

          <div className="contact-card">
            <MapPin className="contact-icon" />
            <h3>Alamat</h3>
            <p>
              Jl. Edukasi Raya No. 123, BSD <br />
              City, Tangerang Selatan
            </p>
          </div>

          <div className="contact-card">
            <Phone className="contact-icon" />
            <h3>Telepon</h3>
            <p>+62 (21) 500-1234</p>
            <p>+62 812-3456-7890</p>
          </div>

          <div className="contact-card">
            <Mail className="contact-icon" />
            <h3>Email</h3>
            <p>info@edupark.com</p>
            <p>support@edupark.com</p>
          </div>

          <div className="contact-card">
            <Clock className="contact-icon" />
            <h3>Jam Operasional</h3>
            <p>Senin - Minggu</p>
            <p>08:00 - 17:00 WIB</p>
          </div>

        </div>
      </section>

      {/* MAP */}
      <section className="map-section">
        <div className="contact-container">
          <div className="map-box">

            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18"
              allowFullScreen=""
              loading="lazy"
            ></iframe>

            <div className="map-overlay-box">
              <h3>📍 Peta Lokasi Edupark</h3>
              <p>Klik untuk melihat peta interaktif di Google Maps</p>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
              >
                Lihat di Google Maps
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="testimonial-section">
        <div className="contact-container">

          <div className="section-header">
            <h2>Apa Kata Orang</h2>
            <div className="line"></div>
          </div>

          <div className="testimonial-grid">

            <div className="testimonial-card">
              <div className="stars">
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
              </div>

              <p>
                "Edupark memberikan pengalaman belajar yang luar biasa
                bagi murid-murid saya."
              </p>

              <div className="testimonial-user">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt=""
                />
                <div>
                  <strong>Siti Rahma</strong>
                  <span>Guru SD</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
              </div>

              <p>
                "Tempat wisata edukasi terbaik dan sangat cocok
                untuk keluarga."
              </p>

              <div className="testimonial-user">
                <img
                  src="https://i.pravatar.cc/100?img=15"
                  alt=""
                />
                <div>
                  <strong>Andi Wijaya</strong>
                  <span>Orang Tua Murid</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
              </div>

              <p>
                "Staff ramah dan tempatnya bersih.
                Sangat recommended!"
              </p>

              <div className="testimonial-user">
                <img
                  src="https://i.pravatar.cc/100?img=18"
                  alt=""
                />
                <div>
                  <strong>Budi Santoso</strong>
                  <span>Tour Organizer</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="contact-container">

          <div className="section-header">
            <h2>Pertanyaan yang Sering Diajukan</h2>
            <p>
              Jawaban cepat untuk pertanyaan yang sering diajukan kepada kami.
            </p>
          </div>

          <div className="faq-box">
            <div className="faq-item">
              <div className="faq-question">
                <h4>How to visit Edupark?</h4>
                <ChevronDown size={18} />
              </div>

              <p>
                Anda dapat memesan tiket langsung melalui website kami.
              </p>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <h4>How to contact Edupark?</h4>
                <ChevronDown size={18} />
              </div>

              <p>
                Anda dapat menghubungi kami melalui WhatsApp dan email resmi.
              </p>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <h4>Is Edupark open for public?</h4>
                <ChevronDown size={18} />
              </div>

              <p>
                Ya, Edupark terbuka untuk umum setiap hari.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
