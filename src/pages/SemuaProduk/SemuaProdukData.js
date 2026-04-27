// src/pages/SemuaProduk/semuaProdukData.js

export const PRODUCTS = [
  {
    id: 1,
    name: "Telur Ayam",
    category: "Hewan Peternakan",
    categoryLabel: "Hewan Peternakan",
    price: 125000,
    desc: "Telur ayam segar berkualitas tinggi langsung dari peternakan Edupark, bebas dari bahan kimia berbahaya.",
    badge: "EDUKASI",
    badgeColor: "green",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=280&fit=crop",
  },
  {
    id: 2,
    name: "Kangkung",
    category: "Sayuran",
    categoryLabel: "Sayuran",
    price: 45000,
    desc: "Kangkung segar hasil budidaya hidroponik tanpa pestisida, dipanen setiap pagi dari kebun Edupark.",
    badge: "NEW",
    badgeColor: "green",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=280&fit=crop",
  },
  {
    id: 3,
    name: "Lele",
    category: "Hewan Peternakan",
    categoryLabel: "Hewan Peternakan",
    price: 45000,
    desc: "Lele segar hasil budidaya kolam dengan pakan organik berkualitas, siap olah untuk kebutuhan dapur.",
    badge: "NEW",
    badgeColor: "green",
    image: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=280&fit=crop",
  },
  {
    id: 4,
    name: "Kambing",
    category: "Hewan Peternakan",
    categoryLabel: "Hewan Peternakan",
    price: 55000,
    desc: "Kambing sehat dari peternakan Edupark, dirawat secara alami dengan pakan hijauan segar berkualitas.",
    badge: null,
    badgeColor: null,
    image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=400&h=280&fit=crop",
  },
  {
    id: 5,
    name: "Pupuk Bokasi",
    category: "Saprodi",
    categoryLabel: "Saprodi",
    price: 35000,
    desc: "Pupuk bokasi organik fermentasi untuk meningkatkan kesuburan tanah secara alami dan ramah lingkungan.",
    badge: "HOT",
    badgeColor: "red",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=280&fit=crop",
  },
  {
    id: 6,
    name: "Kacang Panjang",
    category: "Sayuran",
    categoryLabel: "Sayuran",
    price: 25000,
    desc: "Kacang panjang segar dipanen langsung dari kebun organik Edupark, kaya serat dan nutrisi alami.",
    badge: null,
    badgeColor: null,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=280&fit=crop",
  },
  {
    id: 7,
    name: "Bayam Organik",
    category: "Sayuran",
    categoryLabel: "Sayuran",
    price: 18000,
    desc: "Bayam organik segar tanpa pestisida, kaya zat besi dan vitamin, dipanen setiap pagi dari kebun kami.",
    badge: "NEW",
    badgeColor: "green",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=280&fit=crop",
  },
  {
    id: 8,
    name: "Ayam Kampung",
    category: "Hewan Peternakan",
    categoryLabel: "Hewan Peternakan",
    price: 95000,
    desc: "Ayam kampung asli diternakkan secara alami, dagingnya lebih gurih dan sehat tanpa hormon tambahan.",
    badge: "EDUKASI",
    badgeColor: "green",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=280&fit=crop",
  },
  {
    id: 9,
    name: "Benih Padi",
    category: "Saprodi",
    categoryLabel: "Saprodi",
    price: 85000,
    desc: "Benih padi unggul varietas IR64 dengan daya tumbuh tinggi, tahan hama dan penyakit.",
    badge: null,
    badgeColor: null,
    image: "https://images.unsplash.com/photo-1536054803359-5a8e9c9b2e33?w=400&h=280&fit=crop",
  },
  {
    id: 10,
    name: "Tomat Cherry",
    category: "Sayuran",
    categoryLabel: "Sayuran",
    price: 32000,
    desc: "Tomat cherry manis segar hasil hidroponik, rasa manis alami sempurna untuk salad dan masakan.",
    badge: "HOT",
    badgeColor: "red",
    image: "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=280&fit=crop",
  },
  {
    id: 11,
    name: "Pupuk NPK Organik",
    category: "Saprodi",
    categoryLabel: "Saprodi",
    price: 65000,
    desc: "Pupuk NPK organik lengkap untuk pertumbuhan tanaman optimal, aman bagi tanah dan ekosistem.",
    badge: "EDUKASI",
    badgeColor: "green",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=280&fit=crop",
  },
  {
    id: 12,
    name: "Ikan Nila Segar",
    category: "Hewan Peternakan",
    categoryLabel: "Hewan Peternakan",
    price: 42000,
    desc: "Ikan nila segar hasil budidaya kolam organik, dipanen langsung untuk menjaga kesegaran optimal.",
    badge: "NEW",
    badgeColor: "green",
    image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=280&fit=crop",
  },
];

export function filterProducts(products, search, category) {
  return products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "Semua Produk" || p.category === category;

    return matchSearch && matchCategory;
  });
}
export const CATEGORIES = [
  "Semua Produk",
  "Hewan Peternakan",
  "Sayuran",
  "Saprodi",
];

export const SORT_OPTIONS = [
  { value: "terbaru",    label: "Terbaru" },
  { value: "terlaris",   label: "Terlaris" },
  { value: "harga-asc",  label: "Harga Terendah" },
  { value: "harga-desc", label: "Harga Tertinggi" },
];

export const ITEMS_PER_PAGE = 6;

export function formatRp(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

export function getPages(currentPage, totalPages) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
  if (currentPage >= totalPages - 2)
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}