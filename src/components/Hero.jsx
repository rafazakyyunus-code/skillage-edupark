import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Edupark: Menumbuhkan <br />
          <span>Alam</span> & Pengetahuan
        </h1>

        <p>
          Memberdayakan generasi berikutnya melalui lingkungan pembelajaran luar
          ruangan yang berkelanjutan, menjembatani kesenjangan antara teori kelas
          dan penerapan di dunia nyata.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary">Tentang Kami</button>
          <button className="btn-outline">Selengkapnya</button>
        </div>
      </div>
    </section>
  );
}