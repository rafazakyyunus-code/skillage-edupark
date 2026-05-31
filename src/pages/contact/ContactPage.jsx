import "./ContactPage.css";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Star,
  Leaf
} from "lucide-react";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqData = [
    {
      question: "Bagaimana cara mengunjungi Edupark?",
      answer:
        "Anda dapat memesan tiket langsung melalui website kami atau datang langsung ke lokasi Edupark.",
    },
    {
      question: "Bagaimana cara menghubungi Edupark?",
      answer:
        "Anda dapat menghubungi kami melalui WhatsApp, email resmi, atau media sosial Edupark.",
    },
    {
      question: "Apakah Edupark terbuka untuk umum?",
      answer:
        "Ya, Edupark terbuka untuk umum setiap hari mulai pukul 08.00 - 17.00 WIB.",
    },
  ];

  return (
    <div className="contact-page">

      {/* HERO */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>

        <div className="contact-hero-content">
          <span className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Leaf size={18} className="text-green-500" />
            Edu Wisata Alam
          </span>

          <h1>Hubungi Edupark</h1>

          <p>
            Nikmati pengalaman belajar di tengah alam hijau yang asri
            bersama Edupark. Hubungi kami untuk informasi program,
            kunjungan sekolah, dan wisata edukasi.
          </p>

          <div className="hero-buttons">
            <a href="#contact-card" className="hero-btn primary">
              Hubungi Sekarang
            </a>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="hero-btn secondary"
            >
              Lihat Lokasi
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="contact-cards" id="contact-card">
        <div className="contact-container cards-grid">

          <div className="contact-card">
            <div className="icon-wrap">
              <MapPin className="contact-icon" />
            </div>

            <h3>Alamat</h3>

            <p>
             Jl. Raya Jonggol-Dayeuh Kp. Tegal Putat, RT.01/RW.06, Sukasirna, Kec. Jonggol, Kabupaten Bogor, Jawa Barat 16830
            </p>
          </div>

          <div className="contact-card">
            <div className="icon-wrap">
              <Phone className="contact-icon" />
            </div>

            <h3>Telepon</h3>

            <p>+62 821-1125-6508</p>
            <p>+62 852-1980-1259 </p>
          </div>

          <div className="contact-card">
            <div className="icon-wrap">
              <Mail className="contact-icon" />
            </div>

            <h3>Email</h3>

            <p>skillageislamic@gmail.com</p>
            
          </div>

          <div className="contact-card">
            <div className="icon-wrap">
              <Clock className="contact-icon" />
            </div>

            <h3>Jam Operasional</h3>

            <p>Senin - Minggu</p>
            <p>08:00 - 17:00 WIB</p>
          </div>

        </div>
      </section>

      {/* MAP */}
<section className="map-section">
  <div className="contact-container">

    <div className="section-header">
      <h2>Explore Edupark</h2>
      <div className="line"></div>
    </div>

    <div className="map-box">

      <iframe
          title="Street View"
          src="https://www.google.com/maps/embed?pb=!4v1778395217229!6m8!1m7!1sCAoSLEFGMVFpcE5ybXh0T0xkY2V1dVh4T2N5c0hMZm1hU1pOV0x4QmJ0cXh5!2m2!1d-6.49517589349693!2d107.052314!3f0!4f0!5f0.7820865974627469"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

      <div className="map-dark-overlay"></div>

      <div className="map-overlay-box">

        <span className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Leaf size={18} className="text-green-500" />
          Edu Wisata Alam
        </span>

        <h3>Street View Edupark</h3>

        <p>
          Jelajahi Edupark dengan tampilan
          Street View 360° interaktif.
        </p>

        <div className="map-buttons">

          <a
            href="https://maps.google.com/?q=Skill+Village+Islamic+School"
            target="_blank"
            rel="noreferrer"
            className="map-btn primary"
          >
            Buka Maps
          </a>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Skill+Village+Islamic+School"
            target="_blank"
            rel="noreferrer"
            className="map-btn secondary"
          >
            Lokasi Saya
          </a>

        </div>

      </div>

    </div>

  </div>
</section>

      {/* TESTIMONIAL */}
      <section className="testimonial-section">
        <div className="contact-container">

          <div className="section-header">
            <h2>Apa Kata Mereka</h2>
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
                dengan suasana alam yang sangat nyaman."
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
                "Tempatnya adem, hijau, bersih, dan sangat cocok
                untuk wisata keluarga."
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
                "Staff sangat ramah dan area edukasinya keren banget!"
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
            <h2>Pertanyaan Umum</h2>

            <p>
              Beberapa pertanyaan yang sering ditanyakan pengunjung.
            </p>
          </div>

          <div className="faq-box">

            {faqData.map((faq, index) => (
              <div
                className={`faq-item ${
                  openFaq === index ? "active" : ""
                }`}
                key={index}
              >
                <div
                  className="faq-question"
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                >
                  <h4>{faq.question}</h4>

                  <ChevronDown
                    size={20}
                    className={
                      openFaq === index ? "rotate" : ""
                    }
                  />
                </div>

                <div
                  className={`faq-answer ${
                    openFaq === index ? "show" : ""
                  }`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

    </div>
  );
}