import { useState, useEffect, useRef } from "react";
import { getAuth, signOut, updateProfile, updateEmail } from "firebase/auth";
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";
import { MapPin } from 'lucide-react';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const DEFAULT_PRODUK_CATEGORIES = ["Hewan Peternakan", "Sayuran", "Saprodi"];
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
function GalleryIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}
function AttractionsIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function TicketsOnlineIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
      <line x1="9" y1="9" x2="9" y2="9.01"/>
      <line x1="9" y1="12" x2="9" y2="12.01"/>
      <line x1="9" y1="15" x2="9" y2="15.01"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   INLINE SVG ICONS (UI use – not sidebar)
───────────────────────────────────────────── */
const Ico = ({ d, size = 16, color = "currentColor", strokeWidth = 2, extra = null }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", flexShrink: 0 }}>
    {d}{extra}
  </svg>
);
// Specific icon shortcuts
const IcoImage    = ({ size=16, color="currentColor" }) => <Ico size={size} color={color} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>} />;
const IcoInfo     = ({ size=16, color="currentColor" }) => <Ico size={size} color={color} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>} />;
const IcoStar     = ({ size=16, color="currentColor" }) => <Ico size={size} color={color} d={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>} />;
const IcoTag      = ({ size=16, color="currentColor" }) => <Ico size={size} color={color} d={<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>} />;
const IcoEye      = ({ size=16, color="currentColor" }) => <Ico size={size} color={color} d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />;
const IcoEdit     = ({ size=16, color="currentColor" }) => <Ico size={size} color={color} d={<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>} />;
const IcoTrash    = ({ size=16, color="currentColor" }) => <Ico size={size} color={color} d={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>} />;
const IcoPackage  = ({ size=40, color="currentColor" }) => <Ico size={size} color={color} d={<><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>} />;
const IcoLoader   = ({ size=28, color="#9CA3AF" }) => <Ico size={size} color={color} d={<><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></>} />;
const IcoAlert    = ({ size=36, color="#DC2626" }) => <Ico size={size} color={color} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>} />;
const IcoCheck    = ({ size=14, color="#16a34a" }) => <Ico size={size} color={color} d={<polyline points="20 6 9 17 4 12"/>} />;
const IcoSave     = ({ size=16, color="currentColor" }) => <Ico size={size} color={color} d={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>} />;
const IcoPlus     = ({ size=16, color="currentColor" }) => <Ico size={size} color={color} d={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />;
const IcoDoc      = ({ size=22, color="#9CA3AF" }) => <Ico size={size} color={color} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>} />;
const IcoLeaf     = ({ size=40, color="#9CA3AF" }) => <Ico size={size} color={color} d={<path d="M2 22 A10 10 0 0 1 12 12 A10 10 0 0 1 22 2 A10 10 0 0 1 12 12 A10 10 0 0 1 2 22Z"/>} />;

const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",        Icon: DashboardIcon },
  { id: "review",      label: "Review Articles",  Icon: ReviewIcon },
  { id: "writers",     label: "Writer Directory", Icon: WritersIcon },
  { id: "produk",      label: "Produk",            Icon: ProdukIcon },
  { id: "gallery",     label: "Gallery",           Icon: GalleryIcon },
  { id: "attractions",  label: "Attractions",       Icon: AttractionsIcon },
  { id: "ticketonline", label: "Tiket Online",      Icon: TicketsOnlineIcon },
];

/* ─────────────────────────────────────────────
   SETTINGS VIEW
───────────────────────────────────────────── */
function EditorSettingsView({ onLogout, onNameChange }) {
  const auth = getAuth();
  const db   = getDatabase();
  const currentUser = auth.currentUser;

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState(currentUser?.email || "");
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState(null);
  const [errMsg,  setErrMsg]  = useState("");

  // DB adalah sumber kebenaran — Firebase Auth displayName tidak reliable setelah re-login
  useEffect(() => {
    if (!currentUser?.uid) return;
    const userRef = ref(db, `users/${currentUser.uid}`);
    const unsub = onValue(userRef, (snap) => {
      const data = snap.val();
      setName(data?.displayName || currentUser?.displayName || "");
      setEmail(data?.email || currentUser?.email || "");
    });
    return () => unsub();
  }, [currentUser?.uid]);

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1px solid #D1D5DB", fontSize: 14, boxSizing: "border-box",
    fontFamily: "inherit", outline: "none",
  };

  const handleSave = async () => {
    if (!name.trim()) { setErrMsg("Nama tidak boleh kosong."); setStatus("error"); return; }
    if (!email.trim()) { setErrMsg("Email tidak boleh kosong."); setStatus("error"); return; }
    setSaving(true); setStatus(null); setErrMsg("");
    try {
      if (currentUser.displayName !== name.trim())
        await updateProfile(currentUser, { displayName: name.trim() });
      if (currentUser.email !== email.trim())
        await updateEmail(currentUser, email.trim());
      if (currentUser?.uid) {
        const userUpdates = {};
        if (name.trim())  userUpdates.displayName = name.trim();
        if (email.trim()) userUpdates.email = email.trim();
        await update(ref(db, `users/${currentUser.uid}`), userUpdates);
      }
      // Update sidebar langsung
      if (onNameChange) onNameChange(name.trim());
      setStatus("success");
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error("Settings save error:", err);
      if (err.code === "auth/requires-recent-login")
        setErrMsg("Untuk mengubah email, silakan logout lalu login kembali.");
      else if (err.code === "auth/email-already-in-use")
        setErrMsg("Email sudah digunakan akun lain.");
      else if (err.code === "auth/invalid-email")
        setErrMsg("Format email tidak valid.");
      else
        setErrMsg(err.message || "Gagal menyimpan perubahan.");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

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
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nama lengkap Anda"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#1B3A2A"}
            onBlur={e => e.target.style.borderColor = "#D1D5DB"}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@contoh.com"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#1B3A2A"}
            onBlur={e => e.target.style.borderColor = "#D1D5DB"}
          />
          <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Mengubah email memerlukan login ulang jika sudah lama tidak login.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: "9px 20px", background: saving ? "#6B7280" : "#1B3A2A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 7 }}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          {status === "success" && <span style={{ fontSize: 13, color: "#16a34a" }}>✓ Perubahan berhasil disimpan!</span>}
          {status === "error"   && <span style={{ fontSize: 13, color: "#dc2626" }}>✗ {errMsg}</span>}
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
const IMGBB_API_KEY = "6604bf748a40b7eaf83a5d4792bff01e";

function ProdukView() {
  const db = getDatabase();

  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [view, setView]                 = useState("list"); // "list" | "form" | "detail"
  const [form, setForm]                 = useState(BLANK);
  const [editId, setEditId]             = useState(null);
  const [saving, setSaving]             = useState(false);
  const [uploading, setUploading]       = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCat, setFilterCat]       = useState("Semua");
  const [toast, setToast]               = useState("");

  // Dynamic categories
  const [categories, setCategories]     = useState(DEFAULT_PRODUK_CATEGORIES);
  const [showAddCat, setShowAddCat]     = useState(false);
  const [newCatInput, setNewCatInput]   = useState("");
  const [savingCat, setSavingCat]       = useState(false);

  /* ── realtime listener produk ── */
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

  /* ── realtime listener kategori produk ── */
  useEffect(() => {
    const catRef = ref(db, "produkCategories");
    const unsub = onValue(catRef, (snap) => {
      const data = snap.val();
      if (data && Array.isArray(data)) {
        setCategories(data);
        setForm(f => ({ ...f, category: data.includes(f.category) ? f.category : data[0] }));
      } else if (!data) {
        // Initialize with defaults on first run
        update(ref(db, "/"), { produkCategories: DEFAULT_PRODUK_CATEGORIES });
      }
    });
    return () => unsub();
  }, []);

  const handleAddCategory = async () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) { showToast("✗ Kategori sudah ada."); return; }
    setSavingCat(true);
    try {
      const updated = [...categories, trimmed];
      await update(ref(db, "/"), { produkCategories: updated });
      setForm(f => ({ ...f, category: trimmed }));
      setNewCatInput("");
      setShowAddCat(false);
      showToast("✓ Kategori berhasil ditambahkan!");
    } catch (err) {
      showToast("✗ Gagal tambah kategori: " + err.message);
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (categories.length <= 1) { showToast("✗ Minimal satu kategori harus ada."); return; }
    const inUse = products.some(p => p.category === cat);
    if (inUse) { showToast(`✗ Kategori "${cat}" masih dipakai produk. Pindahkan dulu.`); return; }
    try {
      const updated = categories.filter(c => c !== cat);
      await update(ref(db, "/"), { produkCategories: updated });
      if (form.category === cat) setForm(f => ({ ...f, category: updated[0] }));
      showToast("✓ Kategori dihapus.");
    } catch (err) {
      showToast("✗ Gagal hapus: " + err.message);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  /* ── upload foto produk ke ImgBB ── */
  const uploadProdukImage = async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: fd });
    const json = await res.json();
    if (!json.success) throw new Error("Upload gagal");
    return json.data.url;
  };

  const handleProdukFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadProdukImage(file);
      setForm(f => ({ ...f, image: url }));
      showToast("✓ Foto berhasil diupload!");
    } catch (err) {
      showToast("✗ Upload foto gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  /* ── save (add / edit) ── */
  const handleSave = async () => {
    if (!form.name.trim()) return showToast("✗ Nama produk wajib diisi.");
    if (!form.price || isNaN(Number(form.price))) return showToast("✗ Harga harus angka.");
    if (!form.desc.trim()) return showToast("✗ Deskripsi wajib diisi.");
    if (!form.image.trim()) return showToast("✗ Foto produk wajib diisi — upload atau masukkan URL.");

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
    setImagePreview("");
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
    setImagePreview(p.image || "");
    setView("form");
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `produk/${id}`));
      showToast("Produk dihapus.");
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
        <div style={{ marginBottom: 8 }}><IcoLoader size={28} color="#9CA3AF" /></div>
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
            <label style={sectionLabel}><span style={{ display:"flex", alignItems:"center", gap:6 }}><IcoImage size={15} color="#374151"/>Foto Produk</span></label>

            {/* Upload area — klik untuk pilih file */}
            <div
              onClick={() => document.getElementById("produk-file-input").click()}
              style={{
                border: "2px dashed #D1D5DB", borderRadius: 12, cursor: "pointer",
                overflow: "hidden", transition: "border-color 0.2s",
                minHeight: imagePreview ? "auto" : 160,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#16c35b"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#D1D5DB"}
            >
              {imagePreview ? (
                <div style={{ position: "relative", width: "100%" }}>
                  <img src={imagePreview} alt="preview"
                    style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
                  <div style={{
                    position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "0.3s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Klik untuk ganti foto</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                    <IcoImage size={36} color="#D1D5DB" />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", margin: "0 0 6px" }}>
                    {uploading ? "Mengupload..." : "Klik untuk pilih foto"}
                  </p>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>JPG, PNG, WEBP • Maks 10MB</span>
                </div>
              )}
            </div>
            <input id="produk-file-input" type="file" accept="image/*"
              onChange={handleProdukFileChange} style={{ display: "none" }} />

            {/* Indikator uploading */}
            {uploading && (
              <p style={{ fontSize: 12, color: "#16c35b", marginTop: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <IcoLoader size={13} color="#16c35b" /> Sedang mengupload foto...
              </p>
            )}

            {/* URL fallback */}
            <div style={{ marginTop: 10 }}>
              <label style={fieldLabel}>Atau masukkan URL foto langsung</label>
              <input
                value={form.image}
                onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(e.target.value); }}
                placeholder="https://i.ibb.co/... atau URL gambar lain"
                style={input}
              />
            </div>
          </div>


          {/* Info Utama */}
          <div style={card}>
            <label style={sectionLabel}><span style={{ display:"flex", alignItems:"center", gap:6 }}><IcoInfo size={15} color="#374151"/>Informasi Produk</span></label>

            <div style={{ marginBottom: 12 }}>
              <label style={fieldLabel}>Nama Produk *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="cth. Telur Ayam Kampung" style={input} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                  <label style={{ ...fieldLabel, marginBottom:0 }}>Kategori *</label>
                  <button
                    onClick={() => setShowAddCat(v => !v)}
                    style={{ fontSize:11, color:"#1B3A2A", background:"none", border:"none", cursor:"pointer", fontWeight:600, padding:0 }}>
                    {showAddCat ? "✕ Tutup" : "+ Kelola"}
                  </button>
                </div>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={input}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Kelola kategori panel */}
                {showAddCat && (
                  <div style={{ marginTop:8, background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:8, padding:10 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:"#374151", margin:"0 0 8px" }}>Kelola Kategori Produk</p>
                    {/* Existing categories */}
                    <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:8 }}>
                      {categories.map(c => (
                        <div key={c} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                          background:"#fff", border:"1px solid #E5E7EB", borderRadius:6, padding:"4px 8px" }}>
                          <span style={{ fontSize:12, color:"#374151" }}>{c}</span>
                          <button
                            onClick={() => handleDeleteCategory(c)}
                            style={{ fontSize:11, color:"#DC2626", background:"none", border:"none", cursor:"pointer", fontWeight:700, padding:"0 2px" }}
                            title="Hapus kategori">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Add new */}
                    <div style={{ display:"flex", gap:6 }}>
                      <input
                        value={newCatInput}
                        onChange={e => setNewCatInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAddCategory()}
                        placeholder="Nama kategori baru..."
                        style={{ ...input, flex:1, fontSize:12, padding:"6px 8px", marginBottom:0 }}
                      />
                      <button
                        onClick={handleAddCategory}
                        disabled={savingCat || !newCatInput.trim()}
                        style={{ padding:"6px 10px", background:"#1B3A2A", color:"#fff", border:"none",
                          borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                        {savingCat ? "..." : "+ Tambah"}
                      </button>
                    </div>
                  </div>
                )}
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
            <label style={sectionLabel}><span style={{ display:"flex", alignItems:"center", gap:6 }}><IcoStar size={15} color="#374151"/>Keunggulan Produk <span style={{ fontWeight:400, color:"#9CA3AF" }}>(muncul di halaman detail)</span></span></label>
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
            <label style={sectionLabel}><span style={{ display:"flex", alignItems:"center", gap:6 }}><IcoTag size={15} color="#374151"/>Badge Produk</span></label>
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
            <label style={sectionLabel}><span style={{ display:"flex", alignItems:"center", gap:6 }}><IcoEye size={15} color="#374151"/>Preview Card</span></label>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ position: "relative", background: "#f0f0f0", height: 130 }}>
                {form.image
                  ? <img src={form.image} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#CBD5E1" }}><IcoImage size={36} color="#CBD5E1" /></div>
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
          {/* Simpan */}
          <button onClick={handleSave} disabled={saving || uploading}
            style={{ width: "100%", padding: "14px", background: (saving || uploading) ? "#9CA3AF" : "#1B3A2A",
              color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
              cursor: (saving || uploading) ? "not-allowed" : "pointer" }}>
            {saving ? "Menyimpan..." : uploading ? "Menunggu upload..." : editId
              ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><IcoSave size={16} color="#fff"/>Perbarui Produk</span>
              : <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><IcoPlus size={16} color="#fff"/>Simpan Produk</span>
            }
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
        <div style={{ position: "fixed", top: 24, right: 24, background: toast.startsWith("✗") ? "#DC2626" : "#1B3A2A", color: "#fff",
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
        {["Semua", ...categories].map(cat => {
          const count = cat === "Semua" ? products.length : products.filter(p => p.category === cat).length;
          return (
            <button key={cat} onClick={() => setFilterCat(cat)}
              style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: filterCat === cat ? 600 : 400,
                border: "1px solid " + (filterCat === cat ? "#1B3A2A" : "#E5E7EB"),
                background: filterCat === cat ? "#1B3A2A" : "#fff",
                color: filterCat === cat ? "#fff" : "#374151", cursor: "pointer" }}>
              {cat} <span style={{ opacity: 0.7, fontSize: 11 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Empty */}
      {displayed.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "60px 20px", textAlign: "center" }}>
          <div style={{ marginBottom: 12 }}><IcoPackage size={40} color="#D1D5DB" /></div>
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
                : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#CBD5E1" }}><IcoImage size={40} color="#CBD5E1" /></div>
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
                  border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <IcoEdit size={14} color="#1B3A2A" /> Edit
              </button>
              <button onClick={() => setDeleteConfirm(p)}
                style={{ flex: 1, padding: "8px", background: "#FEF2F2", color: "#DC2626",
                  border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <IcoTrash size={14} color="#DC2626" /> Hapus
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
            <div style={{ display:"flex", justifyContent:"center", marginBottom: 10 }}><IcoAlert size={36} color="#DC2626" /></div>
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
   GALLERY MANAGEMENT VIEW
───────────────────────────────────────────── */
const DEFAULT_GALLERY_CATEGORIES = ["Peternakan", "Perkebunan", "Workshop", "Pengunjung"];
const GALLERY_BLANK = { title: "", category: "Peternakan", desc: "", image: "" };

function GalleryView() {
  const db = getDatabase();

  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [view, setView]                 = useState("list"); // "list" | "form"
  const [form, setForm]                 = useState(GALLERY_BLANK);
  const [editId, setEditId]             = useState(null);
  const [saving, setSaving]             = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCat, setFilterCat]       = useState("Semua");
  const [toast, setToast]               = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading]       = useState(false);
  const fileInputRef                    = useRef(null);

  // Dynamic categories
  const [galleryCategories, setGalleryCategories] = useState(DEFAULT_GALLERY_CATEGORIES);
  const [showAddCat, setShowAddCat]               = useState(false);
  const [newCatInput, setNewCatInput]             = useState("");
  const [savingCat, setSavingCat]                 = useState(false);

  /* ── realtime listener gallery ── */
  useEffect(() => {
    const galleryRef = ref(db, "gallery");
    const unsub = onValue(galleryRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([key, val]) => ({ ...val, firebaseId: key }));
        setItems(list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
      } else {
        setItems([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* ── realtime listener kategori gallery ── */
  useEffect(() => {
    const catRef = ref(db, "galleryCategories");
    const unsub = onValue(catRef, (snap) => {
      const data = snap.val();
      if (data && Array.isArray(data)) {
        setGalleryCategories(data);
        setForm(f => ({ ...f, category: data.includes(f.category) ? f.category : data[0] }));
      } else if (!data) {
        update(ref(db, "/"), { galleryCategories: DEFAULT_GALLERY_CATEGORIES });
      }
    });
    return () => unsub();
  }, []);

  const handleAddGalCategory = async () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (galleryCategories.includes(trimmed)) { showToast("✗ Kategori sudah ada."); return; }
    setSavingCat(true);
    try {
      const updated = [...galleryCategories, trimmed];
      await update(ref(db, "/"), { galleryCategories: updated });
      setForm(f => ({ ...f, category: trimmed }));
      setNewCatInput("");
      setShowAddCat(false);
      showToast("✓ Kategori berhasil ditambahkan!");
    } catch (err) {
      showToast("✗ Gagal tambah kategori: " + err.message);
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteGalCategory = async (cat) => {
    if (galleryCategories.length <= 1) { showToast("✗ Minimal satu kategori harus ada."); return; }
    const inUse = items.some(i => i.category === cat);
    if (inUse) { showToast(`✗ Kategori "${cat}" masih dipakai item. Pindahkan dulu.`); return; }
    try {
      const updated = galleryCategories.filter(c => c !== cat);
      await update(ref(db, "/"), { galleryCategories: updated });
      if (form.category === cat) setForm(f => ({ ...f, category: updated[0] }));
      showToast("✓ Kategori dihapus.");
    } catch (err) {
      showToast("✗ Gagal hapus: " + err.message);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  /* ── upload file ke ImgBB ── */
  const IMGBB_API_KEY = "6604bf748a40b7eaf83a5d4792bff01e"; // ganti dengan API key kamu dari imgbb.com
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: fd });
    const json = await res.json();
    if (!json.success) throw new Error("Upload gagal");
    return json.data.url;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, image: url }));
      showToast("✓ Foto berhasil diupload!");
    } catch (err) {
      showToast("✗ Upload foto gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  /* ── save (add / edit) ── */
  const handleSave = async () => {
    if (!form.title.trim()) return showToast("✗ Judul wajib diisi.");
    if (!form.desc.trim())  return showToast("✗ Deskripsi wajib diisi.");
    if (!form.image.trim()) return showToast("✗ Upload foto terlebih dahulu.");

    setSaving(true);
    try {
      const payload = {
        title:    form.title.trim(),
        category: form.category,
        desc:     form.desc.trim(),
        image:    form.image.trim(),
        updatedAt: Date.now(),
      };
      if (editId) {
        await update(ref(db, `gallery/${editId}`), payload);
        showToast("✓ Item gallery berhasil diperbarui!");
      } else {
        await push(ref(db, "gallery"), { ...payload, createdAt: Date.now() });
        showToast("✓ Item gallery berhasil ditambahkan!");
      }
      setView("list");
      resetForm();
    } catch (err) {
      showToast("✗ Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(GALLERY_BLANK);
    setEditId(null);
    setImagePreview("");
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, category: item.category, desc: item.desc, image: item.image || "" });
    setEditId(item.firebaseId);
    setImagePreview(item.image || "");
    setView("form");
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `gallery/${id}`));
      showToast("Item dihapus.");
      setDeleteConfirm(null);
    } catch (err) {
      showToast("✗ Gagal menghapus: " + err.message);
    }
  };

  const displayed = filterCat === "Semua" ? items : items.filter(i => i.category === filterCat);

  /* ════════ FORM VIEW ════════ */
  if (view === "form") return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:24, right:24, background: toast.startsWith("✓") ? "#1B3A2A" : "#DC2626",
          color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, zIndex:999,
          boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <button onClick={() => { setView("list"); resetForm(); }}
            style={{ background:"none", border:"none", color:"#6B7280", fontSize:13, cursor:"pointer", marginBottom:4, fontWeight:500 }}>
            ← Kembali ke daftar
          </button>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>
            {editId ? "Edit Item Gallery" : "Tambah Item Gallery"}
          </h1>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, alignItems:"flex-start" }}>

        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Upload Foto */}
          <div style={card}>
            <label style={sectionLabel}>Upload Foto</label>
            <div
              onClick={() => document.getElementById("gal-file-input").click()}
              style={{
                border: "2px dashed #D1D5DB", borderRadius:12, cursor:"pointer",
                overflow:"hidden", transition:"border-color 0.2s",
                minHeight: imagePreview ? "auto" : 160,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#16c35b"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#D1D5DB"}
            >
              {imagePreview ? (
                <div style={{ position:"relative", width:"100%" }}>
                  <img src={imagePreview} alt="preview"
                    style={{ width:"100%", height:240, objectFit:"cover", display:"block" }} />
                  <div style={{
                    position:"absolute", inset:0, background:"rgba(0,0,0,0.4)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    opacity:0, transition:"0.3s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity=1}
                    onMouseLeave={e => e.currentTarget.style.opacity=0}>
                    <span style={{ color:"#fff", fontWeight:600, fontSize:14 }}>Klik untuk ganti foto</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding:"40px 20px", textAlign:"center" }}>
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}><IcoImage size={36} color="#D1D5DB" /></div>
                  <p style={{ fontSize:15, fontWeight:600, color:"#374151", margin:"0 0 6px" }}>
                    {uploading ? "Mengupload..." : "Klik untuk pilih foto"}
                  </p>
                  <span style={{ fontSize:12, color:"#9CA3AF" }}>JPG, PNG, WEBP • Maks 10MB</span>
                </div>
              )}
            </div>
            <input id="gal-file-input" type="file" accept="image/*"
              onChange={handleFileChange} style={{ display:"none" }} />
            {uploading && (
              <p style={{ fontSize: 12, color: "#16c35b", marginTop: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              {/* Ikon Spinner Berputar */}
              <svg style={{ animation: "spin 1s linear infinite", width: "14px", height: "14px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor"></circle>
                <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sedang mengupload foto...</span>
            </p>
            )}
            {form.image && !uploading && (
              <div style={{ marginTop:10 }}>
                <label style={fieldLabel}>Atau ganti dengan URL foto</label>
                <input value={form.image} onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(e.target.value); }}
                  placeholder="https://..." style={input} />
              </div>
            )}
            {!imagePreview && (
              <div style={{ marginTop:10 }}>
                <label style={fieldLabel}>Atau masukkan URL foto langsung</label>
                <input value={form.image} onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(e.target.value); }}
                  placeholder="https://..." style={input} />
              </div>
            )}
          </div>

          {/* Info Dasar */}
          <div style={card}>
            <label style={sectionLabel}>Informasi Item</label>
            <div style={{ marginBottom:12 }}>
              <label style={fieldLabel}>Judul *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="cth: Kandang Sapi Modern" style={input} />
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                <label style={{ ...fieldLabel, marginBottom:0 }}>Kategori *</label>
                <button
                  onClick={() => setShowAddCat(v => !v)}
                  style={{ fontSize:11, color:"#1B3A2A", background:"none", border:"none", cursor:"pointer", fontWeight:600, padding:0 }}>
                  {showAddCat ? "✕ Tutup" : "+ Kelola"}
                </button>
              </div>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={input}>
                {galleryCategories.map(c => <option key={c}>{c}</option>)}
              </select>

              {/* Kelola kategori panel */}
              {showAddCat && (
                <div style={{ marginTop:8, background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:8, padding:10 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:"#374151", margin:"0 0 8px" }}>Kelola Kategori Gallery</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:8 }}>
                    {galleryCategories.map(c => (
                      <div key={c} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                        background:"#fff", border:"1px solid #E5E7EB", borderRadius:6, padding:"4px 8px" }}>
                        <span style={{ fontSize:12, color:"#374151" }}>{c}</span>
                        <button
                          onClick={() => handleDeleteGalCategory(c)}
                          style={{ fontSize:11, color:"#DC2626", background:"none", border:"none", cursor:"pointer", fontWeight:700, padding:"0 2px" }}
                          title="Hapus kategori">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <input
                      value={newCatInput}
                      onChange={e => setNewCatInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddGalCategory()}
                      placeholder="Nama kategori baru..."
                      style={{ ...input, flex:1, fontSize:12, padding:"6px 8px", marginBottom:0 }}
                    />
                    <button
                      onClick={handleAddGalCategory}
                      disabled={savingCat || !newCatInput.trim()}
                      style={{ padding:"6px 10px", background:"#1B3A2A", color:"#fff", border:"none",
                        borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                      {savingCat ? "..." : "+ Tambah"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label style={fieldLabel}>Deskripsi *</label>
              <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                placeholder="Tuliskan deskripsi singkat tentang foto ini..."
                style={{ ...input, height:100, resize:"vertical" }} />
            </div>
          </div>
        </div>

        {/* RIGHT – Preview + Simpan */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={card}>
            <label style={sectionLabel}><span style={{ display:"flex", alignItems:"center", gap:6 }}><IcoEye size={15} color="#374151"/>Preview Card</span></label>
            <div style={{ border:"1px solid #E5E7EB", borderRadius:10, overflow:"hidden" }}>
              <div style={{ position:"relative", background:"#f0f0f0", height:160 }}>
                {imagePreview
                  ? <img src={imagePreview} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#CBD5E1" }}><IcoImage size={36} color="#CBD5E1" /></div>
                }
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.7), transparent)", display:"flex", alignItems:"flex-end" }}>
                  <div style={{ padding:"12px 14px", color:"#fff" }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{form.title || "Judul Item"}</div>
                    <div style={{ fontSize:11, opacity:0.8 }}>{form.category}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving || uploading}
            style={{ width:"100%", padding:"14px", background: (saving || uploading) ? "#9CA3AF" : "#1B3A2A",
              color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700,
              cursor: (saving || uploading) ? "not-allowed" : "pointer" }}>
            {saving ? "Menyimpan..." : editId
              ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><IcoSave size={16} color="#fff"/>Perbarui Item</span>
              : <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><IcoPlus size={16} color="#fff"/>Simpan Item</span>
            }
          </button>
          <button onClick={() => { setView("list"); resetForm(); }}
            style={{ width:"100%", padding:"12px", background:"#fff", border:"1px solid #E5E7EB",
              color:"#374151", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );

  /* ════════ LIST VIEW ════════ */
  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:24, right:24, background: toast.startsWith("✓") ? "#1B3A2A" : "#DC2626",
          color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, zIndex:999,
          boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>Manajemen Gallery</h1>
          <p style={{ color:"#6B7280", fontSize:14, margin:"4px 0 0" }}>
            {items.length} item · data realtime dari Firebase
          </p>
        </div>
        <button onClick={() => { resetForm(); setView("form"); }}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px",
            background:"#1B3A2A", color:"#fff", border:"none", borderRadius:10,
            fontSize:14, fontWeight:600, cursor:"pointer" }}>
          + Tambah Item
        </button>
      </div>

      {/* Stats filter bar */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["Semua", ...galleryCategories].map(cat => {
          const count = cat === "Semua" ? items.length : items.filter(i => i.category === cat).length;
          return (
            <button key={cat} onClick={() => setFilterCat(cat)}
              style={{ padding:"6px 14px", borderRadius:20, fontSize:13,
                fontWeight: filterCat === cat ? 600 : 400,
                border:"1px solid " + (filterCat === cat ? "#1B3A2A" : "#E5E7EB"),
                background: filterCat === cat ? "#1B3A2A" : "#fff",
                color: filterCat === cat ? "#fff" : "#374151", cursor:"pointer" }}>
              {cat} <span style={{ opacity:0.7, fontSize:11 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200 }}>
          <IcoLoader size={28} color="#9CA3AF" />
        </div>
      )}

      {/* Empty */}
      {!loading && displayed.length === 0 && (
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12,
          padding:"60px 20px", textAlign:"center" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}><IcoImage size={40} color="#D1D5DB" /></div>
          <p style={{ color:"#6B7280", fontSize:14 }}>Belum ada item. Klik "Tambah Item" untuk mulai.</p>
        </div>
      )}

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
        {displayed.map(item => (
          <div key={item.firebaseId} style={{
            background:"#fff", border:"1px solid #E5E7EB", borderRadius:12,
            overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
            display:"flex", flexDirection:"column",
          }}>
            {/* Image */}
            <div style={{ position:"relative", height:180, background:"#f0f0f0", overflow:"hidden" }}>
              {item.image
                ? <img src={item.image} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#CBD5E1" }}><IcoImage size={40} color="#CBD5E1" /></div>
              }
              <span style={{
                position:"absolute", top:8, right:8,
                background:"rgba(22,195,91,0.9)", color:"#fff",
                fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20,
              }}>{item.category}</span>
            </div>

            {/* Body */}
            <div style={{ padding:"14px 16px", flex:1 }}>
              <div style={{ fontSize:16, fontWeight:700, color:"#111827", marginBottom:6, lineHeight:1.3 }}>{item.title}</div>
              <div style={{ fontSize:12, color:"#6B7280", lineHeight:1.6,
                display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                {item.desc}
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding:"10px 16px", borderTop:"1px solid #F3F4F6", display:"flex", gap:8 }}>
              <button onClick={() => handleEdit(item)}
                style={{ flex:1, padding:"8px", background:"#E8F4EE", color:"#1B3A2A",
                  border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <IcoEdit size={14} color="#1B3A2A" /> Edit
              </button>
              <button onClick={() => setDeleteConfirm(item)}
                style={{ flex:1, padding:"8px", background:"#FEF2F2", color:"#DC2626",
                  border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <IcoTrash size={14} color="#DC2626" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex",
          alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", padding:28, borderRadius:14, width:340, textAlign:"center" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}><IcoAlert size={36} color="#DC2626" /></div>
            <h3 style={{ margin:"0 0 8px", color:"#111827", fontSize:17, fontWeight:700 }}>Hapus Item Gallery?</h3>
            <p style={{ color:"#6B7280", fontSize:13, marginBottom:20 }}>
              Item <strong>"{deleteConfirm.title}"</strong> akan dihapus permanen dari database.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ padding:"9px 20px", borderRadius:8, border:"1px solid #E5E7EB",
                  background:"#fff", color:"#374151", fontSize:14, cursor:"pointer", fontWeight:600 }}>
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirm.firebaseId)}
                style={{ padding:"9px 20px", borderRadius:8, border:"none",
                  background:"#DC2626", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>
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
   ATTRACTIONS MANAGEMENT VIEW
───────────────────────────────────────────── */
const DEFAULT_ATTRACTION_CATEGORIES = ["Workshop", "Nature", "Animals"];
const ATTRACTION_BLANK = {
  name: "", category: "Workshop", location: "",
  desc: "", image: "", badge: "",
};

function AttractionsView() {
  const db = getDatabase();

  const [items, setItems]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [view, setView]                     = useState("list"); // "list" | "form"
  const [form, setForm]                     = useState(ATTRACTION_BLANK);
  const [editId, setEditId]                 = useState(null);
  const [saving, setSaving]                 = useState(false);
  const [deleteConfirm, setDeleteConfirm]   = useState(null);
  const [filterCat, setFilterCat]           = useState("Semua");
  const [toast, setToast]                   = useState("");
  const [imagePreview, setImagePreview]     = useState("");
  const [uploading, setUploading]           = useState(false);

  const [categories, setCategories]         = useState(DEFAULT_ATTRACTION_CATEGORIES);
  const [showAddCat, setShowAddCat]         = useState(false);
  const [newCatInput, setNewCatInput]       = useState("");
  const [savingCat, setSavingCat]           = useState(false);

  /* ── realtime listener attractions ── */
  useEffect(() => {
    const attRef = ref(db, "attractions");
    const unsub = onValue(attRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([key, val]) => ({ ...val, firebaseId: key }));
        setItems(list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
      } else {
        setItems([]);
      }
      setLoading(false);
    }, (err) => {
      console.error("Attractions error:", err);
      setItems([]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* ── realtime listener kategori ── */
  useEffect(() => {
    const catRef = ref(db, "attractionCategories");
    const unsub = onValue(catRef, (snap) => {
      const data = snap.val();
      if (data && Array.isArray(data)) {
        setCategories(data);
      } else if (!data) {
        update(ref(db, "/"), { attractionCategories: DEFAULT_ATTRACTION_CATEGORIES });
      }
    });
    return () => unsub();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  /* ── upload foto ke ImgBB ── */
  const IMGBB_KEY = "6604bf748a40b7eaf83a5d4792bff01e";
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: fd });
    const json = await res.json();
    if (!json.success) throw new Error("Upload gagal");
    return json.data.url;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, image: url }));
      showToast("✓ Foto berhasil diupload!");
    } catch (err) {
      showToast("✗ Upload foto gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  /* ── kelola kategori ── */
  const handleAddCategory = async () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) { showToast("✗ Kategori sudah ada."); return; }
    setSavingCat(true);
    try {
      const updated = [...categories, trimmed];
      await update(ref(db, "/"), { attractionCategories: updated });
      setNewCatInput(""); setShowAddCat(false);
      showToast("✓ Kategori ditambahkan!");
    } catch (err) { showToast("✗ Gagal: " + err.message); }
    finally { setSavingCat(false); }
  };

  const handleDeleteCategory = async (cat) => {
    if (categories.length <= 1) { showToast("✗ Minimal satu kategori harus ada."); return; }
    if (items.some(i => i.category === cat)) {
      const count = items.filter(i => i.category === cat).length;
      const ok = window.confirm(
        `Kategori "${cat}" masih digunakan oleh ${count} attraction.\nApakah Anda tetap ingin menghapus kategori ini?\n\n(Attraction yang menggunakan kategori ini tidak akan berubah secara otomatis.)`
      );
      if (!ok) return;
    }
    try {
      const updated = categories.filter(c => c !== cat);
      await update(ref(db, "/"), { attractionCategories: updated });
      if (form.category === cat) setForm(f => ({ ...f, category: updated[0] }));
      showToast("✓ Kategori dihapus.");
    } catch (err) { showToast("✗ Gagal: " + err.message); }
  };

  /* ── save (add / edit) ── */
  const handleSave = async () => {
    if (!form.name.trim())     return showToast("✗ Nama attraction wajib diisi.");
    if (!form.desc.trim())     return showToast("✗ Deskripsi wajib diisi.");
    if (!form.location.trim()) return showToast("✗ Lokasi wajib diisi.");
    if (!form.image.trim())    return showToast("✗ Upload foto terlebih dahulu.");

    setSaving(true);
    try {
      const payload = {
        title:      form.name.trim(),
        name:       form.name.trim(),
        category:   form.category,
        location:   form.location.trim(),
        desc:       form.desc.trim(),
        image:      form.image.trim(),
        badge:      form.badge || null,
        updatedAt:  new Date().toISOString(),
      };
      if (editId) {
        await update(ref(db, `attractions/${editId}`), payload);
        showToast("✓ Attraction berhasil diperbarui!");
      } else {
        await push(ref(db, "attractions"), { ...payload, id: Date.now(), createdAt: new Date().toISOString() });
        showToast("✓ Attraction berhasil ditambahkan!");
      }
      setView("list"); resetForm();
    } catch (err) { showToast("✗ Gagal menyimpan: " + err.message); }
    finally { setSaving(false); }
  };

  const resetForm = () => { setForm(ATTRACTION_BLANK); setEditId(null); setImagePreview(""); };

  const handleEdit = (item) => {
    setForm({
      name:       item.name || item.title || "",
      category:   item.category || "Workshop",
      location:   item.location || "",
      desc:       item.desc || "",
      image:      item.image || "",
      badge:      item.badge || "",
    });
    setEditId(item.firebaseId);
    setImagePreview(item.image || "");
    setView("form");
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `attractions/${id}`));
      showToast("Item dihapus."); setDeleteConfirm(null);
    } catch (err) { showToast("✗ Gagal menghapus: " + err.message); }
  };

  const displayed = filterCat === "Semua" ? items : items.filter(i => i.category === filterCat);

  /* ════════ FORM VIEW ════════ */
  if (view === "form") return (
    <div>
      {toast && (
        <div style={{ position:"fixed", top:24, right:24, background: toast.startsWith("✓") ? "#1B3A2A" : "#DC2626",
          color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, zIndex:999,
          boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>{toast}</div>
      )}

      <div style={{ display:"flex", alignItems:"center", marginBottom:24 }}>
        <div>
          <button onClick={() => { setView("list"); resetForm(); }}
            style={{ background:"none", border:"none", color:"#6B7280", fontSize:13, cursor:"pointer", marginBottom:4, fontWeight:500, padding:0 }}>
            ← Kembali ke daftar
          </button>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>
            {editId ? "Edit Attraction" : "Tambah Attraction Baru"}
          </h1>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, alignItems:"flex-start" }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Upload Foto */}
          <div style={card}>
            <label style={sectionLabel}>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}><IcoImage size={15} color="#374151"/>Foto Attraction</span>
            </label>
            <div
              onClick={() => document.getElementById("att-file-input").click()}
              style={{
                border:"2px dashed #D1D5DB", borderRadius:12, cursor:"pointer",
                overflow:"hidden", transition:"border-color 0.2s",
                minHeight: imagePreview ? "auto" : 160,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#16c35b"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#D1D5DB"}
            >
              {imagePreview ? (
                <div style={{ position:"relative", width:"100%" }}>
                  <img src={imagePreview} alt="preview"
                    style={{ width:"100%", height:240, objectFit:"cover", display:"block" }} />
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)",
                    display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"0.3s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity=1}
                    onMouseLeave={e => e.currentTarget.style.opacity=0}>
                    <span style={{ color:"#fff", fontWeight:600, fontSize:14 }}>Klik untuk ganti foto</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding:"40px 20px", textAlign:"center" }}>
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}><IcoImage size={36} color="#D1D5DB" /></div>
                  <p style={{ fontSize:15, fontWeight:600, color:"#374151", margin:"0 0 6px" }}>
                    {uploading ? "Mengupload..." : "Klik untuk pilih foto"}
                  </p>
                  <span style={{ fontSize:12, color:"#9CA3AF" }}>JPG, PNG, WEBP • Maks 10MB</span>
                </div>
              )}
            </div>
            <input id="att-file-input" type="file" accept="image/*"
              onChange={handleFileChange} style={{ display:"none" }} />
            {uploading && (
              <p style={{ fontSize:12, color:"#16c35b", marginTop:8, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                <svg style={{ animation:"spin 1s linear infinite", width:14, height:14 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <circle style={{ opacity:0.25 }} cx="12" cy="12" r="10" stroke="currentColor"/>
                  <path style={{ opacity:0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Sedang mengupload foto...
              </p>
            )}
            <div style={{ marginTop:10 }}>
              <label style={fieldLabel}>Atau masukkan URL foto langsung</label>
              <input value={form.image}
                onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(e.target.value); }}
                placeholder="https://i.ibb.co/... atau URL gambar lain" style={input} />
            </div>
          </div>

          {/* Info Utama */}
          <div style={card}>
            <label style={sectionLabel}>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}><IcoInfo size={15} color="#374151"/>Informasi Attraction</span>
            </label>

            <div style={{ marginBottom:12 }}>
              <label style={fieldLabel}>Nama Attraction *</label>
              <input value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="cth. Kandang Edukasi Sapi Perah" style={input} />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                  <label style={{ ...fieldLabel, marginBottom:0 }}>Kategori *</label>
                  <button onClick={() => setShowAddCat(v => !v)}
                    style={{ fontSize:11, color:"#1B3A2A", background:"none", border:"none", cursor:"pointer", fontWeight:600, padding:0 }}>
                    {showAddCat ? "✕ Tutup" : "+ Kelola"}
                  </button>
                </div>
                <select value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={input}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                {showAddCat && (
                  <div style={{ marginTop:8, background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:8, padding:10 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:"#374151", margin:"0 0 8px" }}>Kelola Kategori Attractions</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:8 }}>
                      {categories.map(c => (
                        <div key={c} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                          background:"#fff", border:"1px solid #E5E7EB", borderRadius:6, padding:"4px 8px" }}>
                          <span style={{ fontSize:12, color:"#374151" }}>{c}</span>
                          <button onClick={() => handleDeleteCategory(c)}
                            style={{ fontSize:11, color:"#DC2626", background:"none", border:"none", cursor:"pointer", fontWeight:700, padding:"0 2px" }}>✕</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <input value={newCatInput} onChange={e => setNewCatInput(e.target.value)}
                        onKeyDown={e => e.key==="Enter" && handleAddCategory()}
                        placeholder="Nama kategori baru..."
                        style={{ ...input, flex:1, fontSize:12, padding:"6px 8px", marginBottom:0 }} />
                      <button onClick={handleAddCategory} disabled={savingCat || !newCatInput.trim()}
                        style={{ padding:"6px 10px", background:"#1B3A2A", color:"#fff", border:"none",
                          borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
                        {savingCat ? "..." : "+ Tambah"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label style={fieldLabel}>Badge <span style={{ fontWeight:400, color:"#9CA3AF" }}>(opsional)</span></label>
                <select value={form.badge}
                  onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} style={input}>
                  <option value="">Tidak Ada</option>
                  <option value="NEW">NEW</option>
                  <option value="HOT">HOT</option>
                  <option value="POPULER">POPULER</option>
                  <option value="EDUKASI">EDUKASI</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom:12 }}>
              <label style={fieldLabel}>Lokasi / Area *</label>
              <input value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="cth. Zona Peternakan, Blok A" style={input} />
            </div>

            <div>
              <label style={fieldLabel}>Deskripsi *</label>
              <textarea value={form.desc}
                onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                placeholder="Ceritakan tentang attraction ini — apa yang bisa dilakukan pengunjung, pengalaman uniknya, dll."
                style={{ ...input, height:110, resize:"vertical" }} />
            </div>
          </div>

        </div>{/* ── END LEFT COLUMN ── */}

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Preview Card */}
          <div style={card}>
            <label style={sectionLabel}>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}><IcoEye size={15} color="#374151"/>Preview Card</span>
            </label>
            <div style={{ border:"1px solid #E5E7EB", borderRadius:10, overflow:"hidden" }}>
              <div style={{ position:"relative", background:"#f0f0f0", height:160 }}>
                {imagePreview
                  ? <img src={imagePreview} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#CBD5E1" }}>
                      <IcoImage size={36} color="#CBD5E1" />
                    </div>
                }
                {form.badge && (
                  <span style={{ position:"absolute", top:8, left:8, padding:"3px 10px",
                    fontSize:10, fontWeight:700, borderRadius:4, color:"#fff",
                    background: form.badge === "HOT" ? "#ef4444" : "#16c35b" }}>{form.badge}</span>
                )}
                <span style={{ position:"absolute", top:8, right:8, background:"rgba(22,195,91,0.9)",
                  color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>
                  {form.category}
                </span>
              </div>
              <div style={{ padding:"12px 14px" }}>
                <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:4 }}>
                  {form.name || "Nama Attraction"}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={14} /> 
                <span>{form.location || "Lokasi"}</span>
              </div>
                <div style={{ fontSize:12, color:"#6B7280", lineHeight:1.6,
                  display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                  {form.desc || "Deskripsi attraction akan muncul di sini..."}
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving || uploading}
            style={{ width:"100%", padding:"14px", background:(saving||uploading)?"#9CA3AF":"#1B3A2A",
              color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700,
              cursor:(saving||uploading)?"not-allowed":"pointer" }}>
            {saving ? "Menyimpan..." : uploading ? "Menunggu upload..." : editId
              ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><IcoSave size={16} color="#fff"/>Perbarui Attraction</span>
              : <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><IcoPlus size={16} color="#fff"/>Simpan Attraction</span>
            }
          </button>
          <button onClick={() => { setView("list"); resetForm(); }}
            style={{ width:"100%", padding:"12px", background:"#fff", border:"1px solid #E5E7EB",
              color:"#374151", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );

  /* ════════ LIST VIEW ════════ */
  return (
    <div>
      {toast && (
        <div style={{ position:"fixed", top:24, right:24, background: toast.startsWith("✓") ? "#1B3A2A" : "#DC2626",
          color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, zIndex:999,
          boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>{toast}</div>
      )}

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>Manajemen Attractions</h1>
          <p style={{ color:"#6B7280", fontSize:14, margin:"4px 0 0" }}>
            {items.length} attraction · data realtime dari Firebase
          </p>
        </div>
        <button onClick={() => { resetForm(); setView("form"); }}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px",
            background:"#1B3A2A", color:"#fff", border:"none", borderRadius:10,
            fontSize:14, fontWeight:600, cursor:"pointer" }}>
          + Tambah Attraction
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["Semua", ...categories].map(cat => {
          const count = cat === "Semua" ? items.length : items.filter(i => i.category === cat).length;
          return (
            <button key={cat} onClick={() => setFilterCat(cat)}
              style={{ padding:"6px 14px", borderRadius:20, fontSize:13,
                fontWeight: filterCat === cat ? 600 : 400,
                border:"1px solid " + (filterCat === cat ? "#1B3A2A" : "#E5E7EB"),
                background: filterCat === cat ? "#1B3A2A" : "#fff",
                color: filterCat === cat ? "#fff" : "#374151", cursor:"pointer" }}>
              {cat} <span style={{ opacity:0.7, fontSize:11 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {loading && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200 }}>
          <IcoLoader size={28} color="#9CA3AF" />
        </div>
      )}

      {!loading && displayed.length === 0 && (
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12,
          padding:"60px 20px", textAlign:"center" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <p style={{ color:"#6B7280", fontSize:14 }}>Belum ada attraction. Klik "+ Tambah Attraction" untuk mulai.</p>
        </div>
      )}

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
        {displayed.map(item => (
          <div key={item.firebaseId} style={{
            background:"#fff", border:"1px solid #E5E7EB", borderRadius:12,
            overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
            display:"flex", flexDirection:"column",
          }}>
            <div style={{ position:"relative", height:180, background:"#f0f0f0", overflow:"hidden" }}>
              {item.image
                ? <img src={item.image} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
              }
              {item.badge && (
                <span style={{ position:"absolute", top:8, left:8, padding:"3px 10px",
                  fontSize:10, fontWeight:700, borderRadius:4, color:"#fff",
                  background: item.badge === "HOT" ? "#ef4444" : "#16c35b" }}>{item.badge}</span>
              )}
              <span style={{ position:"absolute", top:8, right:8, background:"rgba(22,195,91,0.9)",
                color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>
                {item.category}
              </span>
            </div>

            <div style={{ padding:"14px 16px", flex:1 }}>
              <div style={{ fontSize:16, fontWeight:700, color:"#111827", marginBottom:4, lineHeight:1.3 }}>{item.title || item.name}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={14} />
                <span>{item.location}</span>
              </div>
              <div style={{ fontSize:12, color:"#6B7280", lineHeight:1.6,
                display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                {item.desc}
              </div>
            </div>

            <div style={{ padding:"10px 16px", borderTop:"1px solid #F3F4F6", display:"flex", gap:8 }}>
              <button onClick={() => handleEdit(item)}
                style={{ flex:1, padding:"8px", background:"#E8F4EE", color:"#1B3A2A",
                  border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <IcoEdit size={14} color="#1B3A2A" /> Edit
              </button>
              <button onClick={() => setDeleteConfirm(item)}
                style={{ flex:1, padding:"8px", background:"#FEF2F2", color:"#DC2626",
                  border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <IcoTrash size={14} color="#DC2626" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex",
          alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", padding:28, borderRadius:14, width:340, textAlign:"center" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}><IcoAlert size={36} color="#DC2626" /></div>
            <h3 style={{ margin:"0 0 8px", color:"#111827", fontSize:17, fontWeight:700 }}>Hapus Attraction?</h3>
            <p style={{ color:"#6B7280", fontSize:13, marginBottom:20 }}>
              Attraction <strong>"{deleteConfirm.name}"</strong> akan dihapus permanen dari database.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ padding:"9px 20px", borderRadius:8, border:"1px solid #E5E7EB",
                  background:"#fff", color:"#374151", fontSize:14, cursor:"pointer", fontWeight:600 }}>
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirm.firebaseId)}
                style={{ padding:"9px 20px", borderRadius:8, border:"none",
                  background:"#DC2626", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>
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
   TICKETS ONLINE MANAGEMENT VIEW
───────────────────────────────────────────── */
const TICKET_BLANK = {
  title: "",
  category: "Paket Wisata",
  image: "",
  weekday: "",
  weekend: "",
  featured: false,
  iconName: "FaSwimmingPool",
  features: ["", "", "", "", "", ""],
};

const TICKET_ICON_OPTIONS = [
  { value: "FaSwimmingPool", label: "Kolam Renang" },
  { value: "FaTree",         label: "Alam / Pohon" },
  { value: "FaCampground",   label: "Camping" },
  { value: "FaTicketAlt",    label: "Tiket" },
  { value: "FaUsers",        label: "Rombongan" },
  { value: "FaStar",         label: "Unggulan" },
];

function TicketsOnlineView() {
  const db = getDatabase();

  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [view, setView]                 = useState("list"); // "list" | "form"
  const [form, setForm]                 = useState(TICKET_BLANK);
  const [editId, setEditId]             = useState(null);
  const [saving, setSaving]             = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast]               = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading]       = useState(false);

  /* ── realtime listener ── */
  useEffect(() => {
    const tickRef = ref(db, "ticketsOnline");
    const unsub = onValue(tickRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([key, val]) => ({ ...val, firebaseId: key }));
        setItems(list.sort((a, b) => (a.order || 0) - (b.order || 0) || (b.createdAt || 0) - (a.createdAt || 0)));
      } else {
        setItems([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  /* ── upload foto ke ImgBB ── */
  const IMGBB_KEY = "6604bf748a40b7eaf83a5d4792bff01e";
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: "POST", body: fd });
    const json = await res.json();
    if (!json.success) throw new Error("Upload gagal");
    return json.data.url;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, image: url }));
      showToast("✓ Foto berhasil diupload!");
    } catch (err) {
      showToast("✗ Upload foto gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  /* ── save ── */
  const handleSave = async () => {
    if (!form.title.trim()) return showToast("✗ Nama paket wajib diisi.");
    if (!form.weekday || isNaN(Number(String(form.weekday).replace(/\D/g,"")))) return showToast("✗ Harga weekday harus angka.");
    if (!form.weekend || isNaN(Number(String(form.weekend).replace(/\D/g,"")))) return showToast("✗ Harga weekend harus angka.");
    if (!form.image.trim()) return showToast("✗ Upload foto terlebih dahulu.");

    setSaving(true);
    try {
      // Store prices as formatted string "Rp X.XXX.XXX"
      const fmtPrice = (val) => {
        const num = parseInt(String(val).replace(/\D/g,""), 10) || 0;
        return "Rp " + num.toLocaleString("id-ID");
      };
      const payload = {
        title:     form.title.trim(),
        category:  form.category.trim() || "Paket Wisata",
        image:     form.image.trim(),
        weekday:   fmtPrice(form.weekday),
        weekend:   fmtPrice(form.weekend),
        featured:  !!form.featured,
        iconName:  form.iconName || "FaTicketAlt",
        features:  (form.features || []).map(f => f.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
      };
      if (editId) {
        await update(ref(db, `ticketsOnline/${editId}`), payload);
        showToast("✓ Paket berhasil diperbarui!");
      } else {
        await push(ref(db, "ticketsOnline"), { ...payload, order: items.length, createdAt: new Date().toISOString() });
        showToast("✓ Paket berhasil ditambahkan!");
      }
      setView("list"); resetForm();
    } catch (err) {
      showToast("✗ Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => { setForm(TICKET_BLANK); setEditId(null); setImagePreview(""); };

  const handleEdit = (item) => {
    // Strip "Rp " prefix and dots for editing
    const rawPrice = (str) => str ? str.replace(/[^\d]/g, "") : "";
    setForm({
      title:    item.title || "",
      category: item.category || "Paket Wisata",
      image:    item.image || "",
      weekday:  rawPrice(item.weekday),
      weekend:  rawPrice(item.weekend),
      featured: !!item.featured,
      iconName: item.iconName || "FaTicketAlt",
      features: Array.isArray(item.features)
        ? [...item.features, "", "", "", "", "", ""].slice(0, 6)
        : ["", "", "", "", "", ""],
    });
    setEditId(item.firebaseId);
    setImagePreview(item.image || "");
    setView("form");
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `ticketsOnline/${id}`));
      showToast("Paket dihapus."); setDeleteConfirm(null);
    } catch (err) { showToast("✗ Gagal menghapus: " + err.message); }
  };

  const fmtRp = (val) => {
    const num = parseInt(String(val).replace(/\D/g,""), 10) || 0;
    return num ? "Rp " + num.toLocaleString("id-ID") : "";
  };

  /* ════════ FORM VIEW ════════ */
  if (view === "form") return (
    <div>
      {toast && (
        <div style={{ position:"fixed", top:24, right:24, background: toast.startsWith("✓") ? "#1B3A2A" : "#DC2626",
          color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, zIndex:999,
          boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>{toast}</div>
      )}

      <div style={{ marginBottom:24 }}>
        <button onClick={() => { setView("list"); resetForm(); }}
          style={{ background:"none", border:"none", color:"#6B7280", fontSize:13, cursor:"pointer", marginBottom:4, fontWeight:500, padding:0 }}>
          ← Kembali ke daftar
        </button>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>
          {editId ? "Edit Paket Tiket Online" : "Tambah Paket Tiket Online Baru"}
        </h1>
        <p style={{ color:"#6B7280", fontSize:14, margin:"4px 0 0" }}>Paket yang ditambahkan akan langsung tampil di halaman /tickets-online</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, alignItems:"flex-start" }}>

        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Upload Foto */}
          <div style={card}>
            <label style={sectionLabel}>Foto Paket</label>
            <div
              onClick={() => document.getElementById("ticket-file-input").click()}
              style={{
                border:"2px dashed #D1D5DB", borderRadius:12, cursor:"pointer",
                overflow:"hidden", minHeight: imagePreview ? "auto" : 160,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                transition:"border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#16c35b"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#D1D5DB"}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{ width:"100%", maxHeight:240, objectFit:"cover", display:"block" }} />
              ) : (
                <div style={{ textAlign:"center", padding:32, color:"#9CA3AF" }}>
                  <IcoImage size={36} color="#D1D5DB" />
                  <p style={{ marginTop:10, fontSize:13 }}>Klik untuk upload foto paket</p>
                  <p style={{ fontSize:11, color:"#D1D5DB", margin:"4px 0 0" }}>PNG, JPG, WEBP</p>
                </div>
              )}
            </div>
            <input id="ticket-file-input" type="file" accept="image/*" style={{ display:"none" }} onChange={handleFileChange} />
            {uploading && <p style={{ fontSize:12, color:"#6B7280", marginTop:6 }}>⏳ Mengupload foto...</p>}
            <div style={{ marginTop:12 }}>
              <label style={fieldLabel}>Atau masukkan URL foto</label>
              <input
                type="text"
                placeholder="https://..."
                value={form.image}
                onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(e.target.value); }}
                style={input}
              />
            </div>
          </div>

          {/* Info Paket */}
          <div style={card}>
            <label style={sectionLabel}>Informasi Paket</label>

            <div style={{ marginBottom:12 }}>
              <label style={fieldLabel}>Nama Paket *</label>
              <input
                type="text"
                placeholder="cth. Paket Keluarga, Tiket Per Orang"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                style={input}
              />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                <label style={fieldLabel}>Harga Weekday (Rp) *</label>
                <input
                  type="number"
                  placeholder="cth. 150000"
                  value={form.weekday}
                  onChange={e => setForm(f => ({ ...f, weekday: e.target.value }))}
                  style={input}
                  min={0}
                />
                {form.weekday && <p style={{ fontSize:11, color:"#16a34a", marginTop:3 }}>{fmtRp(form.weekday)}</p>}
              </div>
              <div>
                <label style={fieldLabel}>Harga Weekend (Rp) *</label>
                <input
                  type="number"
                  placeholder="cth. 50000"
                  value={form.weekend}
                  onChange={e => setForm(f => ({ ...f, weekend: e.target.value }))}
                  style={input}
                  min={0}
                />
                {form.weekend && <p style={{ fontSize:11, color:"#16a34a", marginTop:3 }}>{fmtRp(form.weekend)}</p>}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={fieldLabel}>Kategori</label>
                <input
                  type="text"
                  placeholder="Paket Wisata"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={input}
                />
              </div>
              <div>
                <label style={fieldLabel}>Icon</label>
                <select value={form.iconName} onChange={e => setForm(f => ({ ...f, iconName: e.target.value }))} style={input}>
                  {TICKET_ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginTop:12 }}>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, fontWeight:600, color:"#374151" }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  style={{ width:16, height:16, accentColor:"#1B3A2A" }}
                />
                Tandai sebagai paket unggulan (featured)
              </label>
              <p style={{ fontSize:11, color:"#9CA3AF", marginTop:3 }}>Paket featured akan ditampilkan dengan border hijau di halaman publik.</p>
            </div>
          </div>

          {/* Detail Paket / Features */}
          <div style={card}>
            <label style={sectionLabel}>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                <IcoCheck size={15} color="#374151"/>
                Detail Paket
                <span style={{ fontWeight:400, color:"#9CA3AF", fontSize:12 }}>(tampil di modal detail — maks 6 item)</span>
              </span>
            </label>
            <p style={{ fontSize:12, color:"#9CA3AF", margin:"0 0 12px" }}>
              Isi keunggulan / fasilitas yang termasuk dalam paket ini. Kosongkan baris yang tidak diperlukan.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {(form.features || ["","","","","",""]).map((feat, idx) => (
                <div key={idx} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:12, color:"#9CA3AF", width:20, textAlign:"right", flexShrink:0 }}>{idx+1}.</span>
                  <input
                    type="text"
                    placeholder={`Fasilitas ke-${idx+1}, misal: Kolam anak dengan wahana interaktif`}
                    value={feat}
                    onChange={e => {
                      const updated = [...(form.features || ["","","","","",""])];
                      updated[idx] = e.target.value;
                      setForm(f => ({ ...f, features: updated }));
                    }}
                    style={{ ...input, flex:1 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Preview */}
          <div style={card}>
            <label style={sectionLabel}>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}><IcoEye size={15} color="#374151"/>Preview Card</span>
            </label>
            <div style={{ border: form.featured ? "2px solid #4caf50" : "1px solid #E5E7EB", borderRadius:14, overflow:"hidden" }}>
              <div style={{ height:140, background:"#f0f0f0", overflow:"hidden" }}>
                {imagePreview
                  ? <img src={imagePreview} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}>
                      <IcoImage size={32} color="#D1D5DB" />
                    </div>
                }
              </div>
              <div style={{ padding:"12px 14px" }}>
                <div style={{ fontSize: 11, color: "#4caf50", fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", flexShrink: 0 }}>
                  <path d="M2 22 A10 10 0 0 1 12 12 A10 10 0 0 1 22 2 A10 10 0 0 1 12 12 A10 10 0 0 1 2 22Z"/>
                </svg>
                {form.category || "Paket Wisata"}
              </div>
                <div style={{ fontSize:15, fontWeight:700, color:"#1e3b25", marginBottom:10 }}>{form.title || "Nama Paket"}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ flex:1, background:"#f6f8f5", borderRadius:8, padding:"8px 10px" }}>
                    <div style={{ fontSize:10, color:"#8a9e8a", fontWeight:600 }}>WEEKDAY</div>
                    <div style={{ fontSize:13, color:"#2f6f3e", fontWeight:700 }}>{form.weekday ? fmtRp(form.weekday) : "—"}</div>
                  </div>
                  <div style={{ flex:1, background:"#f6f8f5", borderRadius:8, padding:"8px 10px" }}>
                    <div style={{ fontSize:10, color:"#8a9e8a", fontWeight:600 }}>WEEKEND</div>
                    <div style={{ fontSize:13, color:"#2f6f3e", fontWeight:700 }}>{form.weekend ? fmtRp(form.weekend) : "—"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving || uploading}
            style={{ width:"100%", padding:"14px", background:(saving||uploading)?"#9CA3AF":"#1B3A2A",
              color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700,
              cursor:(saving||uploading)?"not-allowed":"pointer" }}>
            {saving ? "Menyimpan..." : uploading ? "Menunggu upload..." : editId
              ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><IcoSave size={16} color="#fff"/>Perbarui Paket</span>
              : <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><IcoPlus size={16} color="#fff"/>Simpan Paket</span>
            }
          </button>
          <button onClick={() => { setView("list"); resetForm(); }}
            style={{ width:"100%", padding:"12px", background:"#fff", border:"1px solid #E5E7EB",
              color:"#374151", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );

  /* ════════ LIST VIEW ════════ */
  return (
    <div>
      {toast && (
        <div style={{ position:"fixed", top:24, right:24, background: toast.startsWith("✓") ? "#1B3A2A" : "#DC2626",
          color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, zIndex:999,
          boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>{toast}</div>
      )}

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>Manajemen Tiket Online</h1>
          <p style={{ color:"#6B7280", fontSize:14, margin:"4px 0 0" }}>
            {items.length} paket aktif · tampil realtime di /tickets-online
          </p>
        </div>
        <button onClick={() => { resetForm(); setView("form"); }}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px",
            background:"#1B3A2A", color:"#fff", border:"none", borderRadius:10,
            fontSize:14, fontWeight:600, cursor:"pointer" }}>
          + Tambah Paket
        </button>
      </div>

      {loading && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200 }}>
          <IcoLoader size={28} color="#9CA3AF" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12,
          padding:"60px 20px", textAlign:"center" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
            <TicketsOnlineIcon active={false} />
          </div>
          <p style={{ color:"#6B7280", fontSize:14 }}>Belum ada paket tiket online. Klik "+ Tambah Paket" untuk mulai.</p>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
        {items.map(item => (
          <div key={item.firebaseId} style={{
            background:"#fff",
            border: item.featured ? "2px solid #4caf50" : "1px solid #E5E7EB",
            borderRadius:12, overflow:"hidden",
            boxShadow:"0 2px 8px rgba(0,0,0,0.05)", display:"flex", flexDirection:"column",
          }}>
            <div style={{ position:"relative", height:160, background:"#f0f0f0", overflow:"hidden" }}>
              {item.image
                ? <img src={item.image} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}>
                    <IcoImage size={32} color="#D1D5DB" />
                  </div>
              }
              {item.featured && (
                <span style={{ position:"absolute", top:8, right:8, background:"#4caf50",
                  color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>
                  FEATURED
                </span>
              )}
            </div>

            <div style={{ padding:"14px 16px", flex:1 }}>
              <div style={{ fontSize: 11, color: "#4caf50", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
              <IcoTag size={13} color="#4caf50" />
              {item.category}
            </div>
              <div style={{ fontSize:16, fontWeight:700, color:"#111827", marginBottom:10, lineHeight:1.3 }}>{item.title}</div>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ flex:1, background:"#f6f8f5", borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, color:"#8a9e8a", fontWeight:600, marginBottom:2 }}>WEEKDAY</div>
                  <div style={{ fontSize:13, color:"#2f6f3e", fontWeight:700 }}>{item.weekday}</div>
                </div>
                <div style={{ flex:1, background:"#f6f8f5", borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, color:"#8a9e8a", fontWeight:600, marginBottom:2 }}>WEEKEND</div>
                  <div style={{ fontSize:13, color:"#2f6f3e", fontWeight:700 }}>{item.weekend}</div>
                </div>
              </div>
            </div>

            <div style={{ padding:"10px 16px", borderTop:"1px solid #F3F4F6", display:"flex", gap:8 }}>
              <button onClick={() => handleEdit(item)}
                style={{ flex:1, padding:"8px", background:"#E8F4EE", color:"#1B3A2A",
                  border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <IcoEdit size={14} color="#1B3A2A" /> Edit
              </button>
              <button onClick={() => setDeleteConfirm(item)}
                style={{ flex:1, padding:"8px", background:"#FEF2F2", color:"#DC2626",
                  border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <IcoTrash size={14} color="#DC2626" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex",
          alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", padding:28, borderRadius:14, width:340, textAlign:"center" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}><IcoAlert size={36} color="#DC2626" /></div>
            <h3 style={{ margin:"0 0 8px", color:"#111827", fontSize:17, fontWeight:700 }}>Hapus Paket Tiket?</h3>
            <p style={{ color:"#6B7280", fontSize:13, marginBottom:20 }}>
              Paket <strong>"{deleteConfirm.title}"</strong> akan dihapus permanen dari database.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ padding:"9px 20px", borderRadius:8, border:"1px solid #E5E7EB",
                  background:"#fff", color:"#374151", fontSize:14, cursor:"pointer", fontWeight:600 }}>
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirm.firebaseId)}
                style={{ padding:"9px 20px", borderRadius:8, border:"none",
                  background:"#DC2626", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>
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
   WRITER DIRECTORY VIEW — data dari /users (role=writer) + /articles
───────────────────────────────────────────── */
function WriterDirectoryView({ articles }) {
  const [writers, setWriters] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const unsub = onValue(ref(db, "users"), snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([uid, v]) => ({ uid, ...v }))
          .filter(u => u.role === "writer");
        setWriters(list);
      } else {
        setWriters([]);
      }
    });
    return () => unsub();
  }, []);

  const getStats = (w) => {
    const aliases = [w.displayName, ...(w.authorAliases || [])].filter(Boolean);
    const mine = articles.filter(a =>
      (w.uid && a.authorUid === w.uid) ||
      (!a.authorUid && aliases.includes(a.author))
    );
    return {
      count:      mine.length,
      published:  mine.filter(a => a.status === "published").length,
      pending:    mine.filter(a => a.status === "pending").length,
      revision:   mine.filter(a => a.status === "revision").length,
      totalViews: mine.reduce((s, a) => s + (a.views || 0), 0),
    };
  };

  // Fallback: jika belum ada user di /users, tampilkan dari data artikel
  const articleWriters = writers.length === 0
    ? [...new Map(articles.map(a => [a.authorUid || a.author, {
        uid: a.authorUid || null,
        displayName: a.author,
        email: null,
        role: "writer",
      }])).values()]
    : [];

  const allWriters = writers.length > 0 ? writers : articleWriters;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Writer Directory</h1>
      <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>
        {allWriters.length} penulis terdaftar · data realtime dari Firebase
      </p>
      {allWriters.length === 0 ? (
        <p style={{ color: "#6B7280", fontSize: 14 }}>Belum ada data penulis.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {allWriters.map(w => {
            const stats = getStats(w);
            const initials = w.displayName
              ? w.displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
              : "W";
            return (
              <div key={w.uid || w.displayName} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 18px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E8F4EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#1B3A2A", margin: "0 auto 12px" }}>
                  {initials}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{w.displayName || "—"}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>{w.email || "Writer"}</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  <div style={{ fontSize: 12, background: "#E8F4EE", color: "#1B3A2A", borderRadius: 20, padding: "3px 12px", fontWeight: 600 }}>{stats.count} artikel</div>
                  <div style={{ fontSize: 12, background: "#E8F5E9", color: "#1B5E20", borderRadius: 20, padding: "3px 12px", fontWeight: 600 }}>{stats.published} published</div>
                </div>
                {(stats.pending > 0 || stats.revision > 0 || stats.totalViews > 0) && (
                  <div style={{ marginTop: 8, display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                    {stats.pending > 0 && <span style={{ fontSize: 10, background: "#FFF8E1", color: "#F57F17", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>{stats.pending} pending</span>}
                    {stats.revision > 0 && <span style={{ fontSize: 10, background: "#FBE9E7", color: "#BF360C", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>{stats.revision} revisi</span>}
                    {stats.totalViews > 0 && <span style={{ fontSize: 10, background: "#EFF6FF", color: "#1565C0", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>{stats.totalViews.toLocaleString()} views</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EDITOR PORTAL
───────────────────────────────────────────── */
export default function EditorPortal({ externalArticles = [], onUpdateStatus, currentUser }) {
  const [activeNav, setActiveNav]         = useState("dashboard");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [feedback, setFeedback]           = useState("");
  const [showConfirm, setShowConfirm]     = useState(null);
  const [statusFilter, setStatusFilter]   = useState("pending");

  // profileName — selalu baca dari Realtime DB (sumber kebenaran)
  // Firebase Auth displayName TIDAK reliable setelah re-login
  const [profileName, setProfileName] = useState("");
  useEffect(() => {
    if (!currentUser?.uid) return;
    const db2 = getDatabase();
    const userRef = ref(db2, `users/${currentUser.uid}`);
    const unsub = onValue(userRef, (snap) => {
      const data = snap.val();
      if (data?.displayName) {
        setProfileName(data.displayName);
        // Sinkronkan balik ke Firebase Auth jika perlu
        if (currentUser.displayName !== data.displayName)
          updateProfile(currentUser, { displayName: data.displayName }).catch(() => {});
      } else if (currentUser?.displayName) {
        setProfileName(currentUser.displayName);
        // Tulis ke DB agar sesi berikutnya sudah ada
        update(ref(db2, `users/${currentUser.uid}`), { displayName: currentUser.displayName }).catch(() => {});
      }
    });
    return () => unsub();
  }, [currentUser?.uid]);

  // ── realtime data for dashboard ──
  const [produkList, setProdukList]           = useState([]);
  const [galleryList, setGalleryList]         = useState([]);
  const [attractionsList, setAttractionsList] = useState([]);
  const [ticketsList, setTicketsList]         = useState([]);
  useEffect(() => {
    const db = getDatabase();
    const unsubP = onValue(ref(db, "produk"), snap => {
      const d = snap.val();
      setProdukList(d ? Object.entries(d).map(([k,v])=>({...v, firebaseId:k})) : []);
    });
    const unsubG = onValue(ref(db, "gallery"), snap => {
      const d = snap.val();
      setGalleryList(d ? Object.entries(d).map(([k,v])=>({...v, firebaseId:k})) : []);
    });
    const unsubA = onValue(ref(db, "attractions"), snap => {
      const d = snap.val();
      setAttractionsList(d ? Object.entries(d).map(([k,v])=>({...v, firebaseId:k})) : []);
    });
    const unsubT = onValue(ref(db, "ticketsOnline"), snap => {
      const d = snap.val();
      setTicketsList(d ? Object.entries(d).map(([k,v])=>({...v, firebaseId:k})) : []);
    });
    return () => { unsubP(); unsubG(); unsubA(); unsubT(); };
  }, []);

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
      <aside style={{ width: 220, background: "linear-gradient(180deg, #1a3828 0%, #0f2318 100%)", height: "100vh", position: "fixed", display: "flex", flexDirection: "column", zIndex: 100, boxShadow: "4px 0 24px rgba(0,0,0,0.18)" }}>
        {/* Brand */}
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "linear-gradient(135deg, #2d6a4f, #16c35b)", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 10px rgba(22,195,91,0.3)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "#fff", fontSize: 15, fontFamily: "Georgia, serif", lineHeight: 1.2, letterSpacing: "-0.01em" }}>Edupark</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 1 }}>Editor Portal</div>
          </div>
        </div>

        {/* Section label */}
        <div style={{ padding: "14px 18px 6px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Menu</div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "4px 10px", overflowY: "auto" }}>
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeNav === id;
            // badge counts
            const badge = id === "review" ? articles.filter(a=>a.status==="pending").length
                        : id === "produk" ? produkList.length
                        : id === "gallery" ? galleryList.length
                        : id === "attractions" ? attractionsList.length
                        : id === "ticketonline" ? ticketsList.length
                        : id === "writers" ? [...new Set(articles.map(a=>a.author))].length
                        : null;
            return (
              <button key={id}
                onClick={() => { setActiveNav(id); setSelectedArticle(null); }}
                style={{
                  display: "flex", alignItems: "center", gap: 9, width: "100%",
                  padding: "9px 10px", borderRadius: 8, marginBottom: 2,
                  background: active ? "rgba(22,195,91,0.15)" : "transparent",
                  border: active ? "1px solid rgba(22,195,91,0.2)" : "1px solid transparent",
                  cursor: "pointer",
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                  textAlign: "left", fontSize: 13, fontFamily: "inherit",
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s", boxSizing: "border-box",
                  position: "relative",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="rgba(255,255,255,0.75)"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; }}}>
                {active && <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:18, borderRadius:2, background:"#16c35b" }} />}
                <Icon active={active} />
                <span style={{ flex:1 }}>{label}</span>
                {badge > 0 && (
                  <span style={{ fontSize:10, fontWeight:700, background: id==="review" ? "#F57F17" : "rgba(22,195,91,0.3)", color: id==="review" ? "#fff" : "#16c35b", borderRadius:10, padding:"1px 6px", minWidth:18, textAlign:"center" }}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div style={{ padding: "6px 10px 4px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            onClick={() => { setActiveNav("settings"); setSelectedArticle(null); }}
            style={{
              display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 10px",
              borderRadius: 8,
              background: activeNav === "settings" ? "rgba(22,195,91,0.15)" : "transparent",
              border: activeNav === "settings" ? "1px solid rgba(22,195,91,0.2)" : "1px solid transparent",
              cursor: "pointer",
              color: activeNav === "settings" ? "#fff" : "rgba(255,255,255,0.5)",
              textAlign: "left", fontSize: 13, fontFamily: "inherit",
              fontWeight: activeNav === "settings" ? 600 : 400,
              transition: "all 0.15s", boxSizing: "border-box",
            }}
            onMouseEnter={e => { if (activeNav!=="settings") { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="rgba(255,255,255,0.75)"; }}}
            onMouseLeave={e => { if (activeNav!=="settings") { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; }}}>
            <SettingsIcon active={activeNav === "settings"} /> Settings
          </button>
        </div>

        {/* User */}
        <div style={{ padding: "12px 16px 14px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#2d6a4f,#16c35b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow:"0 2px 8px rgba(22,195,91,0.3)" }}>
              {profileName ? profileName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "ED"}
            </div>
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{profileName || "Editor"}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Editor Portal</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, marginLeft: 220, padding: "32px 40px" }}>

        {/* DASHBOARD */}
        {activeNav === "dashboard" && !selectedArticle && (() => {
          const now = new Date();
          const greeting = now.getHours() < 11 ? "Selamat pagi" : now.getHours() < 15 ? "Selamat siang" : now.getHours() < 18 ? "Selamat sore" : "Selamat malam";
          const pendingArts = articles.filter(a => a.status === "pending");
          const publishedArts = articles.filter(a => a.status === "published");
          const revisionArts = articles.filter(a => a.status === "revision");
          const uniqueWriters = [...new Set(articles.map(a => a.author))];
          const recentGallery = [...galleryList].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,4);
          const recentProduk = [...produkList].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,3);

          return (
          <div>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
              <div>
                <div style={{ fontSize:12, color:"#16c35b", fontWeight:600, letterSpacing:"0.04em", textTransform:"uppercase", marginBottom:4 }}>{greeting}, Editor</div>
                <h1 style={{ fontSize:26, fontWeight:800, color:"#111827", margin:0, letterSpacing:"-0.02em" }}>Dashboard Overview</h1>
                <p style={{ color:"#9CA3AF", fontSize:13, margin:"4px 0 0" }}>
                  {now.toLocaleDateString("id-ID", { weekday:"long", day:"numeric", month:"long", year:"numeric" })} · Data realtime dari Firebase
                </p>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>setActiveNav("review")}
                  style={{ padding:"9px 18px", background:"#1B3A2A", color:"#fff", border:"none", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
                  <ReviewIcon active={true} /> Review Artikel
                </button>
              </div>
            </div>

            {/* ── ROW 1: 4 stat cards (artikel) ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:18 }}>
              {[
                { label:"Pending Review", val:pendingArts.length, bg:"#FFFBEB", border:"#FDE68A", valColor:"#D97706", sub:"artikel menunggu",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                { label:"Published", val:publishedArts.length, bg:"#F0FDF4", border:"#BBF7D0", valColor:"#16a34a", sub:"artikel tayang",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
                { label:"In Revision", val:revisionArts.length, bg:"#FFF7ED", border:"#FED7AA", valColor:"#EA580C", sub:"perlu diperbaiki",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg> },
                { label:"Total Views", val:totalViews, bg:"#EFF6FF", border:"#BFDBFE", valColor:"#2563EB", sub:"total pembaca",
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
              ].map(s=>(
                <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:12, padding:"16px 18px 14px", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", right:14, top:14, opacity:0.5 }}>{s.icon}</div>
                  <div style={{ fontSize:11, color:"#6B7280", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>{s.label}</div>
                  <div style={{ fontSize:30, fontWeight:700, color:s.valColor, lineHeight:1, marginBottom:4 }}>{s.val.toLocaleString()}</div>
                  <div style={{ fontSize:11, color:"#9CA3AF" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* ── ROW 2: 3 module stat cards (produk, gallery, writers) ── */}
            {/* ── ROW 2: 5 module stat cards ── */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(5,1fr)",
              gap:14,
              marginBottom:18
            }}>
              {[
                { label:"Total Produk", val:produkList.length, sub:`${DEFAULT_PRODUK_CATEGORIES.map(c=>produkList.filter(p=>p.category===c).length).join(" · ")} per kategori`, valColor:"#6D28D9", bg:"#FAF5FF", border:"#DDD6FE", onClick:()=>setActiveNav("produk"),
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
                { label:"Gallery Item", val:galleryList.length, sub:`${DEFAULT_GALLERY_CATEGORIES.map(c=>galleryList.filter(g=>g.category===c).length).join(" · ")} per kategori`, valColor:"#0E7490", bg:"#ECFEFF", border:"#A5F3FC", onClick:()=>setActiveNav("gallery"),
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E7490" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
                {
                  label:"Attractions",
                  val:attractionsList.length,
                  sub:"wahana & destinasi aktif",
                  valColor:"#DC2626",
                  bg:"#FEF2F2",
                  border:"#FECACA",
                  onClick:()=>setActiveNav("attractions"),
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="#DC2626" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  )
                },
                {
                  label:"Tiket Online",
                  val:ticketsList.length,
                  sub:"paket tiket tersedia",
                  valColor:"#059669",
                  bg:"#ECFDF5",
                  border:"#A7F3D0",
                  onClick:()=>setActiveNav("tickets"),
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="#059669" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
                      <line x1="9" y1="9" x2="9" y2="9.01"/>
                      <line x1="9" y1="12" x2="9" y2="12.01"/>
                      <line x1="9" y1="15" x2="9" y2="15.01"/>
                    </svg>
                  )
                },  
                { label:"Total Penulis", val:uniqueWriters.length, sub:`${articles.length} total artikel ditulis`, valColor:"#BE185D", bg:"#FDF2F8", border:"#FBCFE8", onClick:()=>setActiveNav("writers"),
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
              ].map(s=>(
                <div key={s.label} onClick={s.onClick} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:12, padding:"16px 18px 14px", cursor:"pointer", transition:"box-shadow 0.15s", position:"relative", overflow:"hidden" }}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.07)";}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
                  <div style={{ position:"absolute", right:14, top:14, opacity:0.45 }}>{s.icon}</div>
                  <div style={{ fontSize:11, color:"#6B7280", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>{s.label}</div>
                  <div style={{ fontSize:30, fontWeight:700, color:s.valColor, lineHeight:1, marginBottom:4 }}>{s.val}</div>
                  <div style={{ fontSize:11, color:"#9CA3AF" }}>{s.sub}</div>
                  <div style={{ position:"absolute", bottom:12, right:14, fontSize:11, color:s.valColor, fontWeight:500, opacity:0.6 }}>Lihat →</div>
                </div>
              ))}
            </div>

            {/* ── ROW 3: Artikel pending + Produk terbaru ── */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16, marginBottom:16 }}>

              {/* Antrean artikel */}
              <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:14, padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                  <div>
                    <h2 style={{ fontSize:15, fontWeight:700, color:"#111827", margin:0 }}>Antrean Artikel Terbaru</h2>
                    <p style={{ fontSize:12, color:"#9CA3AF", margin:"2px 0 0" }}>Artikel menunggu persetujuan editor</p>
                  </div>
                  <button onClick={()=>setActiveNav("review")} style={{ fontSize:12, color:"#1B3A2A", background:"#E8F4EE", border:"none", borderRadius:7, padding:"6px 12px", cursor:"pointer", fontWeight:600 }}>Lihat semua →</button>
                </div>
                {pendingArts.length === 0 ? (
                  <div style={{ padding:"28px 0", textAlign:"center" }}>
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><IcoCheck size={32} color="#D1D5DB" /></div>
                    <p style={{ color:"#9CA3AF", fontSize:13, margin:0 }}>Semua artikel sudah diproses!</p>
                  </div>
                ) : (
                  pendingArts.slice(0,5).map((a,i) => (
                    <div key={a.id} onClick={()=>{ setSelectedArticle(a); setActiveNav("review"); }}
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom: i < Math.min(pendingArts.length,5)-1 ? "1px solid #F9FAFB" : "none", cursor:"pointer" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#FAFAFA"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{ width:42, height:42, borderRadius:9, overflow:"hidden", flexShrink:0, background:"#E8F4EE" }}>
                        {a.image ? <img src={a.image} alt={a.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><IcoDoc size={20} color="#9CA3AF" /></div>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, color:"#111827", fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.title}</div>
                        <div style={{ fontSize:11, color:"#9CA3AF", marginTop:1 }}>Oleh <strong style={{color:"#6B7280"}}>{a.author}</strong> · {a.wordCount} kata</div>
                      </div>
                      <span style={{ fontSize:10, background:"#FFF8E1", color:"#D97706", padding:"3px 8px", borderRadius:5, fontWeight:700, flexShrink:0 }}>PENDING</span>
                    </div>
                  ))
                )}
              </div>

              {/* Produk terbaru */}
              <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:14, padding:20, display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                  <div>
                    <h2 style={{ fontSize:15, fontWeight:700, color:"#111827", margin:0 }}>Produk Terbaru</h2>
                    <p style={{ fontSize:12, color:"#9CA3AF", margin:"2px 0 0" }}>{produkList.length} produk aktif</p>
                  </div>
                  <button onClick={()=>setActiveNav("produk")} style={{ fontSize:12, color:"#1B3A2A", background:"#E8F4EE", border:"none", borderRadius:7, padding:"6px 12px", cursor:"pointer", fontWeight:600 }}>Kelola →</button>
                </div>
                {recentProduk.length === 0 ? (
                  <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8, padding:"20px 0" }}>
                    <IcoPackage size={32} color="#D1D5DB" />
                    <p style={{ color:"#9CA3AF", fontSize:12, margin:0, textAlign:"center" }}>Belum ada produk</p>
                  </div>
                ) : (
                  recentProduk.map((p,i)=>(
                    <div key={p.firebaseId} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom: i < recentProduk.length-1 ? "1px solid #F9FAFB" : "none" }}>
                      <div style={{ width:44, height:44, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#f0f0f0" }}>
                        {p.image ? <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><IcoPackage size={20} color="#D1D5DB" /></div>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, fontSize:13, color:"#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                        <div style={{ fontSize:11, color:"#16c35b", fontWeight:700 }}>Rp {p.price?.toLocaleString("id-ID")}</div>
                      </div>
                      <span style={{ fontSize:10, background:"#E8F4EE", color:"#1B3A2A", padding:"3px 7px", borderRadius:5, fontWeight:600, flexShrink:0 }}>{p.category?.split(" ")[0]}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ── ROW 4: Gallery preview + Writer activity ── */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16 }}>

              {/* Gallery preview */}
              <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:14, padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                  <div>
                    <h2 style={{ fontSize:15, fontWeight:700, color:"#111827", margin:0 }}>Gallery Terbaru</h2>
                    <p style={{ fontSize:12, color:"#9CA3AF", margin:"2px 0 0" }}>{galleryList.length} item di semua kategori</p>
                  </div>
                  <button onClick={()=>setActiveNav("gallery")} style={{ fontSize:12, color:"#1B3A2A", background:"#E8F4EE", border:"none", borderRadius:7, padding:"6px 12px", cursor:"pointer", fontWeight:600 }}>Kelola →</button>
                </div>
                {recentGallery.length === 0 ? (
                  <div style={{ padding:"28px 0", textAlign:"center" }}>
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><IcoImage size={32} color="#D1D5DB" /></div>
                    <p style={{ color:"#9CA3AF", fontSize:13, margin:0 }}>Belum ada item gallery</p>
                  </div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                    {recentGallery.map(item=>(
                      <div key={item.firebaseId} style={{ borderRadius:10, overflow:"hidden", position:"relative", aspectRatio:"1", background:"#f0f0f0", cursor:"pointer" }}
                        onClick={()=>setActiveNav("gallery")}>
                        {item.image
                          ? <img src={item.image} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><IcoImage size={24} color="#D1D5DB" /></div>
                        }
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.65), transparent)", display:"flex", alignItems:"flex-end" }}>
                          <div style={{ padding:"8px 8px 7px", width:"100%", boxSizing:"border-box" }}>
                            <div style={{ fontSize:10, fontWeight:700, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.title}</div>
                            <div style={{ fontSize:9, color:"rgba(255,255,255,0.7)" }}>{item.category}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* category breakdown bar */}
                {galleryList.length > 0 && (
                  <div style={{ marginTop:14, display:"flex", gap:8, flexWrap:"wrap" }}>
                    {DEFAULT_GALLERY_CATEGORIES.map(cat=>{
                      const cnt = galleryList.filter(g=>g.category===cat).length;
                      const pct = galleryList.length ? Math.round(cnt/galleryList.length*100) : 0;
                      return cnt > 0 ? (
                        <div key={cat} style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:"#16c35b", opacity: 0.4 + (pct/100)*0.6 }} />
                          <span style={{ fontSize:11, color:"#6B7280" }}>{cat} <strong style={{color:"#374151"}}>{cnt}</strong></span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Writer leaderboard */}
              <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:14, padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                  <div>
                    <h2 style={{ fontSize:15, fontWeight:700, color:"#111827", margin:0 }}>Top Penulis</h2>
                    <p style={{ fontSize:12, color:"#9CA3AF", margin:"2px 0 0" }}>Berdasarkan artikel published</p>
                  </div>
                  <button onClick={()=>setActiveNav("writers")} style={{ fontSize:12, color:"#1B3A2A", background:"#E8F4EE", border:"none", borderRadius:7, padding:"6px 12px", cursor:"pointer", fontWeight:600 }}>Semua →</button>
                </div>
                {uniqueWriters.length === 0 ? (
                  <div style={{ padding:"28px 0", textAlign:"center" }}>
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><WritersIcon active={false} /></div>
                    <p style={{ color:"#9CA3AF", fontSize:12, margin:0 }}>Belum ada penulis</p>
                  </div>
                ) : (
                  [...new Map(articles.map(a=>[a.author,{
                    name:a.author, role:a.role||"Writer",
                    total:articles.filter(x=>x.author===a.author).length,
                    published:articles.filter(x=>x.author===a.author&&x.status==="published").length,
                  }])).values()]
                  .sort((a,b)=>b.published-a.published)
                  .slice(0,5)
                  .map((w,i)=>(
                    <div key={w.name} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom: i < 4 ? "1px solid #F9FAFB" : "none" }}>
                      <div style={{ width:22, height:22, borderRadius:6, background: i===0?"#FEF9C3":i===1?"#F1F5F9":i===2?"#FFF7ED":"#F9FAFB", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color: i===0?"#D97706":i===1?"#64748B":i===2?"#EA580C":"#9CA3AF", flexShrink:0 }}>
                        {i+1}
                      </div>
                      <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#E8F4EE,#bbf7d0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#1B3A2A", flexShrink:0 }}>
                        {w.name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() || "W"}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:600, color:"#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{w.name}</div>
                        <div style={{ fontSize:10, color:"#9CA3AF" }}>{w.published} published · {w.total} total</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          );
        })()}

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
                        {article.image ? <img src={article.image} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><IcoDoc size={22} color="#9CA3AF" /></div>}
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
          <WriterDirectoryView articles={articles} />
        )}

        {/* PRODUK */}
        {activeNav === "produk" && <ProdukView />}

        {/* GALLERY */}
        {activeNav === "gallery" && <GalleryView />}

        {/* ATTRACTIONS */}
        {activeNav === "attractions" && <AttractionsView />}

        {/* TICKETS ONLINE */}
        {activeNav === "ticketonline" && <TicketsOnlineView />}

        {/* SETTINGS */}
        {activeNav === "settings" && <EditorSettingsView onLogout={handleLogout} onNameChange={setProfileName} />}

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