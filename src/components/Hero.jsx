import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Edupark: Nurturing <br />
          <span>Nature</span> & Knowledge
        </h1>

        <p>
          Empowering the next generation through sustainable outdoor learning 
          environments that bridge the gap between classroom theory and natural world applications.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary">Tentang Kami</button>
          <button className="btn-outline">Selengkapnya</button>
        </div>
      </div>
    </section>
  );
}