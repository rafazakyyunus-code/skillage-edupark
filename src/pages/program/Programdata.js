// ============================================================
//  SINGLE SOURCE OF TRUTH — Program Data
//  Ubah gambar di sini → otomatis berubah di ProgramSection
//  (homepage) DAN di halaman detail masing-masing program.
// ============================================================

import hydroponicHero  from "/src/assets/images/hydroponicc.jpeg";
import peternakanHero  from "/src/assets/images/foto kandang.png";
import workshopHero    from "/src/assets/images/foto bareng bareng.png";
// VenueAlam pakai path publik (/images/...), samakan di sini:
const venueAlamHero = "/images/hero-edupark.png";

const programData = [
  {
    key: "hydroponic",
    title: "Hydroponic",
    desc: "Belajar bercocok tanam modern tanpa tanah. Teknologi masa depan, hasil nyata.",
    heroImage: hydroponicHero,
    path: "/program/hydroponic",
  },
  {
    key: "peternakan",
    title: "Peternakan",
    desc: "Kenali, rawat, dan pelajari hewan ternak langsung di lapangan bersama ahlinya.",
    heroImage: peternakanHero,
    path: "/program/peternakan",
  },
  {
    key: "venue-workshop",
    title: "Venue Workshop",
    desc: "Ruang ideal untuk pelatihan, seminar, dan kegiatan edukatif bersama alam.",
    heroImage: workshopHero,
    path: "/program/venue-workshop",
  },
  {
    key: "venue-alam",
    title: "Venue Alam",
    desc: "Berbagai area alam yang dapat dinikmati dan dipelajari bersama alam semesta.",
    heroImage: venueAlamHero,
    path: "/program/venue-alam",
  },
];

export default programData;