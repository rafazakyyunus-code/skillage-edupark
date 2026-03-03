import "./About.css";

export default function About() {
  return (
    <section className="about">
      <div className="about-image">
        <img
          src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238"
          alt="Edupark"
        />
        <div className="experience">
          <h2>15+</h2>
          <p>Years of Excellence</p>
        </div>
      </div>

      <div className="about-content">
        <span className="tag">ABOUT OUR EDUPARK</span>
        <h2>
          Harmoni Alam untuk Tumbuh Kembang dan Ketenangan Jiwa.
        </h2>
        <p>
          Edupark hadir dari sebuah visi besar untuk menjawab dua tantangan 
          nyata di masyarakat kita saat ini: kebutuhan ruang terapi inklusif 
          bagi anak-anak berkebutuhan khusus dan kerinduan warga urban akan 
          ruang terbuka hijau yang edukatif.
        </p>

        <div className="features">
          <div>
            <h4>Eco-Certified</h4>
            <p>Sustainable facilities and practices.</p>
          </div>
          <div>
            <h4>Active Learning</h4>
            <p>Engaging hands-on curriculum.</p>
          </div>
        </div>
      </div>
    </section>
  );
}