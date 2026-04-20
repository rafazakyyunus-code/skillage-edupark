import "./ProgramSection.css";

export default function ProgramSection() {
  const programs = [
    {
      title: "Hydroponic",
      desc: "Exploring plant biology and structures in our living laboratory.",
      img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4"
    },
    {
      title: "Intergreatif farm",
      desc: "Studying local bird species and insect ecosystems in protected habitats.",
      img: "https://images.unsplash.com/photo-1598514983217-8b8a8dbe5280"
    },
    {
      title: "Maggot",
      desc: "Hands-on organic farming skills from seeding to harvesting.",
      img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5"
    },
    {
      title: "Venue alam",
      desc: "Creative expression using natural pigments and organic materials.",
      img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
    }
  ];

  return (
    <section className="program">
      <div className="program-header">
        <h2>Program Kami</h2>
        <p>
          Discover our diverse range of interactive programs designed to inspire environmental leadership.
        </p>
      </div>

      <div className="program-grid">
        {programs.map((item, index) => (
          <div key={index} className="program-card">
            <img src={item.img} alt={item.title} />
            <div className="program-content">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <span>Learn More →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}