import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const CATEGORIES = ["Hewan Peternakan", "Sayuran", "Saprodi"];
const BADGE_OPTIONS = [
  { value: "",        label: "Tidak Ada" },
  { value: "NEW",     label: "NEW" },
  { value: "HOT",     label: "HOT" },
  { value: "EDUKASI", label: "EDUKASI" },
];

const CATEGORY_COLORS = {
  "Education Technology":  { bg: "#E8F4FD", text: "#1565C0" },
  "AI & Machine Learning": { bg: "#E8F5E9", text: "#2E7D32" },
  "STEM Education":        { bg: "#FFF3E0", text: "#E65100" },
  "Early Childhood":       { bg: "#FFF3E0", text: "#E65100" },
};
const STATUS_COLORS = {
  pending:   { bg: "#FFF8E1", text: "#F57F17", label: "Pending Review" },
  revision:  { bg: "#FBE9E7", text: "#BF360C", label: "Revision" },
  published: { bg: "#E8F5E9", text: "#1B5E20", label: "Published" },
};

/* ─────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────── */
const ic = (d, size = 18) => (active) =>
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>;

function DashboardIcon({ active }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function ReviewIcon({ active }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
}
function WritersIcon({ active }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function SettingsIcon({ active }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}
function ProdukIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",       Icon: DashboardIcon },
  { id: "review",    label: "Review Articles", Icon: ReviewIcon },
  { id: "writers",   label: "Writer Directory",Icon: WritersIcon },
  { id: "produk",    label: "Produk",           Icon: ProdukIcon },
];

/* ─────────────────────────────────────────────
   SETTINGS VIEW
───────────────────────────────────────────── */
function EditorSettingsView({ onLogout }) {
  const [name, setName]   = useState("Editor Edupark");
  const [email, setEmail] = useState("editor@edupark.id");
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Settings</h1>
        <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>Kelola profil dan preferensi akun editor Anda</p>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Informasi Profil</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Nama Lengkap</label>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
            style={{ padding: "9px 20px", background: "#1B3A2A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Simpan Perubahan
          </button>
          {saved && <span style={{ fontSize: 13, color: "#16a34a" }}>✓ Tersimpan!</span>}
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Akun</h3>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>Keluar dari sesi editor portal Anda.</p>
        <button onClick={onLogout}
          style={{ padding: "9px 20px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Logout
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BLANK FORM STATE
───────────────────────────────────────────── */
const BLANK = {
  name: "",
  category: "Hewan Peternakan",
  price: "",
  desc: "",
  badge: "",
  badgeColor: "green",
  image: "",
  feature1: "Produk berkualitas tinggi dari peternakan organik.",
  feature2: "Hands-on experience dengan standar industri Fortune 500.",
  feature3: "Mendapatkan dukungan penuh dari tim ahli kami.",
};

/* ─────────────────────────────────────────────
   PRODUK MANAGEMENT VIEW
───────────────────────────────────────────── */
function ProdukView() {
  const db = getDatabase();

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [view, setView]             = useState("list"); // "list" | "form" | "detail"
  const [form, setForm]             = useState(BLANK);
  const [editId, setEditId]         = useState(null);
  const [saving, setSaving]         = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCat, setFilterCat]   = useState("Semua");
  const [toast, setToast]           = useState("");

  /* ── realtime listener ── */
  useEffect(() => {
    const produkRef = ref(db, "produk");
    const unsub = onValue(produkRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([key, val]) => ({ ...val, firebaseId: key }));
        setProducts(list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
      } else {
        setProducts([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  /* ── save (add / edit) ── */
  const handleSave = async () => {
    if (!form.name.trim()) return alert("Nama produk wajib diisi.");
    if (!form.price || isNaN(Number(form.price))) return alert("Harga harus angka.");
    if (!form.desc.trim()) return alert("Deskripsi wajib diisi.");
    if (!form.image.trim()) return alert("URL foto produk wajib diisi.");

    setSaving(true);
    try {
      const payload = {
        name:        form.name.trim(),
        category:    form.category,
        categoryLabel: form.category,
        price:       Number(form.price),
        desc:        form.desc.trim(),
        badge:       form.badge || null,
        badgeColor:  form.badge ? (form.badge === "HOT" ? "red" : "green") : null,
        image:       form.image.trim(),
        feature1:    form.feature1.trim(),
        feature2:    form.feature2.trim(),
        feature3:    form.feature3.trim(),
        updatedAt:   Date.now(),
      };

      if (editId) {
        await update(ref(db, `produk/${editId}`), payload);
        showToast("✓ Produk berhasil diperbarui!");
      } else {
        await push(ref(db, "produk"), { ...payload, createdAt: Date.now() });
        showToast("✓ Produk berhasil ditambahkan!");
      }

      setView("list");
      resetForm();
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(BLANK);
    setEditId(null);
  };

  const handleEdit = (p) => {
    setForm({
      name:      p.name,
      category:  p.category,
      price:     String(p.price),
      desc:      p.desc,
      badge:     p.badge || "",
      badgeColor:p.badgeColor || "green",
      image:     p.image || "",
      feature1:  p.feature1 || "Produk berkualitas tinggi dari peternakan organik.",
      feature2:  p.feature2 || "Hands-on experience dengan standar industri Fortune 500.",
      feature3:  p.feature3 || "Mendapatkan dukungan penuh dari tim ahli kami.",
    });
    setEditId(p.firebaseId);
    setView("form");
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `produk/${id}`));
      showToast("🗑 Produk dihapus.");
      setDeleteConfirm(null);
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  /* ── filtered list ── */
  const displayed = filterCat === "Semua"
    ? products
    : products.filter(p => p.category === filterCat);

  /* ════════════════ RENDER ════════════════ */

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
      <div style={{ textAlign: "center", color: "#6B7280" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
        <div style={{ fontSize: 14 }}>Memuat data produk...</div>
      </div>
    </div>
  );

  /* ── FORM (tambah / edit) ── */
  if (view === "form") return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => { setView("list"); resetForm(); }}
          style={{ background: "none", border: "none", color: "#6B7280", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
          ← Kembali
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
          {editId ? "Edit Produk" : "Tambah Produk Baru"}
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Foto Produk */}
          <div style={card}>
            <label style={sectionLabel}>📷 Foto Produk</label>
            <div style={{ marginBottom: 10 }}>
              <label style={fieldLabel}>URL Gambar Produk *</label>
              <input
                value={form.image}
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                placeholder="https://i.ibb.co/... atau https://images.unsplash.com/..."
                style={input}
              />
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: "6px 0 0" }}>
                Upload foto ke <a href="https://imgbb.com" target="_blank" rel="noreferrer" style={{ color: "#1B3A2A" }}>imgbb.com</a> (gratis) lalu paste URL-nya di sini.
              </p>
            </div>
            {/* Preview */}
            {form.image && (
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden", marginTop: 8 }}>
                <img src={form.image} alt="preview"
                  style={{ width: "100%", maxHeight: 220, objectFit: "cover" }}
                  onError={e => { e.target.style.display = "none"; }} />
              </div>
            )}
          </div>

          {/* Info Utama */}
          <div style={card}>
            <label style={sectionLabel}>📝 Informasi Produk</label>

            <div style={{ marginBottom: 12 }}>
              <label style={fieldLabel}>Nama Produk *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="cth. Telur Ayam Kampung" style={input} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={fieldLabel}>Kategori *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={input}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={fieldLabel}>Harga (Rp) *</label>
                <input type="number" value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="45000" style={input} />
              </div>
            </div>

            <div>
              <label style={fieldLabel}>Deskripsi Produk *</label>
              <textarea value={form.desc}
                onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                placeholder="Tulis deskripsi singkat produk..."
                style={{ ...input, height: 90, resize: "vertical" }} />
            </div>
          </div>

          {/* Fitur / Keunggulan */}
          <div style={card}>
            <label style={sectionLabel}>✅ Keunggulan Produk (muncul di halaman detail)</label>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ marginBottom: 10 }}>
                <label style={fieldLabel}>Keunggulan {n}</label>
                <input
                  value={form[`feature${n}`]}
                  onChange={e => setForm(f => ({ ...f, [`feature${n}`]: e.target.value }))}
                  placeholder={`Keunggulan ${n}...`}
                  style={input}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Badge */}
          <div style={card}>
            <label style={sectionLabel}>🏷️ Badge Produk</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {BADGE_OPTIONS.map(opt => (
                <button key={opt.value}
                  onClick={() => setForm(f => ({ ...f, badge: opt.value }))}
                  style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    border: form.badge === opt.value ? "2px solid #1B3A2A" : "2px solid #E5E7EB",
                    background: form.badge === opt.value ? "#1B3A2A" : "#fff",
                    color: form.badge === opt.value ? "#fff" : "#374151",
                    cursor: "pointer",
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {form.badge && form.badge !== "" && (
              <div style={{ marginTop: 12 }}>
                <label style={fieldLabel}>Warna Badge</label>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  {[["green", "#16c35b"], ["red", "#ef4444"]].map(([val, hex]) => (
                    <button key={val} onClick={() => setForm(f => ({ ...f, badgeColor: val }))}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8,
                        border: form.badgeColor === val ? `2px solid ${hex}` : "2px solid #E5E7EB",
                        background: form.badgeColor === val ? hex + "22" : "#fff",
                        cursor: "pointer", fontSize: 12, fontWeight: 600, color: hex }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: hex, display: "inline-block" }} />
                      {val === "green" ? "Hijau" : "Merah"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Card */}
          <div style={card}>
            <label style={sectionLabel}>👁️ Preview Card</label>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ position: "relative", background: "#f0f0f0", height: 130 }}>
                {form.image
                  ? <img src={form.image} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 32 }}>🖼️</div>
                }
                {form.badge && (
                  <span style={{
                    position: "absolute", top: 8, left: 8,
                    padding: "3px 10px", fontSize: 10, fontWeight: 700, borderRadius: 4, color: "#fff",
                    background: form.badgeColor === "red" ? "#ef4444" : "#16c35b",
                  }}>{form.badge}</span>
                )}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#16c35b", letterSpacing: 1, marginBottom: 4 }}>
                  {form.category.toUpperCase()}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                  {form.name || "Nama Produk"}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#16c35b" }}>
                  Rp {form.price ? Number(form.price).toLocaleString("id-ID") : "0"}
                </div>
              </div>
            </div>
          </div>

          {/* Simpan */}
          <button onClick={handleSave} disabled={saving}
            style={{ width: "100%", padding: "14px", background: saving ? "#9CA3AF" : "#1B3A2A",
              color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Menyimpan..." : editId ? "💾 Perbarui Produk" : "➕ Simpan Produk"}
          </button>
          <button onClick={() => { setView("list"); resetForm(); }}
            style={{ width: "100%", padding: "12px", background: "#fff", border: "1px solid #E5E7EB",
              color: "#374151", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );

  /* ── LIST VIEW ── */
  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, background: "#1B3A2A", color: "#fff",
          padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, zIndex: 999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Manajemen Produk</h1>
          <p style={{ color: "#6B7280", fontSize: 14, margin: "4px 0 0" }}>
            {products.length} produk · data realtime dari Firebase
          </p>
        </div>
        <button onClick={() => { resetForm(); setView("form"); }}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
            background: "#1B3A2A", color: "#fff", border: "none", borderRadius: 10,
            fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          + Tambah Produk
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["Semua", ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: filterCat === cat ? 600 : 400,
              border: "1px solid " + (filterCat === cat ? "#1B3A2A" : "#E5E7EB"),
              background: filterCat === cat ? "#1B3A2A" : "#fff",
              color: filterCat === cat ? "#fff" : "#374151", cursor: "pointer" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Empty */}
      {displayed.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
          <p style={{ color: "#6B7280", fontSize: 14 }}>Belum ada produk. Klik "Tambah Produk" untuk mulai.</p>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {displayed.map(p => (
          <div key={p.firebaseId} style={{
            background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12,
            overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex", flexDirection: "column",
          }}>
            {/* Image */}
            <div style={{ position: "relative", height: 160, background: "#f0f0f0", overflow: "hidden" }}>
              {p.image
                ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 40 }}>🌿</div>
              }
              {p.badge && (
                <span style={{
                  position: "absolute", top: 8, left: 8,
                  padding: "3px 10px", fontSize: 10, fontWeight: 700, borderRadius: 4, color: "#fff",
                  background: p.badgeColor === "red" ? "#ef4444" : "#16c35b",
                }}>{p.badge}</span>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#16c35b", letterSpacing: 1, marginBottom: 4 }}>
                {p.category.toUpperCase()}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#16c35b", marginBottom: 8 }}>
                Rp {p.price.toLocaleString("id-ID")}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, flex: 1,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {p.desc}
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 8 }}>
              <button onClick={() => handleEdit(p)}
                style={{ flex: 1, padding: "8px", background: "#E8F4EE", color: "#1B3A2A",
                  border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                ✏️ Edit
              </button>
              <button onClick={() => setDeleteConfirm(p)}
                style={{ flex: 1, padding: "8px", background: "#FEF2F2", color: "#DC2626",
                  border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                🗑 Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 28, borderRadius: 14, width: 340, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", color: "#111827", fontSize: 17, fontWeight: 700 }}>Hapus Produk?</h3>
            <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 20 }}>
              Produk <strong>"{deleteConfirm.name}"</strong> akan dihapus secara permanen dari database.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #E5E7EB",
                  background: "#fff", color: "#374151", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirm.firebaseId)}
                style={{ padding: "9px 20px", borderRadius: 8, border: "none",
                  background: "#DC2626", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARED STYLE SHORTCUTS
───────────────────────────────────────────── */
const card = {
  background: "#fff", border: "1px solid #E5E7EB",
  borderRadius: 12, padding: "20px 22px",
};
const sectionLabel = {
  display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 14,
};
const fieldLabel = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 5,
};
const input = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  border: "1px solid #D1D5DB", fontSize: 14, boxSizing: "border-box",
  fontFamily: "inherit", color: "#111827", outline: "none",
};

/* ─────────────────────────────────────────────
   MAIN EDITOR PORTAL
───────────────────────────────────────────── */
export default function EditorPortal({ externalArticles = [], onUpdateStatus, currentUser }) {
  const [activeNav, setActiveNav]         = useState("dashboard");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [feedback, setFeedback]           = useState("");
  const [showConfirm, setShowConfirm]     = useState(null);
  const [statusFilter, setStatusFilter]   = useState("pending");

  const articles  = externalArticles;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

  const handleAction = async (id, status, notes) => {
    if (onUpdateStatus) await onUpdateStatus(id, status, notes);
    setShowConfirm(status === "published" ? "published_done" : "revision_done");
  };

  const handleCloseModal = () => {
    setShowConfirm(null); setSelectedArticle(null); setFeedback(""); setActiveNav("dashboard");
  };

  const handleLogout = async () => {
    try { await signOut(getAuth()); } catch (err) { console.error(err); }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7f5", fontFamily: "sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 220, background: "#1b3a2a", height: "100vh", position: "fixed", display: "flex", flexDirection: "column", zIndex: 100 }}>
        {/* Brand */}
        <div style={{ padding: "18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.12)", width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 15, fontFamily: "Georgia, serif", lineHeight: 1.2 }}>Edupark</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Editor Portal</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeNav === id;
            return (
              <button key={id}
                onClick={() => { setActiveNav(id); setSelectedArticle(null); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "10px 18px",
                  background: active ? "rgba(255,255,255,0.13)" : "transparent",
                  border: "none", cursor: "pointer",
                  color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  textAlign: "left", fontSize: 13, fontFamily: "inherit",
                  transition: "background 0.15s, color 0.15s", boxSizing: "border-box",
                }}>
                <Icon active={active} /> {label}
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div style={{ padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => { setActiveNav("settings"); setSelectedArticle(null); }}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 18px",
              background: activeNav === "settings" ? "rgba(255,255,255,0.13)" : "transparent",
              border: "none", cursor: "pointer",
              color: activeNav === "settings" ? "#fff" : "rgba(255,255,255,0.55)",
              textAlign: "left", fontSize: 13, fontFamily: "inherit",
              transition: "background 0.15s, color 0.15s", boxSizing: "border-box",
            }}>
            <SettingsIcon active={activeNav === "settings"} /> Settings
          </button>
        </div>

        {/* User */}
        <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2d6a4f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {currentUser?.displayName ? currentUser.displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "ED"}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{currentUser?.displayName || "Editor"}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>Editor Portal</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, marginLeft: 220, padding: "32px 40px" }}>

        {/* DASHBOARD */}
        {activeNav === "dashboard" && !selectedArticle && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Overview</h1>
                <p style={{ color: "#6B7280", fontSize: 13, margin: "4px 0 0" }}>Selamat datang kembali, Editor.</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Pending Review", val: articles.filter(a => a.status === "pending").length, color: "#F57F17" },
                { label: "Published",      val: articles.filter(a => a.status === "published").length, color: "#2E7D32" },
                { label: "In Revision",    val: articles.filter(a => a.status === "revision").length, color: "#BF360C" },
                { label: "Total Views",    val: totalViews, color: "#1565C0" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.val.toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Antrean Artikel Terbaru</h2>
                <button onClick={() => setActiveNav("review")} style={{ fontSize: 13, color: "#1B3A2A", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Lihat semua →</button>
              </div>
              {articles.filter(a => a.status === "pending").length === 0 ? (
                <p style={{ color: "#6B7280", fontSize: 13, margin: 0 }}>Tidak ada antrean artikel baru saat ini.</p>
              ) : (
                articles.filter(a => a.status === "pending").map(a => (
                  <div key={a.id} onClick={() => { setSelectedArticle(a); setActiveNav("review"); }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F3F4F6", cursor: "pointer" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#E8F4EE" }}>
                      {a.image ? <img src={a.image} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📄</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>Oleh {a.author} · {a.category}</div>
                    </div>
                    <span style={{ fontSize: 11, background: "#FFF8E1", color: "#F57F17", padding: "4px 8px", borderRadius: 6, fontWeight: 600 }}>Pending</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* REVIEW */}
        {activeNav === "review" && !selectedArticle && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Review Articles</h1>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {["pending", "published", "revision"].map(tab => (
                <button key={tab} onClick={() => setStatusFilter(tab)}
                  style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #E5E7EB",
                    background: statusFilter === tab ? "#1B3A2A" : "#fff",
                    color: statusFilter === tab ? "#fff" : "#4B5563",
                    fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {articles.filter(a => a.status === statusFilter).length === 0 ? (
                <p style={{ color: "#6B7280", fontSize: 14 }}>Tidak ada artikel dalam kategori ini.</p>
              ) : (
                articles.filter(a => a.status === statusFilter).map(article => {
                  const sc = STATUS_COLORS[article.status] || STATUS_COLORS.pending;
                  const cc = CATEGORY_COLORS[article.category] || { bg: "#F3F4F6", text: "#374151" };
                  return (
                    <div key={article.id} onClick={() => setSelectedArticle(article)}
                      style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12,
                        padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#E8F4EE" }}>
                        {article.image ? <img src={article.image} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📄</div>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 10, background: cc.bg, color: cc.text, borderRadius: 4, padding: "2px 6px", fontWeight: 700 }}>{article.category ? article.category.toUpperCase() : "GENERAL"}</span>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "6px 0 4px" }}>{article.title}</h3>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>Oleh <strong style={{ color: "#374151" }}>{article.author}</strong> · {article.wordCount} kata</div>
                      </div>
                      <span style={{ fontSize: 11, background: sc.bg, color: sc.text, padding: "4px 10px", borderRadius: 6, fontWeight: 600, flexShrink: 0 }}>{sc.label}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ARTICLE DETAIL */}
        {selectedArticle && activeNav !== "settings" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "flex-start" }}>
            <div>
              <button onClick={() => setSelectedArticle(null)} style={{ background: "none", border: "none", color: "#6B7280", fontSize: 13, cursor: "pointer", marginBottom: 16, fontWeight: 500 }}>← Kembali ke daftar</button>
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "28px 32px" }}>
                {selectedArticle.image && <img src={selectedArticle.image} alt={selectedArticle.title} style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 10, marginBottom: 20 }} />}
                <span style={{ fontSize: 11, background: (CATEGORY_COLORS[selectedArticle.category] || { bg: "#F3F4F6" }).bg, color: (CATEGORY_COLORS[selectedArticle.category] || { text: "#374151" }).text, borderRadius: 4, padding: "3px 10px", fontWeight: 700 }}>{selectedArticle.category}</span>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "16px 0 8px", fontFamily: "Georgia, serif" }}>{selectedArticle.title}</h1>
                <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>Oleh <strong style={{ color: "#374151" }}>{selectedArticle.author}</strong> · {selectedArticle.wordCount} kata{selectedArticle.views > 0 && ` · ${selectedArticle.views.toLocaleString()} views`}</div>
                <div style={{ color: "#374151", fontSize: 15, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
              </div>
            </div>
            <div style={{ position: "sticky", top: 24 }}>
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Aksi Editor</h3>
                {selectedArticle.status === "pending" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Berikan catatan perbaikan..." style={{ width: "100%", height: 80, padding: 10, borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 12, resize: "none", boxSizing: "border-box" }} />
                    <button onClick={() => { if (!feedback.trim()) { alert("Mohon isi alasan revisi"); return; } handleAction(selectedArticle.id, "revision", feedback); }} style={{ width: "100%", padding: "10px", background: "#BF360C", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Kembalikan (Minta Revisi)</button>
                    <button onClick={() => handleAction(selectedArticle.id, "published", "")} style={{ width: "100%", padding: "10px", background: "#2E7D32", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Setujui & Publish Artikel</button>
                  </div>
                )}
                {selectedArticle.status !== "pending" && (
                  <div>
                    <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6B7280" }}>Artikel ini berstatus <strong style={{ color: "#111827" }}>{selectedArticle.status}</strong>.</p>
                    {selectedArticle.feedback && (
                      <div style={{ background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 8, padding: 12, fontSize: 12, color: "#5D4037" }}>
                        <strong>Catatan revisi:</strong>
                        <p style={{ margin: "6px 0 0" }}>{selectedArticle.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* WRITERS */}
        {activeNav === "writers" && !selectedArticle && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Writer Directory</h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>Daftar semua penulis yang terdaftar di platform Edupark</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {articles.length === 0 ? (
                <p style={{ color: "#6B7280", fontSize: 14 }}>Belum ada data penulis.</p>
              ) : (
                [...new Map(articles.map(a => [a.author, {
                  name: a.author, role: a.role || "Writer",
                  count: articles.filter(x => x.author === a.author).length,
                  published: articles.filter(x => x.author === a.author && x.status === "published").length,
                }])).values()].map(w => (
                  <div key={w.name} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 18px", textAlign: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E8F4EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#1B3A2A", margin: "0 auto 12px" }}>
                      {w.name ? w.name.split(" ").map(n => n[0]).join("") : "W"}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{w.name}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>{w.role}</div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      <div style={{ fontSize: 12, background: "#E8F4EE", color: "#1B3A2A", borderRadius: 20, padding: "3px 12px", fontWeight: 600 }}>{w.count} artikel</div>
                      <div style={{ fontSize: 12, background: "#E8F5E9", color: "#1B5E20", borderRadius: 20, padding: "3px 12px", fontWeight: 600 }}>{w.published} published</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PRODUK */}
        {activeNav === "produk" && <ProdukView />}

        {/* SETTINGS */}
        {activeNav === "settings" && <EditorSettingsView onLogout={handleLogout} />}

        {/* MODAL */}
        {showConfirm && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "#fff", padding: 24, borderRadius: 16, width: 340, textAlign: "center" }}>
              <h3 style={{ margin: "0 0 8px", color: "#111827" }}>Aksi Berhasil!</h3>
              <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 20 }}>
                {showConfirm === "published_done"
                  ? "Artikel telah disetujui dan berhasil dipublikasikan secara realtime."
                  : "Status revisi dan catatan feedback telah dikirimkan kembali ke penulis."}
              </p>
              <button onClick={handleCloseModal} style={{ padding: "8px 24px", background: "#1B3A2A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Tutup</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}