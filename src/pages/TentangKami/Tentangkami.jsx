import "./Tentangkami.css";
import HeroBg from "../../assets/images/pemandangan sekolah.png";
import JourneyImg from "../../assets/images/cerita.png";
import { GraduationCap } from "lucide-react";
import { UsersRound } from "lucide-react";
import { TreePine } from "lucide-react";
import { ShieldCheck } from "lucide-react";

export default function TentangKami() {
  return (
    <>
      {/* HERO */}
      <section
        className="tk-hero fade-section"
        style={{ backgroundImage: `url(${HeroBg})` }}
      >
        <div className="tk-hero-overlay"></div>

        <div className="tk-hero-content">
          <span className="tk-hero-tag">TENTANG EDUPARK</span>
          <h1>Tentang Kami</h1>
          <p>
            Pelajari lebih lanjut tentang perjalanan Edupark kami dan komitmen kami terhadap
            pembelajaran berbasis alam.
          </p>
        </div>
      </section>

      {/* PERJALANAN */}
      <section className="tk-journey">
        <div className="tk-journey-container">
          <img src={JourneyImg} alt="Perjalanan Edupark" />

          <div className="tk-journey-text">
            <span className="section-tag">CERITA KAMI</span>
            <h2>Perjalanan Edupark</h2>
            <h4>Akar Perjalanan Kami</h4> 
            <p> 
              Bermula dari keprihatinan kami terhadap data yang menunjukkan peningkatan
              signifikan jumlah anak dengan spektrum autisme di Indonesia, Edupark hadir 
              sebagai solusi ruang tumbuh yang holistik. Kami memahami bahwa metode belajar
              konvensional seringkali belum cukup. Oleh karena itu, Edupark dirancang 
              sebagai wadah untuk mengasah sensorik-motorik, pembelajaran eksperimental, 
              serta kecerdasan tambahan anak melalui interaksi langsung dengan alam.
            </p>
            
            <h4>Oase di Tengah Kepadatan Urban</h4> 
            <p>
              Kami menyadari bahwa bagi masyarakat di kota padat seperti Jakarta,
              Bekasi, dan Bogor, tekanan rutinitas seringkali memicu kejenuhan. 
              Edupark hadir sebagai destinasi "pelarian positif" di mana pengunjung dapat 
              melepas penat sembari mempelajari siklus pertanian berkelanjutan. 
              Kami membawa suasana pedesaan yang asri ke dalam jangkauan masyarakat kota,
              memberikan ketenangan sekaligus ilmu pengetahuan baru.
            </p>
          </div>
        </div>
      </section>

      {/* ALASAN */}
      <section className="tk-reason">
        <span className="section-tag center">KEUNGGULAN KAMI</span>
        <h2>Kenapa memilih Skillage Edupark?</h2>

        <div className="tk-reason-grid">
          <div className="reason-card">
            <div className="icon">
              <UsersRound size={40} color="#22c55e" />
            </div>
            <h4>Pembelajaran Interaktif</h4>
            <p>Metode belajar aktif yang
               melibatkan eksplorasi
               langsung di alam terbuka.</p>
          </div>

          <div className="reason-card">
            <div className="icon">
              <GraduationCap size={40} color="#22c55e" />
            </div>
            <h4>Mentor Ahli</h4>
            <p>Didampingi oleh tenaga
               pendidik profesional dan ahli
               lingkungan berpengalaman.</p>
          </div>

          <div className="reason-card">
            <div className="icon">
              <TreePine size={40} color="#22c55e" />
            </div>
            <h4>Berbasis Alam</h4>
            <p>Kurikulum yang terintegrasi
               dengan ekosistem alam
               yang asri dan terjaga.</p>
          </div>

          <div className="reason-card">
            <div className="icon">
              <ShieldCheck size={40} color="#22c55e" />
            </div>
            <h4>Lingkungan Aman</h4>
            <p>Keamanan fasilitas yang
               terjamin untuk kenyamanan
               belajar seluruh peserta.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="tk-testimonial fade-section">
        <div className="tk-testimonial-header">
          <span className="tk-section-tag">TESTIMONI</span>
          <h2>Lalu apa kata mereka?</h2>
        </div>

        <div className="tk-testimonial-grid">

          <div className="tk-testimonial-card">
            <h4>Sarah Johnson</h4>
            <p>
              "Belajar di Edupark adalah pengalaman paling luar biasa dalam hidup saya.
              Saya tidak hanya belajar teori, tapi melihat langsung bagaimana alam bekerja."
            </p>
            <span className="stars">★★★★★</span>
          </div>

          <div className="tk-testimonial-card">
            <h4>Budi Santoso</h4>
            <p>
              "Fasilitas Edupark sangat mendukung program edukasi luar ruangan.
              Anak-anak menjadi jauh lebih aktif dan antusias dalam setiap kegiatan."
            </p>
            <span className="stars">★★★★★</span>
          </div>

          <div className="tk-testimonial-card">
            <h4>David Chen</h4>
            <p>
              "Sistem pembelajaran yang modern namun tetap dekat dengan alam membuat
              Edupark jadi tempat favorit saya untuk bereksplorasi setiap akhir pekan."
            </p>
            <span className="stars">★★★★★</span>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="tk-cta fade-section">
        <h2>Kunjungi Edupark Hari Ini</h2>
        <p>
          Mulailah petualangan belajar bersama Edupark sekarang juga. 
        </p>
        <a
  href="https://wa.me/6285219801259?text=Halo%20Admin%20Skillage%20Edupark%2C%20saya%20tertarik%20untuk%20mengunjungi%20Edupark%20dan%20memulai%20petualangan%20belajar.%20Boleh%20tahu%20info%20lebih%20lanjut%20mengenai%20program%20dan%20jadwal%20kegiatan%20yang%20tersedia%3F"
  target="_blank"
  rel="noopener noreferrer"
  className="tk-cta-btn"
>
  Hubungi Kami
</a>
      </section>
    </>
  );
}