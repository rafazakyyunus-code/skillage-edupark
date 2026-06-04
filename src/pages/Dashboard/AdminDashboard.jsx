import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  PenSquare,
  FileText,
  BarChart3,
  ClipboardList,
  Users,
  ShoppingBag,
  Image,
  LogOut,
  Bell,
  Shield,
  UserPlus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  BookOpen,
  AlertCircle,
  Save,
  X,
  Search,
  Plus,
  RefreshCw,
  UserCheck,
  Send,
  ArrowLeft,
  Loader,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  ImagePlus,
  Upload,
  MapPin,
  Ticket,
  Settings,
  Gift,
  Tag,
  Percent,
  Package,
  Truck,
  CreditCard,
  ToggleLeft,
  ToggleRight,
  Star,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExt from "@tiptap/extension-underline";
import ImageExtension from "@tiptap/extension-image";
import "./adminDashboard.css";
import "./createArticle.css";

import {
  ref,
  onValue,
  update,
  remove,
  push,
  set,
} from "firebase/database";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const ROLES = ["admin", "editor", "writer"];

/* Force semua URL gambar ke https:// dan gunakan proxy untuk i.ibb.co
   yang sering ERR_SSL_VERSION_OR_CIPHER_MISMATCH */
const safeImg = (url) => {
  if (!url) return "";
  let u = url.replace(/^http:\/\//i, "https://");
  if (/i\.ibb\.co/i.test(u)) {
    return "https://images.weserv.nl/?url=" + encodeURIComponent(u);
  }
  return u;
};

const ROLE_COLORS = {
  admin:  { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
  editor: { bg: "#DBEAFE", text: "#1E40AF", border: "#BFDBFE" },
  writer: { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0" },
};

const STATUS_COLORS = {
  pending:   { bg: "#FFF8E1", text: "#F57F17", label: "Pending" },
  revision:  { bg: "#FBE9E7", text: "#BF360C", label: "Revision" },
  published: { bg: "#E8F5E9", text: "#1B5E20", label: "Published" },
  draft:     { bg: "#F3F4F6", text: "#4B5563", label: "Draft" },
};

const PRODUK_CATEGORIES = ["Hewan Peternakan", "Sayuran", "Saprodi"];
const PRODUK_BADGES = [
  { value: "",        label: "Tidak Ada" },
  { value: "NEW",     label: "NEW" },
  { value: "HOT",     label: "HOT" },
  { value: "EDUKASI", label: "EDUKASI" },
];
const GALLERY_CATEGORIES = ["Peternakan", "Perkebunan", "Workshop", "Pengunjung"];
const ARTICLE_CATEGORIES = [
  "Education Technology","AI & Machine Learning","STEM Education",
  "Early Childhood","Higher Education","K-12","EdTech",
];

const PRODUK_BLANK = {
  name: "", category: "Hewan Peternakan", price: "", desc: "",
  badge: "", badgeColor: "green", image: "",
  feature1: "Produk berkualitas tinggi dari peternakan organik.",
  feature2: "Hands-on experience dengan standar industri Fortune 500.",
  feature3: "Mendapatkan dukungan penuh dari tim ahli kami.",
};
const GALLERY_BLANK = { title: "", category: "Peternakan", desc: "", image: "" };

/* ─────────────────────────────────────────────
   NAV STRUCTURE
───────────────────────────────────────────── */
const NAV = [
  { id: "dashboard",        label: "Dashboard",        Icon: LayoutDashboard, section: null },
  {
    section: "Artikel",
    items: [
      { id: "create-article",  label: "Buat Artikel",     Icon: PenSquare },
      { id: "my-articles",     label: "My Articles",       Icon: BookOpen },
      { id: "all-articles",    label: "Semua Artikel",     Icon: FileText },
      { id: "analytics",       label: "Analytics",         Icon: BarChart3 },
    ],
  },
  {
    section: "Konten",
    items: [
      { id: "review-articles", label: "Review Articles",   Icon: ClipboardList },
      { id: "produk",          label: "Produk",             Icon: ShoppingBag },
      { id: "gallery",         label: "Gallery",            Icon: Image },
      { 
      id: "attractions", 
      label: "Attractions", 
      Icon: ({ active }) => (
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none"
          stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
      { id: "tiket-online",    label: "Tiket Online",       Icon: Ticket },
      { id: "promo",           label: "Manajemen Promo",    Icon: Gift },
    ],
  },
  {
    section: "Pengguna",
    items: [
      { id: "writer-directory",label: "Writer Directory",  Icon: Users },
      { id: "manage-users",    label: "Manage Users",      Icon: Shield },
      { id: "add-role",        label: "Add / Edit Role",   Icon: UserPlus },
    ],
  },
];

/* ─────────────────────────────────────────────
   SHARED INLINE STYLE HELPERS
───────────────────────────────────────────── */
const card = { background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"20px 22px" };
const sectionLabel = { display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:14 };
const fieldLabel = { display:"block", fontSize:12, fontWeight:600, color:"#6B7280", marginBottom:5 };
const inputStyle = {
  width:"100%", padding:"9px 12px", borderRadius:8,
  border:"1px solid #D1D5DB", fontSize:14, boxSizing:"border-box",
  fontFamily:"inherit", color:"#111827", outline:"none",
};

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
function Sidebar({ activeNav, setActiveNav, currentUser, pendingCount, myRevisionCount }) {
  const [open, setOpen] = useState({ Artikel: true, Konten: true, Pengguna: false });

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  const navBtn = (id, label, Icon, badge) => {
    const active = activeNav === id;
    return (
      <button key={id} onClick={() => setActiveNav(id)}
        className={`ad-nav-btn${active ? " ad-nav-btn--active" : ""}`}>
        {active && <span className="ad-nav-indicator" />}
        <Icon size={16} />
        <span className="ad-nav-label">{label}</span>
        {badge > 0 && <span className="ad-nav-badge">{badge}</span>}
      </button>
    );
  };

  return (
    <aside className="ad-sidebar">
      <div className="ad-sidebar__brand">
        <div className="ad-sidebar__logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
          </svg>
        </div>
        <div>
          <div className="ad-sidebar__brand-name">Edupark</div>
          <div className="ad-sidebar__brand-sub">Admin Portal</div>
        </div>
      </div>

      <nav className="ad-sidebar__nav">
        {navBtn("dashboard", "Dashboard", LayoutDashboard, 0)}
        {NAV.filter(n => n.section).map(({ section, items }) => (
          <div key={section}>
            <button className="ad-section-toggle" onClick={() => setOpen(p => ({ ...p, [section]: !p[section] }))}>
              <span className="ad-section-label">{section}</span>
              {open[section] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
            {open[section] && (
              <div className="ad-section-items">
                {items.map(({ id, label, Icon }) =>
                  navBtn(id, label, Icon,
                    id === "review-articles" ? pendingCount :
                    id === "my-articles" ? myRevisionCount : 0)
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Settings at bottom – same pattern as Editor & CreateArticle */}
      <div className="ad-sidebar__settings">
        <button
          onClick={() => setActiveNav("settings")}
          className={`ad-nav-btn${activeNav === "settings" ? " ad-nav-btn--active" : ""}`}>
          {activeNav === "settings" && <span className="ad-nav-indicator" />}
          <Settings size={16} />
          <span className="ad-nav-label">Settings</span>
        </button>
      </div>

      <div className="ad-sidebar__user">
        <div className="ad-avatar">{initials}</div>
        <div className="ad-user-info">
          <div className="ad-user-name">{currentUser?.displayName || "Admin"}</div>
          <div className="ad-user-role">Administrator</div>
        </div>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────── */
function Topbar({ activeNav, onLogout, pendingCount }) {
  const LABELS = {
    dashboard: "Dashboard", "create-article": "Buat Artikel",
    "my-articles": "My Articles",
    "all-articles": "Semua Artikel", analytics: "Analytics",
    "review-articles": "Review Articles", "writer-directory": "Writer Directory",
    produk: "Produk", gallery: "Gallery",
    "manage-users": "Manage Users", "add-role": "Add / Edit Role",
    settings: "Settings",
  };
  return (
    <header className="ad-topbar">
      <div className="ad-breadcrumb">
        <span>Admin</span>
        <ChevronRight size={13} />
        <span className="ad-breadcrumb__current">{LABELS[activeNav] || activeNav}</span>
      </div>
      <div className="ad-topbar__actions">
        <div style={{ fontSize:11, background:"#FEE2E2", color:"#991B1B", borderRadius:20, padding:"3px 10px", fontWeight:700, letterSpacing:"0.04em" }}>ADMIN</div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
function Toast({ msg }) {
  if (!msg) return null;
  const isError = msg.startsWith("✗");
  const text = msg.replace(/^[✓✗]\s*/, "");
  return (
    <div style={{
      position:"fixed", top:24, right:24, zIndex:9999,
      padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600,
      background: isError ? "#DC2626" : "#1B3A2A", color:"#fff",
      boxShadow:"0 4px 20px rgba(0,0,0,0.2)", animation:"fadeInRight 0.3s ease",
      display:"flex", alignItems:"center", gap:8,
    }}>
      {isError
        ? <XCircle size={16} color="#fff" />
        : <CheckCircle size={16} color="#fff" />}
      {text}
    </div>
  );
}

function useToast() {
  const [msg, setMsg] = useState("");
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };
  return [msg, show];
}

/* ─────────────────────────────────────────────
   DELETE CONFIRM MODAL
───────────────────────────────────────────── */
function DeleteModal({ name, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
      <div style={{ background:"#fff", padding:28, borderRadius:14, width:340, textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}>
          <AlertCircle size={36} color="#DC2626" />
        </div>
        <h3 style={{ margin:"0 0 8px", color:"#111827", fontSize:17, fontWeight:700 }}>Konfirmasi Hapus</h3>
        <p style={{ color:"#6B7280", fontSize:13, marginBottom:20 }}>
          <strong>"{name}"</strong> akan dihapus permanen dari database.
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <button onClick={onCancel} style={{ padding:"9px 20px", borderRadius:8, border:"1px solid #E5E7EB", background:"#fff", color:"#374151", fontSize:14, cursor:"pointer", fontWeight:600 }}>Batal</button>
          <button onClick={onConfirm} style={{ padding:"9px 20px", borderRadius:8, border:"none", background:"#DC2626", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>Ya, Hapus</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD VIEW
───────────────────────────────────────────── */
function DashboardView({ articles, users, products, gallery, attractions, ticketsOnline, promos = [], setActiveNav, currentUser }) {
  const published      = articles.filter(a => a.status === "published").length;
  const pending        = articles.filter(a => a.status === "pending").length;
  const totalViews     = articles.reduce((s, a) => s + (a.views || 0), 0);
  const totalUsers     = users.length;
  const adminCount     = users.filter(u => u.role === "admin").length;
  const editorCount    = users.filter(u => u.role === "editor").length;
  const writerCount    = users.filter(u => u.role === "writer").length;
  const recentArts     = [...articles].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,5);
  const featuredTickets = (ticketsOnline||[]).filter(t => t.featured).length;
  const activePromos    = promos.filter(p => p.active && (!p.endDate || new Date(p.endDate).getTime() > Date.now())).length;
  const nearestPromo    = [...promos].filter(p => p.active && p.endDate && new Date(p.endDate).getTime() > Date.now()).sort((a,b)=>new Date(a.endDate)-new Date(b.endDate))[0];

  // Admin's own articles
  const myArticles  = articles.filter(a => a.authorUid === currentUser?.uid);
  const myRevision  = myArticles.filter(a => a.status === "revision");
  const myPublished = myArticles.filter(a => a.status === "published");
  const myPending   = myArticles.filter(a => a.status === "pending");
  const myLatest    = [...myArticles].sort((a,b) => (b.createdAt||0)-(a.createdAt||0)).slice(0, 3);

  const STAT_CARDS = [
    { label:"Total Artikel",  value:articles.length,              color:"#1B3A2A", Icon:FileText,    sub:`${published} published`,                          nav:"all-articles" },
    { label:"Total Views",    value:totalViews.toLocaleString(),  color:"#1565C0", Icon:Eye,         sub:"semua artikel",                                   nav:"all-articles" },
    { label:"Pending Review", value:pending,                      color:"#E65100", Icon:AlertCircle, sub:"menunggu review",                                 nav:"review-articles" },
    { label:"Total Produk",   value:products.length,              color:"#0E7490", Icon:ShoppingBag, sub:"item terdaftar",                                  nav:"produk" },
    { label:"Gallery Item",   value:gallery.length,               color:"#6D28D9", Icon:Image,       sub:"foto terupload",                                  nav:"gallery" },
    { label:"Total Pengguna", value:totalUsers,                   color:"#5B21B6", Icon:Users,       sub:`${writerCount}W · ${editorCount}E · ${adminCount}A`, nav:"manage-users" },
    { label:"Attractions",    value:(attractions||[]).length,     color:"#065F46", Icon:MapPin,      sub:"lokasi wisata aktif",                             nav:"attractions" },
    { label:"Tiket Online",   value:(ticketsOnline||[]).length,   color:"#B45309", Icon:Ticket,      sub:`${featuredTickets} unggulan`,                     nav:"tiket-online" },
    { label:"Promo Aktif",    value:activePromos,                 color:"#7C3AED", Icon:Gift,        sub: nearestPromo ? `Terdekat: ${nearestPromo.endDate}` : "Kelola penawaran", nav:"promo" },
  ];

  return (
    <div>
      <div className="ad-page-header">
        <h1 className="ad-page-title">Admin Dashboard</h1>
        <p className="ad-page-sub">Overview lengkap seluruh aktivitas platform Skillage Edupark — data realtime</p>
      </div>

      <div className="ad-stats-grid">
        {STAT_CARDS.map(({ label, value, color, Icon, sub, nav }) => (
          <div key={label} className="ad-stat-card"
            onClick={() => nav && setActiveNav(nav)}
            style={{ cursor: nav ? "pointer" : "default", transition:"box-shadow 0.15s" }}
            onMouseEnter={e => { if(nav) e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow=""; }}>
            <div className="ad-stat-card__icon" style={{ background:color+"15", color }}><Icon size={20} /></div>
            <div>
              <div className="ad-stat-card__value" style={{ color }}>{value}</div>
              <div className="ad-stat-card__label">{label}</div>
              <div className="ad-stat-card__sub">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ad-two-col">
        {/* Role breakdown */}
        <div className="ad-card">
          <div className="ad-card__head"><h3 className="ad-card__title">Distribusi Role</h3></div>
          {[
            { role:"admin",  count:adminCount,  label:"Administrator" },
            { role:"editor", count:editorCount, label:"Editor" },
            { role:"writer", count:writerCount, label:"Writer" },
          ].map(({ role, count, label }) => (
            <div key={role} className="ad-role-row">
              <span className="ad-role-badge" style={{ background:ROLE_COLORS[role]?.bg, color:ROLE_COLORS[role]?.text, border:`1px solid ${ROLE_COLORS[role]?.border}` }}>
                {role.toUpperCase()}
              </span>
              <span className="ad-role-row__label">{label}</span>
              <div className="ad-role-bar-wrap">
                <div className="ad-role-bar" style={{ width:totalUsers>0?`${(count/totalUsers)*100}%`:"0%", background:ROLE_COLORS[role]?.text }} />
              </div>
              <span className="ad-role-count">{count}</span>
            </div>
          ))}
        </div>

        {/* Recent Articles */}
        <div className="ad-card">
          <div className="ad-card__head">
            <h3 className="ad-card__title">Artikel Terbaru</h3>
            <button className="ad-see-all" onClick={() => setActiveNav("all-articles")} style={{ display:"flex", alignItems:"center", gap:4 }}>Lihat semua <ChevronRight size={13} /></button>
          </div>
          {recentArts.length === 0
            ? <p className="ad-empty-hint">Belum ada artikel.</p>
            : recentArts.map(a => (
              <div key={a.id} className="ad-recent-row">
                <div className="ad-recent-row__init">{(a.author||"?").split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                <div className="ad-recent-row__info">
                  <div className="ad-recent-row__title">{a.title}</div>
                  <div className="ad-recent-row__meta">{a.author} · {a.date}</div>
                </div>
                <span className="ad-status-badge" style={{ background:STATUS_COLORS[a.status]?.bg, color:STATUS_COLORS[a.status]?.text }}>
                  {STATUS_COLORS[a.status]?.label || a.status}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Attractions & Tiket Online Preview Row */}
      <div className="ad-two-col" style={{ marginTop:16 }}>
        {/* Attractions Preview */}
        <div className="ad-card">
          <div className="ad-card__head">
            <h3 className="ad-card__title" style={{ display:"flex", alignItems:"center", gap:7 }}>
              <MapPin size={16} color="#065F46" /> Attractions Terbaru
            </h3>
            <button className="ad-see-all" onClick={() => setActiveNav("attractions")} style={{ display:"flex", alignItems:"center", gap:4 }}>
              Kelola <ChevronRight size={13} />
            </button>
          </div>
          {(!attractions || attractions.length === 0) ? (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <MapPin size={32} color="#D1D5DB" style={{ marginBottom:8, display:"block", margin:"0 auto 8px" }} />
              <p className="ad-empty-hint">Belum ada attraction. <button onClick={() => setActiveNav("attractions")} style={{ background:"none", border:"none", color:"#1B3A2A", cursor:"pointer", fontWeight:600 }}>Tambah →</button></p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column" }}>
              {[...attractions].sort((a,b)=>(b.createdAt||"")>(a.createdAt||"")?-1:1).slice(0,4).map((att,i) => (
                <div key={att.firebaseId||i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
                  <div style={{ width:48, height:48, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#F0FDF4" }}>
                    {att.image
                      ? <img src={safeImg(att.image)} alt={att.title||att.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}><MapPin size={20} color="#D1D5DB" /></div>
                    }
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{att.title || att.name}</div>
                    <div style={{ fontSize:11, color:"#6B7280", marginTop:2, display:"flex", alignItems:"center", gap:4 }}>
                      <MapPin size={10} />{att.location || att.category}
                    </div>
                  </div>
                  {att.badge && (
                    <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4, background: att.badge==="HOT"?"#FEE2E2":"#D1FAE5", color: att.badge==="HOT"?"#DC2626":"#065F46", flexShrink:0 }}>{att.badge}</span>
                  )}
                </div>
              ))}
              {attractions.length > 4 && (
                <button onClick={() => setActiveNav("attractions")} style={{ fontSize:12, color:"#1B3A2A", background:"none", border:"none", cursor:"pointer", fontWeight:600, padding:"10px 0 4px", textAlign:"left" }}>
                  +{attractions.length - 4} attraction lainnya →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tiket Online Preview */}
        <div className="ad-card">
          <div className="ad-card__head">
            <h3 className="ad-card__title" style={{ display:"flex", alignItems:"center", gap:7 }}>
              <Ticket size={16} color="#B45309" /> Paket Tiket Online
            </h3>
            <button className="ad-see-all" onClick={() => setActiveNav("tiket-online")} style={{ display:"flex", alignItems:"center", gap:4 }}>
              Kelola <ChevronRight size={13} />
            </button>
          </div>
          {(!ticketsOnline || ticketsOnline.length === 0) ? (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <Ticket size={32} color="#D1D5DB" style={{ display:"block", margin:"0 auto 8px" }} />
              <p className="ad-empty-hint">Belum ada paket tiket. <button onClick={() => setActiveNav("tiket-online")} style={{ background:"none", border:"none", color:"#1B3A2A", cursor:"pointer", fontWeight:600 }}>Tambah →</button></p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column" }}>
              {[...ticketsOnline].sort((a,b)=>(b.featured?1:0)-(a.featured?1:0)).slice(0,4).map((tick,i) => (
                <div key={tick.firebaseId||i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #F3F4F6" }}>
                  <div style={{ width:48, height:48, borderRadius:8, overflow:"hidden", flexShrink:0, background:"#FFFBEB" }}>
                    {tick.image
                      ? <img src={safeImg(tick.image)} alt={tick.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}><Ticket size={20} color="#D1D5DB" /></div>
                    }
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#111827", display:"flex", alignItems:"center", gap:6, overflow:"hidden" }}>
                      <span style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{tick.title}</span>
                      {tick.featured && <span style={{ fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:3, background:"#D1FAE5", color:"#065F46", flexShrink:0 }}>UNGGULAN</span>}
                    </div>
                    <div style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>
                      WD: <span style={{ color:"#065F46", fontWeight:600 }}>{tick.weekday}</span> · WE: <span style={{ color:"#065F46", fontWeight:600 }}>{tick.weekend}</span>
                    </div>
                  </div>
                </div>
              ))}
              {ticketsOnline.length > 4 && (
                <button onClick={() => setActiveNav("tiket-online")} style={{ fontSize:12, color:"#1B3A2A", background:"none", border:"none", cursor:"pointer", fontWeight:600, padding:"10px 0 4px", textAlign:"left" }}>
                  +{ticketsOnline.length - 4} paket lainnya →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick preview: Gallery terbaru */}
      {gallery.length > 0 && (
        <div className="ad-card" style={{ marginTop:16 }}>
          <div className="ad-card__head">
            <h3 className="ad-card__title">Gallery Terbaru</h3>
            <button className="ad-see-all" onClick={() => setActiveNav("gallery")} style={{ display:"flex", alignItems:"center", gap:4 }}>Kelola Gallery <ChevronRight size={13} /></button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(120px,1fr))", gap:10, marginTop:4 }}>
            {[...gallery].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,8).map(g => (
              <div key={g.id} style={{ borderRadius:10, overflow:"hidden", aspectRatio:"1", background:"#f0f0f0", position:"relative", cursor:"pointer" }}
                onClick={() => setActiveNav("gallery")}>
                {g.image && <img src={safeImg(g.image)} alt={g.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />}
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.6),transparent)", display:"flex", alignItems:"flex-end" }}>
                  <div style={{ padding:"6px 8px", fontSize:10, fontWeight:700, color:"#fff", lineHeight:1.3, overflow:"hidden" }}>{g.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="ad-quick-actions">
        {[
          { label:"Review Articles",    nav:"review-articles", Icon:ClipboardList, color:"#1B3A2A" },
          { label:"Buat Artikel",       nav:"create-article",  Icon:PenSquare,     color:"#1565C0" },
          { label:"My Articles",        nav:"my-articles",     Icon:BookOpen,      color:"#7C3AED" },
          { label:"Tambah Produk",      nav:"produk",          Icon:ShoppingBag,   color:"#0E7490" },
          { label:"Upload Gallery",     nav:"gallery",         Icon:Image,         color:"#6D28D9" },
          { label:"Kelola Attractions", nav:"attractions",     Icon:MapPin,        color:"#065F46" },
          { label:"Kelola Tiket",       nav:"tiket-online",    Icon:Ticket,        color:"#B45309" },
        ].map(({ label, nav, Icon, color }) => (
          <button key={nav} className="ad-quick-btn" style={{ borderColor:color+"30" }} onClick={() => setActiveNav(nav)}>
            <div className="ad-quick-btn__icon" style={{ background:color+"15", color }}><Icon size={18} /></div>
            <span className="ad-quick-btn__label">{label}</span>
            <ChevronRight size={14} color="#9CA3AF" />
          </button>
        ))}
      </div>

      {/* My Articles Summary */}
      <div className="ad-card" style={{ marginTop:16 }}>
        <div className="ad-card__head">
          <h3 className="ad-card__title" style={{ display:"flex", alignItems:"center", gap:8 }}>
            <BookOpen size={16} /> My Articles
          </h3>
          <button className="ad-see-all" onClick={() => setActiveNav("my-articles")} style={{ display:"flex", alignItems:"center", gap:4 }}>Lihat semua <ChevronRight size={13} /></button>
        </div>

        {myRevision.length > 0 && (
          <div style={{ marginBottom:14, padding:"10px 14px", background:"#FEF3C7", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#92400E" }}>
              ⚠ {myRevision.length} artikel perlu diperbaiki
            </span>
            <button onClick={() => setActiveNav("my-articles")} style={{ fontSize:12, color:"#92400E", background:"#FDE68A", border:"none", borderRadius:6, padding:"4px 12px", cursor:"pointer", fontWeight:600 }}>Lihat</button>
          </div>
        )}

        <div style={{ display:"flex", gap:12, marginBottom:myLatest.length>0?16:0 }}>
          {[
            { label:"Total", value:myArticles.length, color:"#1B3A2A" },
            { label:"Published", value:myPublished.length, color:"#065F46" },
            { label:"Pending", value:myPending.length, color:"#F57F17" },
            { label:"Revisi", value:myRevision.length, color:"#DC2626" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ flex:1, background:"#F9FAFB", borderRadius:8, padding:"10px 14px", textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:800, color }}>{value}</div>
              <div style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>

        {myLatest.length > 0 ? myLatest.map(a => (
          <div key={a.id} className="ad-recent-row">
            <div className="ad-recent-row__init">{(currentUser?.displayName||"AD").split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
            <div className="ad-recent-row__info">
              <div className="ad-recent-row__title">{a.title}</div>
              <div className="ad-recent-row__meta">{a.category} · {a.wordCount||0} kata · {a.date}</div>
            </div>
            <span className="ad-status-badge" style={{ background:STATUS_COLORS[a.status]?.bg, color:STATUS_COLORS[a.status]?.text }}>
              {a.status==="revision"?"Needs Revision":STATUS_COLORS[a.status]?.label||a.status}
            </span>
          </div>
        )) : (
          <p className="ad-empty-hint">Anda belum menulis artikel. <button onClick={() => setActiveNav("create-article")} style={{ background:"none", border:"none", color:"#1B3A2A", cursor:"pointer", fontWeight:600 }}>Buat sekarang →</button></p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ALL ARTICLES VIEW — filter by category
───────────────────────────────────────────── */
function AllArticlesView({ articles }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const categories = [...new Set(articles.map(a => a.category).filter(Boolean))];

  const displayed = articles
    .filter(a => filter === "all" || a.category === filter)
    .filter(a => !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.author?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="ad-page-header">
        <h1 className="ad-page-title">Semua Artikel</h1>
        <p className="ad-page-sub">{articles.length} artikel tersimpan di platform — data realtime</p>
      </div>
      <div className="ad-toolbar">
        <div className="ad-search-wrap">
          <Search size={14} />
          <input className="ad-search-input" placeholder="Cari artikel atau penulis..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="ad-filter-tabs" style={{ flexWrap: "wrap" }}>
          <button onClick={() => setFilter("all")} className={`ad-filter-tab${filter === "all" ? " ad-filter-tab--active" : ""}`}>
            Semua
            <span className="ad-filter-tab__count">{articles.length}</span>
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`ad-filter-tab${filter === cat ? " ad-filter-tab--active" : ""}`}>
              {cat}
              <span className="ad-filter-tab__count">{articles.filter(a => a.category === cat).length}</span>
            </button>
          ))}
        </div>
      </div>
      {displayed.length === 0
        ? <div className="ad-empty-state"><FileText size={40} color="#D1D5DB" /><p>Tidak ada artikel yang sesuai.</p></div>
        : (
          <div className="ad-article-list">
            {displayed.map(a => (
              <div key={a.id} className="ad-article-row-card">
                <div className="ad-article-row-card__thumb">
                  {a.image ? <img src={safeImg(a.image)} alt={a.title} /> : <FileText size={20} color="#D1D5DB" />}
                </div>
                <div className="ad-article-row-card__body">
                  <div className="ad-article-row-card__cat">{a.category}</div>
                  <div className="ad-article-row-card__title">{a.title}</div>
                  <div className="ad-article-row-card__meta">{a.author} · {a.date} · {(a.views||0).toLocaleString()} views · {a.wordCount||0} kata</div>
                </div>
                <span className="ad-status-badge" style={{ background:STATUS_COLORS[a.status]?.bg, color:STATUS_COLORS[a.status]?.text }}>
                  {STATUS_COLORS[a.status]?.label || a.status}
                </span>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CREATE ARTICLE VIEW — Tiptap rich editor (sama persis dengan CreateArticle.jsx)
───────────────────────────────────────────── */
function CreateArticleView({ currentUser, onDone, editArticle }) {
  const [title, setTitle]       = useState(editArticle?.title || "");
  const [category, setCategory] = useState(editArticle?.category || ARTICLE_CATEGORIES[0]);
  const [image, setImage]       = useState(editArticle?.image || null);
  const [tags, setTags]         = useState(editArticle?.tags || []);
  const [inputTag, setInputTag] = useState("");
  const [visibility, setVisibility] = useState(editArticle?.visibility || "public");
  const [saving, setSaving]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, showToast]      = useToast();
  const isEditing = !!editArticle;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      UnderlineExt,
      ImageExtension,
    ],
    content: editArticle?.content || "",
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    const t = inputTag.trim();
    if (t && !tags.includes(t)) setTags(p => [...p, t]);
    setInputTag("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) return showToast("✗ Judul artikel wajib diisi.");
    const articleContent = editor ? editor.getHTML() : "";
    const wordCount = editor ? editor.getText().split(/\s+/).filter(Boolean).length : 0;
    setSaving(true);
    try {
      const payload = {
        title:     title.trim(),
        category,
        content:   articleContent,
        status:    "pending",
        author:    currentUser?.displayName || "Admin Edupark",
        authorUid: currentUser?.uid || "",
        wordCount,
        date:      new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }),
        image:     image || "",
        tags,
        visibility,
        views:     editArticle?.views || 0,
        feedback:  "",
        createdAt: editArticle?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
      if (isEditing) {
        await update(ref(db, `articles/${editArticle.id}`), payload);
        showToast("✓ Artikel berhasil diperbarui dan dikirim ulang untuk review!");
      } else {
        await push(ref(db, "articles"), payload);
        showToast("✓ Artikel berhasil dikirim untuk review!");
      }
      setSubmitted(true);
    } catch (err) {
      showToast("✗ Gagal simpan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) return showToast("✗ Judul wajib diisi untuk simpan draft.");
    const articleContent = editor ? editor.getHTML() : "";
    const wordCount = editor ? editor.getText().split(/\s+/).filter(Boolean).length : 0;
    setSaving(true);
    try {
      const newId = `draft_${Date.now()}`;
      await set(ref(db, `articles/${newId}`), {
        id: newId,
        title: title.trim(), category,
        content: articleContent, status: "draft",
        author: currentUser?.displayName || "Admin Edupark",
        authorUid: currentUser?.uid || "",
        wordCount, date: new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }),
        image: image || "", tags, visibility, views: 0, feedback: "", createdAt: Date.now(),
      });
      showToast("✓ Draft berhasil disimpan!");
    } catch (err) {
      showToast("✗ Gagal: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (submitted) return (
    <div className="ca-success">
      <div className="ca-success__icon"><CheckCircle size={30} color="#16a34a" /></div>
      <h2>{isEditing ? "Artikel Berhasil Diperbarui!" : "Artikel Berhasil Disubmit!"}</h2>
      <p>{isEditing ? "Artikel sudah dikirim ulang dan menunggu review." : "Artikel sedang dalam proses review oleh editor."}</p>
      <button className="ca-success__btn" onClick={() => { setSubmitted(false); setTitle(""); setImage(null); setTags([]); editor?.commands.clearContent(); onDone?.(); }}>
        {isEditing ? "Kembali ke My Articles" : "+ Tulis Artikel Baru"}
      </button>
    </div>
  );

  return (
    <div>
      <Toast msg={toast} />
      {isEditing && (
        <button onClick={() => onDone?.()} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#6B7280", fontSize:13, cursor:"pointer", fontWeight:500, marginBottom:16 }}>
          <ArrowLeft size={14} /> Kembali ke My Articles
        </button>
      )}
      <div className="ad-page-header">
        <h1 className="ad-page-title">{isEditing ? "Edit Artikel" : "Buat Artikel Baru"}</h1>
        <p className="ad-page-sub">{isEditing ? "Perbaiki dan kirim ulang artikel untuk review" : "Tulis dan publikasikan artikel langsung dari Admin Portal"}</p>
      </div>

      <div className="ca-editor-layout">
        {/* LEFT — Title + Tiptap editor */}
        <div className="ca-left">
          <div className="ca-title-card">
            <div className="ca-title-label">Article Title</div>
            <input
              className="ca-title-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter your catchy title..."
            />
          </div>

          <div className="ca-editor-card">
            <div className="ca-toolbar">
              <button className={`ca-toolbar-btn${editor?.isActive("bold") ? " ca-toolbar-btn--active" : ""}`}
                onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }} title="Bold"><Bold size={14} /></button>
              <button className={`ca-toolbar-btn${editor?.isActive("italic") ? " ca-toolbar-btn--active" : ""}`}
                onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleItalic().run(); }} title="Italic"><Italic size={14} /></button>
              <button className={`ca-toolbar-btn${editor?.isActive("underline") ? " ca-toolbar-btn--active" : ""}`}
                onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleUnderline().run(); }} title="Underline"><UnderlineIcon size={14} /></button>
              <div className="ca-toolbar-sep" />
              <button className="ca-toolbar-btn" onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBulletList().run(); }}><List size={14} /></button>
              <button className="ca-toolbar-btn" onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleOrderedList().run(); }}><ListOrdered size={14} /></button>
              <button className="ca-toolbar-btn" onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBlockquote().run(); }}><Quote size={14} /></button>
              <button className="ca-toolbar-btn" onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleCodeBlock().run(); }}><Code size={14} /></button>
              <div className="ca-toolbar-sep" />
              <button className="ca-toolbar-btn" onMouseDown={e => { e.preventDefault(); const url = prompt("Masukkan URL:"); if (url) editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run(); }}><LinkIcon size={14} /></button>
              <button className="ca-toolbar-btn" onMouseDown={e => { e.preventDefault(); const url = prompt("Masukkan URL gambar:"); if (url) editor?.chain().focus().setImage({ src: url }).run(); }}><ImagePlus size={14} /></button>
              <div className="ca-toolbar-sep" />
              {[["H1", "heading", { level: 1 }], ["H2", "heading", { level: 2 }], ["H3", "heading", { level: 3 }]].map(([lbl, type, attrs]) => (
                <button key={lbl} className={`ca-toolbar-btn${editor?.isActive(type, attrs) ? " ca-toolbar-btn--active" : ""}`}
                  onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleHeading(attrs).run(); }}
                  style={{ width:"auto", padding:"0 8px", fontSize:11, fontWeight:700 }}>{lbl}</button>
              ))}
            </div>
            <EditorContent editor={editor} className="ca-editor-content" />
          </div>
        </div>

        {/* RIGHT — Featured Image, Category, Tags, Visibility, Actions */}
        <div className="ca-right">
          <div className="ca-panel">
            <h4 className="ca-panel__title">Featured Image</h4>
            <label className="ca-upload">
              {image ? <img src={image} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:8 }} /> : (
                <>
                  <div className="ca-upload__icon"><ImagePlus size={20} color="#1b3a2a" /></div>
                  <p>Click to upload</p>
                  <span>PNG, JPG or WEBP (Max 2MB)</span>
                </>
              )}
              <input type="file" hidden accept="image/*" onChange={handleImage} />
            </label>
            {image && (
              <button style={{ marginTop:8, fontSize:12, color:"#dc2626", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }} onClick={() => setImage(null)}>
                Hapus gambar
              </button>
            )}
          </div>

          <div className="ca-panel">
            <h4 className="ca-panel__title">Category</h4>
            <select className="ca-select" value={category} onChange={e => setCategory(e.target.value)}>
              {ARTICLE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="ca-panel">
            <h4 className="ca-panel__title">Tags</h4>
            <div className="ca-tags">
              {tags.map((t, i) => (
                <span key={i} className="ca-tag">{t}
                  <button className="ca-tag__remove" onClick={() => setTags(tags.filter((_, j) => j !== i))}><X size={11} /></button>
                </span>
              ))}
            </div>
            <input className="ca-tag-input" value={inputTag}
              onChange={e => setInputTag(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag..." />
          </div>

          <div className="ca-panel">
            <h4 className="ca-panel__title">Visibility</h4>
            <div className="ca-radio-group">
              {[["public", "Public"], ["private", "Members Only"]].map(([val, lbl]) => (
                <label key={val} className="ca-radio-item">
                  <input type="radio" checked={visibility === val} onChange={() => setVisibility(val)} />
                  {lbl}
                </label>
              ))}
            </div>
          </div>

          <button className="ca-btn-submit" onClick={handleSubmit} disabled={saving}
            style={{ width:"100%", opacity:saving?0.6:1, cursor:saving?"not-allowed":"pointer" }}>
            <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {saving ? <><Loader size={15} style={{ animation:"spin 1s linear infinite" }} /> Mengirim...</> : <><Send size={15} /> Submit for Review</>}
            </span>
          </button>
          <button className="ca-btn-draft" onClick={handleSaveDraft} disabled={saving}
            style={{ width:"100%", marginTop:8 }}>
            <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Save size={15} /> Save as Draft
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANALYTICS VIEW
───────────────────────────────────────────── */
function AnalyticsView({ articles }) {
  const totalViews  = articles.reduce((s,a) => s+(a.views||0), 0);
  const avgViews    = articles.length > 0 ? Math.round(totalViews/articles.length) : 0;
  const topArticles = [...articles].sort((a,b) => (b.views||0)-(a.views||0)).slice(0,8);
  const categories  = [...new Set(articles.map(a=>a.category).filter(Boolean))];
  const maxCount    = Math.max(...categories.map(c => articles.filter(a=>a.category===c).length), 1);

  return (
    <div>
      <div className="ad-page-header">
        <h1 className="ad-page-title">Analytics</h1>
        <p className="ad-page-sub">Statistik lengkap performa konten platform</p>
      </div>
      <div className="ad-stats-grid" style={{ gridTemplateColumns:"repeat(4,1fr)" }}>
        {[
          { label:"Total Views",    value:totalViews.toLocaleString(), color:"#1565C0", Icon:Eye },
          { label:"Total Artikel",  value:articles.length,            color:"#1B3A2A", Icon:FileText },
          { label:"Published",      value:articles.filter(a=>a.status==="published").length, color:"#065F46", Icon:CheckCircle },
          { label:"Rata-rata Views",value:avgViews.toLocaleString(),  color:"#5B21B6", Icon:TrendingUp },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} className="ad-stat-card">
            <div className="ad-stat-card__icon" style={{ background:color+"15", color }}><Icon size={20} /></div>
            <div>
              <div className="ad-stat-card__value" style={{ color }}>{value}</div>
              <div className="ad-stat-card__label">{label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card__head"><h3 className="ad-card__title">Top Artikel by Views</h3></div>
          {topArticles.length===0
            ? <p className="ad-empty-hint">Belum ada data views.</p>
            : topArticles.map((a,i) => (
              <div key={a.id} className="ad-top-row">
                <span className="ad-top-row__rank">{i+1}</span>
                <div className="ad-top-row__info">
                  <div className="ad-top-row__title">{a.title}</div>
                  <div className="ad-top-row__meta">{a.author}</div>
                </div>
                <div className="ad-top-row__views"><Eye size={11} /> {(a.views||0).toLocaleString()}</div>
              </div>
            ))}
        </div>
        <div className="ad-card">
          <div className="ad-card__head"><h3 className="ad-card__title">Artikel per Kategori</h3></div>
          {categories.length===0
            ? <p className="ad-empty-hint">Belum ada data.</p>
            : categories.map(c => {
              const count = articles.filter(a=>a.category===c).length;
              return (
                <div key={c} className="ad-cat-row">
                  <div className="ad-cat-row__name">{c}</div>
                  <div className="ad-cat-row__bar-wrap">
                    <div className="ad-cat-row__bar" style={{ width:`${(count/maxCount)*100}%` }} />
                  </div>
                  <span className="ad-cat-row__count">{count}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REVIEW ARTICLES VIEW — semua artikel bisa dilihat admin
───────────────────────────────────────────── */
function ReviewArticlesView({ articles }) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [toast, showToast]      = useToast();
  const [filter, setFilter]     = useState("pending");

  const allReviewable = articles.filter(a => ["pending","published","revision"].includes(a.status));
  const displayed = filter === "all" ? allReviewable : allReviewable.filter(a => a.status === filter);

  const handleAction = async (id, status) => {
    if (status === "revision" && !feedback.trim()) { alert("Isi catatan revisi terlebih dahulu."); return; }
    try {
      await update(ref(db, `articles/${id}`), { status, feedback: feedback.trim() });
      showToast(status === "published" ? "✓ Artikel berhasil dipublish!" : "✓ Artikel dikembalikan untuk revisi.");
      setSelected(null); setFeedback("");
    } catch (err) { alert("Gagal update: " + err.message); }
  };

  if (selected) return (
    <div>
      <Toast msg={toast} />
      <button className="ad-back-btn" onClick={() => { setSelected(null); setFeedback(""); }} style={{ display:"flex", alignItems:"center", gap:6 }}><ArrowLeft size={14} /> Kembali</button>
      <div className="ad-review-grid">
        <div className="ad-card" style={{ padding:"28px 32px" }}>
          {selected.image && <img src={safeImg(selected.image)} alt={selected.title} className="ad-article-img" />}
          <div style={{ marginBottom:8 }}><span className="ad-cat-pill">{selected.category}</span></div>
          <h1 className="ad-article-title">{selected.title}</h1>
          <div className="ad-article-meta">{selected.author} · {selected.date} · {selected.wordCount} kata</div>
          <div className="ad-article-body" dangerouslySetInnerHTML={{ __html: selected.content }} />
        </div>
        <div>
          <div className="ad-card" style={{ marginBottom:12 }}>
            <h4 className="ad-panel-title">Aksi Admin</h4>
            <div style={{ marginBottom:10, padding:"8px 12px", background: STATUS_COLORS[selected.status]?.bg, borderRadius:8, fontSize:13, fontWeight:600, color: STATUS_COLORS[selected.status]?.text }}>
              Status saat ini: {STATUS_COLORS[selected.status]?.label || selected.status}
            </div>
            {selected.feedback && (
              <div style={{ marginBottom:10, padding:"8px 12px", background:"#FFF8E1", borderRadius:8, fontSize:12, color:"#92400E" }}>
                <strong>Catatan sebelumnya:</strong> {selected.feedback}
              </div>
            )}
            <textarea className="ad-feedback-area" value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Catatan feedback / revisi..." />
            <button className="ad-btn ad-btn--revision" onClick={() => handleAction(selected.id, "revision")}><XCircle size={14} /> Minta Revisi</button>
            <button className="ad-btn ad-btn--publish" style={{ marginTop:8 }} onClick={() => handleAction(selected.id, "published")}><CheckCircle size={14} /> Setujui & Publish</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Toast msg={toast} />
      <div className="ad-page-header">
        <h1 className="ad-page-title">Review Articles</h1>
        <p className="ad-page-sub">{allReviewable.length} artikel tersedia untuk dikelola — semua data realtime</p>
      </div>
      <div className="ad-filter-tabs" style={{ marginBottom:16 }}>
        {[
          { key:"pending",   label:"Pending",   count: articles.filter(a=>a.status==="pending").length },
          { key:"published", label:"Published",  count: articles.filter(a=>a.status==="published").length },
          { key:"revision",  label:"Revision",   count: articles.filter(a=>a.status==="revision").length },
          { key:"all",       label:"Semua",      count: allReviewable.length },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setFilter(key)} className={`ad-filter-tab${filter===key?" ad-filter-tab--active":""}`}>
            {label}
            <span className="ad-filter-tab__count">{count}</span>
          </button>
        ))}
      </div>
      {displayed.length === 0
        ? <div className="ad-empty-state"><CheckCircle size={40} color="#D1D5DB" /><p>Tidak ada artikel di kategori ini.</p></div>
        : (
          <div className="ad-article-list">
            {displayed.map(a => (
              <div key={a.id} className="ad-article-row-card" onClick={() => setSelected(a)} style={{ cursor:"pointer" }}>
                <div className="ad-article-row-card__thumb">
                  {a.image ? <img src={safeImg(a.image)} alt={a.title} /> : <FileText size={20} color="#D1D5DB" />}
                </div>
                <div className="ad-article-row-card__body">
                  <div className="ad-article-row-card__cat">{a.category}</div>
                  <div className="ad-article-row-card__title">{a.title}</div>
                  <div className="ad-article-row-card__meta">{a.author} · {a.date} · {a.wordCount} kata</div>
                  {a.feedback && <div style={{ fontSize:11, color:"#D97706", marginTop:3 }}>Catatan: {a.feedback}</div>}
                </div>
                <span className="ad-status-badge" style={{ background:STATUS_COLORS[a.status]?.bg, color:STATUS_COLORS[a.status]?.text }}>
                  {STATUS_COLORS[a.status]?.label || a.status}
                </span>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUK VIEW — full CRUD (dari Editor.jsx)
───────────────────────────────────────────── */
const IMGBB_API_KEY = "6604bf748a40b7eaf83a5d4792bff01e";
function ProdukView() {
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [view, setView]                   = useState("list");
  const [form, setForm]                   = useState(PRODUK_BLANK);
  const [editId, setEditId]               = useState(null);
  const [saving, setSaving]               = useState(false);
  const [uploading, setUploading]         = useState(false);
  const [imagePreview, setImagePreview]   = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCat, setFilterCat]         = useState("Semua");
  const [toast, showToast]                = useToast();

  useEffect(() => {
    const unsub = onValue(ref(db, "produk"), snap => {
      const data = snap.val();
      setProducts(data ? Object.entries(data).map(([k,v])=>({...v,firebaseId:k})).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)) : []);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const resetForm = () => { setForm(PRODUK_BLANK); setEditId(null); setImagePreview(""); };

  const uploadProdukImage = async file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 1200; let w = img.width, h = img.height;
          if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
          if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = () => reject(new Error("Gagal membaca gambar"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsDataURL(file);
    });
  };

  const handleProdukFileChange = async e => {
    const file = e.target.files[0]; if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const base64 = await uploadProdukImage(file);
      setForm(f => ({...f, image:base64}));
      setImagePreview(base64);
      showToast("✓ Foto berhasil diupload!");
    } catch (err) { showToast("✗ Upload gagal: "+err.message); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("✗ Nama produk wajib diisi.");
    if (!form.price || isNaN(Number(form.price))) return showToast("✗ Harga harus angka.");
    if (!form.desc.trim()) return showToast("✗ Deskripsi wajib diisi.");
    if (!form.image.trim()) return showToast("✗ URL foto produk wajib diisi.");
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(), category: form.category, categoryLabel: form.category,
        price: Number(form.price), desc: form.desc.trim(),
        badge: form.badge||null, badgeColor: form.badge ? form.badgeColor : null,
        image: form.image.trim(), feature1:form.feature1.trim(), feature2:form.feature2.trim(), feature3:form.feature3.trim(),
        updatedAt: Date.now(),
      };
      if (editId) {
        await update(ref(db, `produk/${editId}`), payload);
        showToast("✓ Produk berhasil diperbarui!");
      } else {
        await push(ref(db, "produk"), { ...payload, createdAt:Date.now() });
        showToast("✓ Produk berhasil ditambahkan!");
      }
      setView("list"); resetForm();
    } catch (err) { showToast("✗ Gagal: "+err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = p => {
    setForm({ name:p.name, category:p.category, price:String(p.price), desc:p.desc, badge:p.badge||"", badgeColor:p.badgeColor||"green", image:p.image||"", feature1:p.feature1||PRODUK_BLANK.feature1, feature2:p.feature2||PRODUK_BLANK.feature2, feature3:p.feature3||PRODUK_BLANK.feature3 });
    setEditId(p.firebaseId); setImagePreview(safeImg(p.image)); setView("form");
  };

  const handleDelete = async id => {
    try { await remove(ref(db, `produk/${id}`)); showToast("Produk dihapus."); setDeleteConfirm(null); }
    catch (err) { showToast("✗ Gagal: "+err.message); }
  };

  const displayed = filterCat==="Semua" ? products : products.filter(p=>p.category===filterCat);

  if (loading) return <div style={{ padding:80, textAlign:"center", color:"#6B7280" }}>Memuat produk...</div>;

  /* ── FORM ── */
  if (view === "form") return (
    <div>
      <Toast msg={toast} />
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button onClick={() => { setView("list"); resetForm(); }} style={{ background:"none", border:"none", color:"#6B7280", fontSize:13, cursor:"pointer", fontWeight:500, display:"flex", alignItems:"center", gap:6 }}><ArrowLeft size={14} /> Kembali</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:24 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={card}>
            <label style={sectionLabel}>Foto Produk</label>
            <div
              onClick={() => document.getElementById("produk-file-inp").click()}
              style={{ border:"2px dashed #D1D5DB", borderRadius:12, cursor:"pointer", overflow:"hidden", minHeight: imagePreview ? "auto" : 160, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#16c35b"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#D1D5DB"}>
              {imagePreview
                ? <img src={safeImg(imagePreview)} alt="preview" style={{ width:"100%", height:220, objectFit:"cover", display:"block" }} />
                : <div style={{ padding:"40px 20px", textAlign:"center" }}>
                    <Upload size={36} color="#D1D5DB" style={{ display:"block", margin:"0 auto 10px" }} />
                    <p style={{ fontSize:15, fontWeight:600, color:"#374151", margin:"0 0 6px" }}>{uploading?"Mengupload...":"Klik untuk pilih foto"}</p>
                    <span style={{ fontSize:12, color:"#9CA3AF" }}>JPG, PNG, WEBP</span>
                  </div>
              }
            </div>
            <input id="produk-file-inp" type="file" accept="image/*" onChange={handleProdukFileChange} style={{ display:"none" }} />
            {uploading && <p style={{ fontSize:12, color:"#16c35b", marginTop:8, fontWeight:600 }}style={{ display:"flex", alignItems:"center", gap:6 }}><Loader size={13} style={{ animation:"spin 1s linear infinite" }} /> Mengupload foto...</p>}
            <div style={{ marginTop:10 }}>
              <label style={fieldLabel}>Atau masukkan URL foto langsung</label>
              <input
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={e => { setForm(f=>({...f,image:e.target.value})); setImagePreview(safeImg(e.target.value)); }}
                placeholder="https://... URL gambar (opsional jika sudah upload)"
                style={inputStyle}
              />
            </div>
          </div>
          <div style={card}>
            <label style={sectionLabel}>Informasi Produk</label>
            <div style={{ marginBottom:12 }}>
              <label style={fieldLabel}>Nama Produk *</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="cth. Telur Ayam Kampung" style={inputStyle} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                <label style={fieldLabel}>Kategori *</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={inputStyle}>
                  {PRODUK_CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={fieldLabel}>Harga (Rp) *</label>
                <input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="45000" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={fieldLabel}>Deskripsi *</label>
              <textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Deskripsi produk..." style={{ ...inputStyle, height:90, resize:"vertical" }} />
            </div>
          </div>
          <div style={card}>
            <label style={sectionLabel}>Keunggulan Produk</label>
            {[1,2,3].map(n => (
              <div key={n} style={{ marginBottom:10 }}>
                <label style={fieldLabel}>Keunggulan {n}</label>
                <input value={form[`feature${n}`]} onChange={e=>setForm(f=>({...f,[`feature${n}`]:e.target.value}))} style={inputStyle} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={card}>
            <label style={sectionLabel}>Badge Produk</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom: form.badge ? 14 : 0 }}>
              {PRODUK_BADGES.map(opt => (
                <button key={opt.value} onClick={() => setForm(f=>({...f,badge:opt.value}))} style={{ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:600, border:form.badge===opt.value?"2px solid #1B3A2A":"2px solid #E5E7EB", background:form.badge===opt.value?"#1B3A2A":"#fff", color:form.badge===opt.value?"#fff":"#374151", cursor:"pointer" }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {form.badge && (
              <div>
                <label style={{ ...fieldLabel, marginTop:4 }}>Warna Badge</label>
                <div style={{ display:"flex", gap:8, marginTop:6 }}>
                  {[["green","Hijau","#16c35b"],["red","Merah","#ef4444"]].map(([val,lbl,color]) => (
                    <button key={val} onClick={() => setForm(f=>({...f,badgeColor:val}))}
                      style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:600, border:`2px solid ${form.badgeColor===val?color:"#E5E7EB"}`, background:form.badgeColor===val?color+"18":"#fff", color:"#374151", cursor:"pointer" }}>
                      <span style={{ width:10, height:10, borderRadius:"50%", background:color, display:"inline-block" }} />
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={card}>
            <label style={sectionLabel}>Preview Card</label>
            <div style={{ border:"1px solid #E5E7EB", borderRadius:10, overflow:"hidden" }}>
              <div style={{ position:"relative", background:"#f0f0f0", height:130 }}>
                {form.image ? <img src={safeImg(form.image)} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#CBD5E1" }}><Image size={36} /></div>}
                {form.badge && <span style={{ position:"absolute", top:8, left:8, padding:"3px 10px", fontSize:10, fontWeight:700, borderRadius:4, color:"#fff", background:form.badgeColor==="red"?"#ef4444":"#16c35b" }}>{form.badge}</span>}
              </div>
              <div style={{ padding:"12px 14px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#16c35b", letterSpacing:1, marginBottom:4 }}>{form.category.toUpperCase()}</div>
                <div style={{ fontSize:15, fontWeight:700, color:"#1e293b", marginBottom:4 }}>{form.name||"Nama Produk"}</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#16c35b" }}>Rp {form.price?Number(form.price).toLocaleString("id-ID"):"0"}</div>
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving||uploading} style={{ width:"100%", padding:14, background:(saving||uploading)?"#9CA3AF":"#1B3A2A", color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:(saving||uploading)?"not-allowed":"pointer" }}>
            {saving?"Menyimpan...":editId?<span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><Save size={16}/>Perbarui Produk</span>:<span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><Plus size={16}/>Simpan Produk</span>}
          </button>
          <button onClick={() => { setView("list"); resetForm(); }} style={{ width:"100%", padding:12, background:"#fff", border:"1px solid #E5E7EB", color:"#374151", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>Batal</button>
        </div>
      </div>
    </div>
  );

  /* ── LIST ── */
  return (
    <div>
      <Toast msg={toast} />
      {deleteConfirm && <DeleteModal name={deleteConfirm.name} onConfirm={()=>handleDelete(deleteConfirm.firebaseId)} onCancel={()=>setDeleteConfirm(null)} />}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>Manajemen Produk</h1>
          <p style={{ color:"#6B7280", fontSize:14, margin:"4px 0 0" }}>{products.length} produk · data realtime dari Firebase</p>
        </div>
        <button onClick={() => { resetForm(); setView("form"); }} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", background:"#1B3A2A", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>
          <Plus size={16} /> Tambah Produk
        </button>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["Semua",...PRODUK_CATEGORIES].map(cat => (
          <button key={cat} onClick={()=>setFilterCat(cat)} style={{ padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:filterCat===cat?600:400, border:"1px solid "+(filterCat===cat?"#1B3A2A":"#E5E7EB"), background:filterCat===cat?"#1B3A2A":"#fff", color:filterCat===cat?"#fff":"#374151", cursor:"pointer" }}>
            {cat} {cat!=="Semua"&&<span style={{ opacity:0.6 }}>({products.filter(p=>p.category===cat).length})</span>}
          </button>
        ))}
      </div>
      {displayed.length===0
        ? <div className="ad-empty-state"><ShoppingBag size={40} color="#D1D5DB" /><p>Belum ada produk. Klik "Tambah Produk" untuk mulai.</p></div>
        : (
          <div className="ad-produk-grid">
            {displayed.map(p => (
              <div key={p.firebaseId} className="ad-produk-card">
                <div className="ad-produk-card__img">
                  {p.image ? <img src={safeImg(p.image)} alt={p.name} onError={e=>e.target.style.display="none"} /> : <ShoppingBag size={32} color="#D1D5DB" />}
                  {p.badge && <span style={{ position:"absolute", top:8, left:8, padding:"3px 10px", fontSize:10, fontWeight:700, borderRadius:4, color:"#fff", background:p.badgeColor==="red"?"#ef4444":"#16c35b" }}>{p.badge}</span>}
                </div>
                <div className="ad-produk-card__body">
                  <div className="ad-produk-card__cat">{p.category}</div>
                  <div className="ad-produk-card__name">{p.name}</div>
                  <div className="ad-produk-card__price">Rp {(p.price||0).toLocaleString("id-ID")}</div>
                  <div style={{ fontSize:12, color:"#6B7280", marginTop:4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{p.desc}</div>
                </div>
                <div style={{ padding:"10px 16px", borderTop:"1px solid #F3F4F6", display:"flex", gap:8 }}>
                  <button onClick={()=>handleEdit(p)} style={{ flex:1, padding:8, background:"#E8F4EE", color:"#1B3A2A", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={()=>setDeleteConfirm(p)} style={{ flex:1, padding:8, background:"#FEF2F2", color:"#DC2626", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   GALLERY VIEW — full CRUD (dari Editor.jsx)
───────────────────────────────────────────── */

function GalleryView() {
  const [items, setItems]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [view, setView]                   = useState("list");
  const [form, setForm]                   = useState(GALLERY_BLANK);
  const [editId, setEditId]               = useState(null);
  const [saving, setSaving]               = useState(false);
  const [uploading, setUploading]         = useState(false);
  const [imagePreview, setImagePreview]   = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCat, setFilterCat]         = useState("Semua");
  const [toast, showToast]                = useToast();

  useEffect(() => {
    const unsub = onValue(ref(db, "gallery"), snap => {
      const data = snap.val();
      setItems(data ? Object.entries(data).map(([k,v])=>({...v,firebaseId:k})).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)) : []);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const resetForm = () => { setForm(GALLERY_BLANK); setEditId(null); setImagePreview(""); };

  const uploadImage = async file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 1200; let w = img.width, h = img.height;
          if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
          if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = () => reject(new Error("Gagal membaca gambar"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async e => {
    const file = e.target.files[0]; if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const base64 = await uploadImage(file);
      setForm(f => ({...f, image:base64}));
      setImagePreview(base64);
      showToast("✓ Foto berhasil diupload!");
    } catch (err) { showToast("✗ Upload gagal: "+err.message); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return showToast("✗ Judul wajib diisi.");
    if (!form.desc.trim())  return showToast("✗ Deskripsi wajib diisi.");
    if (!form.image.trim()) return showToast("✗ Upload foto terlebih dahulu.");
    setSaving(true);
    try {
      const payload = { title:form.title.trim(), category:form.category, desc:form.desc.trim(), image:form.image.trim(), updatedAt:Date.now() };
      if (editId) {
        await update(ref(db, `gallery/${editId}`), payload);
        showToast("✓ Item gallery berhasil diperbarui!");
      } else {
        await push(ref(db, "gallery"), { ...payload, createdAt:Date.now() });
        showToast("✓ Item gallery berhasil ditambahkan!");
      }
      setView("list"); resetForm();
    } catch (err) { showToast("✗ Gagal: "+err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = item => {
    setForm({ title:item.title, category:item.category, desc:item.desc, image:item.image||"" });
    setEditId(item.firebaseId); setImagePreview(safeImg(item.image)); setView("form");
  };

  const handleDelete = async id => {
    try { await remove(ref(db, `gallery/${id}`)); showToast("Item dihapus."); setDeleteConfirm(null); }
    catch (err) { showToast("✗ Gagal: "+err.message); }
  };

  const displayed = filterCat==="Semua" ? items : items.filter(i=>i.category===filterCat);

  if (loading) return <div style={{ padding:80, textAlign:"center", color:"#6B7280" }}>Memuat gallery...</div>;

  /* ── FORM ── */
  if (view === "form") return (
    <div>
      <Toast msg={toast} />
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button onClick={() => { setView("list"); resetForm(); }} style={{ background:"none", border:"none", color:"#6B7280", fontSize:13, cursor:"pointer", fontWeight:500, display:"flex", alignItems:"center", gap:6 }}><ArrowLeft size={14} /> Kembali</button>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>{editId?"Edit Item Gallery":"Tambah Item Gallery"}</h1>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, alignItems:"flex-start" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={card}>
            <label style={sectionLabel}>Upload Foto</label>
            <div onClick={()=>document.getElementById("gal-file-inp").click()}
              style={{ border:"2px dashed #D1D5DB", borderRadius:12, cursor:"pointer", overflow:"hidden", minHeight:imagePreview?"auto":160, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#16c35b"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#D1D5DB"}>
              {imagePreview
                ? <img src={safeImg(imagePreview)} alt="preview" style={{ width:"100%", height:240, objectFit:"cover", display:"block" }} />
                : <div style={{ padding:"40px 20px", textAlign:"center" }}>
                    <Image size={36} color="#D1D5DB" style={{ display:"block", margin:"0 auto 10px" }} />
                    <p style={{ fontSize:15, fontWeight:600, color:"#374151", margin:"0 0 6px" }}>{uploading?"Mengupload...":"Klik untuk pilih foto"}</p>
                    <span style={{ fontSize:12, color:"#9CA3AF" }}>JPG, PNG, WEBP</span>
                  </div>
              }
            </div>
            <input id="gal-file-inp" type="file" accept="image/*" onChange={handleFileChange} style={{ display:"none" }} />
            {uploading && <p style={{ fontSize:12, color:"#16c35b", marginTop:8, fontWeight:600 }}style={{ display:"flex", alignItems:"center", gap:6 }}><Loader size={13} style={{ animation:"spin 1s linear infinite" }} /> Mengupload foto...</p>}
            <div style={{ marginTop:10 }}>
              <label style={fieldLabel}>Atau masukkan URL foto langsung</label>
              <input value={form.image} onChange={e=>{ setForm(f=>({...f,image:e.target.value})); setImagePreview(e.target.value); }} placeholder="https://..." style={inputStyle} />
            </div>
          </div>
          <div style={card}>
            <label style={sectionLabel}>Informasi Item</label>
            <div style={{ marginBottom:12 }}>
              <label style={fieldLabel}>Judul *</label>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="cth: Kandang Sapi Modern" style={inputStyle} />
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={fieldLabel}>Kategori *</label>
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={inputStyle}>
                {GALLERY_CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={fieldLabel}>Deskripsi *</label>
              <textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Deskripsi foto..." style={{ ...inputStyle, height:100, resize:"vertical" }} />
            </div>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={card}>
            <label style={sectionLabel}>Preview Card</label>
            <div style={{ border:"1px solid #E5E7EB", borderRadius:10, overflow:"hidden" }}>
              <div style={{ position:"relative", background:"#f0f0f0", height:160 }}>
                {imagePreview
                  ? <img src={safeImg(imagePreview)} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#CBD5E1" }}><Image size={36} /></div>
                }
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.6),transparent)", display:"flex", alignItems:"flex-end" }}>
                  <div style={{ padding:"12px 14px", color:"#fff" }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{form.title||"Judul Item"}</div>
                    <div style={{ fontSize:11, opacity:0.8 }}>{form.category}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving||uploading} style={{ width:"100%", padding:14, background:(saving||uploading)?"#9CA3AF":"#1B3A2A", color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:(saving||uploading)?"not-allowed":"pointer" }}>
            {saving?"Menyimpan...":editId?"Perbarui Item":"Simpan Item"}
          </button>
          <button onClick={() => { setView("list"); resetForm(); }} style={{ width:"100%", padding:12, background:"#fff", border:"1px solid #E5E7EB", color:"#374151", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>Batal</button>
        </div>
      </div>
    </div>
  );

  /* ── LIST ── */
  return (
    <div>
      <Toast msg={toast} />
      {deleteConfirm && <DeleteModal name={deleteConfirm.title} onConfirm={()=>handleDelete(deleteConfirm.firebaseId)} onCancel={()=>setDeleteConfirm(null)} />}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>Manajemen Gallery</h1>
          <p style={{ color:"#6B7280", fontSize:14, margin:"4px 0 0" }}>{items.length} item · data realtime dari Firebase</p>
        </div>
        <button onClick={() => { resetForm(); setView("form"); }} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", background:"#1B3A2A", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>
          <Plus size={16} /> Tambah Item
        </button>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["Semua",...GALLERY_CATEGORIES].map(cat => {
          const count = cat==="Semua"?items.length:items.filter(i=>i.category===cat).length;
          return (
            <button key={cat} onClick={()=>setFilterCat(cat)} style={{ padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:filterCat===cat?600:400, border:"1px solid "+(filterCat===cat?"#1B3A2A":"#E5E7EB"), background:filterCat===cat?"#1B3A2A":"#fff", color:filterCat===cat?"#fff":"#374151", cursor:"pointer" }}>
              {cat} <span style={{ opacity:0.6, fontSize:11 }}>({count})</span>
            </button>
          );
        })}
      </div>
      {displayed.length===0
        ? <div className="ad-empty-state"><Image size={40} color="#D1D5DB" /><p>Belum ada item. Klik "Tambah Item" untuk mulai.</p></div>
        : (
          <div className="ad-gallery-grid">
            {displayed.map(item => (
              <div key={item.firebaseId} className="ad-gallery-card">
                <div style={{ position:"relative", height:180, background:"#f0f0f0", overflow:"hidden" }}>
                  {item.image
                    ? <img src={safeImg(item.image)} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#CBD5E1" }}><Image size={40} /></div>
                  }
                  <span style={{ position:"absolute", top:8, right:8, background:"rgba(22,195,91,0.9)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{item.category}</span>
                </div>
                <div style={{ padding:"14px 16px", flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:4 }}>{item.title}</div>
                  <div style={{ fontSize:12, color:"#6B7280", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{item.desc}</div>
                </div>
                <div style={{ padding:"10px 16px", borderTop:"1px solid #F3F4F6", display:"flex", gap:8 }}>
                  <button onClick={()=>handleEdit(item)} style={{ flex:1, padding:8, background:"#E8F4EE", color:"#1B3A2A", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={()=>setDeleteConfirm(item)} style={{ flex:1, padding:8, background:"#FEF2F2", color:"#DC2626", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ATTRACTIONS MANAGEMENT VIEW
───────────────────────────────────────────── */
const DEFAULT_ATTRACTION_CATEGORIES = ["Workshop", "Nature", "Animals", "Edukasi"];
const ATTRACTION_BLANK = {
  name: "", category: "Workshop", location: "", desc: "", image: "", badge: "",
};
const IMGBB_KEY_ATT = "6604bf748a40b7eaf83a5d4792bff01e";

function AttractionsView() {
  const [items, setItems]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [view, setView]                   = useState("list");
  const [form, setForm]                   = useState(ATTRACTION_BLANK);
  const [editId, setEditId]               = useState(null);
  const [saving, setSaving]               = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCat, setFilterCat]         = useState("Semua");
  const [toast, setToast]                 = useState("");
  const [imagePreview, setImagePreview]   = useState("");
  const [uploading, setUploading]         = useState(false);
  const [categories, setCategories]       = useState(DEFAULT_ATTRACTION_CATEGORIES);
  const [showAddCat, setShowAddCat]       = useState(false);
  const [newCatInput, setNewCatInput]     = useState("");
  const [savingCat, setSavingCat]         = useState(false);

  const iStyle = {
    width:"100%", padding:"9px 12px", borderRadius:8,
    border:"1px solid #D1D5DB", fontSize:14, boxSizing:"border-box",
    fontFamily:"inherit", color:"#111827", outline:"none",
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    const attRef = ref(db, "attractions");
    const unsub = onValue(attRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([key, val]) => ({ ...val, firebaseId: key }));
        setItems(list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
      } else { setItems([]); }
      setLoading(false);
    }, () => { setItems([]); setLoading(false); });
    return () => unsub();
  }, []);

  useEffect(() => {
    const catRef = ref(db, "attractionCategories");
    const unsub = onValue(catRef, (snap) => {
      const data = snap.val();
      if (data && Array.isArray(data)) setCategories(data);
      else if (!data) update(ref(db, "/"), { attractionCategories: DEFAULT_ATTRACTION_CATEGORIES });
    });
    return () => unsub();
  }, []);

  const uploadImage = async (file) => {
    // Kompres & konversi ke base64 — tidak perlu layanan eksternal, tidak ada SSL issue
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 1200;
          let w = img.width, h = img.height;
          if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
          if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = () => reject(new Error("Gagal membaca gambar"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setImagePreview(URL.createObjectURL(file)); // preview sementara
    setUploading(true);
    try {
      const base64 = await uploadImage(file);
      setForm(f => ({ ...f, image: base64 }));
      setImagePreview(base64); // base64 langsung tampil, tidak perlu proxy
      showToast("✓ Foto berhasil diupload!");
    } catch (err) { showToast("✗ Upload foto gagal: " + err.message); }
    finally { setUploading(false); }
  };

  const handleAddCategory = async () => {
    const trimmed = newCatInput.trim(); if (!trimmed) return;
    if (categories.includes(trimmed)) { showToast("✗ Kategori sudah ada."); return; }
    setSavingCat(true);
    try {
      await update(ref(db, "/"), { attractionCategories: [...categories, trimmed] });
      setNewCatInput(""); setShowAddCat(false); showToast("✓ Kategori ditambahkan!");
    } catch (err) { showToast("✗ Gagal: " + err.message); }
    finally { setSavingCat(false); }
  };

  const handleDeleteCategory = async (cat) => {
    if (categories.length <= 1) { showToast("✗ Minimal satu kategori harus ada."); return; }
    if (items.some(i => i.category === cat)) {
      const count = items.filter(i => i.category === cat).length;
      if (!window.confirm(`Kategori "${cat}" digunakan oleh ${count} attraction. Tetap hapus?`)) return;
    }
    try {
      const updated = categories.filter(c => c !== cat);
      await update(ref(db, "/"), { attractionCategories: updated });
      if (form.category === cat) setForm(f => ({ ...f, category: updated[0] }));
      showToast("✓ Kategori dihapus.");
    } catch (err) { showToast("✗ Gagal: " + err.message); }
  };

  const handleSave = async () => {
    if (!form.name.trim())     return showToast("✗ Nama attraction wajib diisi.");
    if (!form.desc.trim())     return showToast("✗ Deskripsi wajib diisi.");
    if (!form.location.trim()) return showToast("✗ Lokasi wajib diisi.");
    if (!form.image.trim())    return showToast("✗ Upload foto atau masukkan URL foto.");
    setSaving(true);
    try {
      const payload = {
        title: form.name.trim(), name: form.name.trim(),
        category: form.category, location: form.location.trim(),
        desc: form.desc.trim(), image: form.image.trim(),
        badge: form.badge || null, updatedAt: new Date().toISOString(),
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
      name: item.name || item.title || "",
      category: item.category || "Workshop",
      location: item.location || "",
      desc: item.desc || "",
      image: item.image || "",
      badge: item.badge || "",
    });
    setEditId(item.firebaseId); setImagePreview(safeImg(item.image)); setView("form");
  };

  const handleDelete = async (id) => {
    try { await remove(ref(db, `attractions/${id}`)); showToast("Item dihapus."); setDeleteConfirm(null); }
    catch (err) { showToast("✗ Gagal menghapus: " + err.message); }
  };

  const displayed = filterCat === "Semua" ? items : items.filter(i => i.category === filterCat);

  /* ── FORM VIEW ── */
  if (view === "form") return (
    <div>
      {toast && <div style={{ position:"fixed", top:24, right:24, background:toast.startsWith("✓")?"#1B3A2A":"#DC2626", color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, zIndex:999, boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>{toast}</div>}

      <div style={{ display:"flex", alignItems:"center", marginBottom:24 }}>
        <div>
          <button onClick={() => { setView("list"); resetForm(); }} style={{ background:"none", border:"none", color:"#6B7280", fontSize:13, cursor:"pointer", marginBottom:4, fontWeight:500, padding:0 }}>← Kembali ke daftar</button>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>{editId ? "Edit Attraction" : "Tambah Attraction Baru"}</h1>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, alignItems:"flex-start" }}>
        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Foto */}
          <div style={card}>
            <label style={sectionLabel}>Foto Attraction</label>
            <div onClick={() => document.getElementById("adm-att-file-input").click()}
              style={{ border:"2px dashed #D1D5DB", borderRadius:12, cursor:"pointer", overflow:"hidden", transition:"border-color 0.2s", height: imagePreview ? "auto" : 200, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#16c35b"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#D1D5DB"}>
              {imagePreview ? (
                <div style={{ position:"relative", width:"100%" }}>
                  <img src={safeImg(imagePreview)} alt="preview" style={{ width:"100%", height:240, objectFit:"cover", display:"block" }} />
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"0.3s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0}>
                    <span style={{ color:"#fff", fontWeight:600, fontSize:14 }}>Klik untuk ganti foto</span>
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, textAlign:"center", padding:"0 20px" }}>
                  <Upload size={36} color="#D1D5DB" />
                  <p style={{ fontSize:15, fontWeight:600, color:"#374151", margin:0 }}>{uploading ? "Mengupload..." : "Klik untuk pilih foto"}</p>
                  <span style={{ fontSize:12, color:"#9CA3AF" }}>JPG, PNG, WEBP • Maks 10MB</span>
                </div>
              )}
            </div>
            <input id="adm-att-file-input" type="file" accept="image/*" onChange={handleFileChange} style={{ display:"none" }} />
            {uploading && <p style={{ fontSize:12, color:"#16c35b", marginTop:8, fontWeight:600 }}>Sedang mengupload foto...</p>}
            <div style={{ marginTop:10 }}>
              <label style={fieldLabel}>Atau masukkan URL foto langsung</label>
              <input value={form.image} onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(safeImg(e.target.value)); }}
                placeholder="https://i.ibb.co/... atau URL gambar lain" style={inputStyle} />
            </div>
          </div>

          {/* Info */}
          <div style={card}>
            <label style={sectionLabel}>Informasi Attraction</label>
            <div style={{ marginBottom:12 }}>
              <label style={fieldLabel}>Nama Attraction *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="cth. Kandang Edukasi Sapi Perah" style={inputStyle} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                  <label style={{ ...fieldLabel, marginBottom:0 }}>Kategori *</label>
                  <button onClick={() => setShowAddCat(v => !v)} style={{ fontSize:11, color:"#1B3A2A", background:"none", border:"none", cursor:"pointer", fontWeight:600, padding:0 }}>{showAddCat ? "✕ Tutup" : "+ Kelola"}</button>
                </div>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                {showAddCat && (
                  <div style={{ marginTop:8, background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:8, padding:10 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:"#374151", margin:"0 0 8px" }}>Kelola Kategori Attractions</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:8 }}>
                      {categories.map(c => (
                        <div key={c} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", border:"1px solid #E5E7EB", borderRadius:6, padding:"4px 8px" }}>
                          <span style={{ fontSize:12, color:"#374151" }}>{c}</span>
                          <button onClick={() => handleDeleteCategory(c)} style={{ fontSize:11, color:"#DC2626", background:"none", border:"none", cursor:"pointer", fontWeight:700 }}>✕</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <input value={newCatInput} onChange={e => setNewCatInput(e.target.value)} onKeyDown={e => e.key==="Enter" && handleAddCategory()} placeholder="Nama kategori baru..." style={{ ...inputStyle, flex:1, fontSize:12, padding:"6px 8px" }} />
                      <button onClick={handleAddCategory} disabled={savingCat || !newCatInput.trim()} style={{ padding:"6px 10px", background:"#1B3A2A", color:"#fff", border:"none", borderRadius:6, fontSize:12, fontWeight:600, cursor:"pointer" }}>{savingCat ? "..." : "+ Tambah"}</button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label style={fieldLabel}>Badge <span style={{ fontWeight:400, color:"#9CA3AF" }}>(opsional)</span></label>
                <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} style={inputStyle}>
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
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="cth. Zona Peternakan, Blok A" style={inputStyle} />
            </div>
            <div>
              <label style={fieldLabel}>Deskripsi *</label>
              <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Ceritakan tentang attraction ini — apa yang bisa dilakukan pengunjung, pengalaman uniknya, dll." style={{ ...inputStyle, height:110, resize:"vertical" }} />
            </div>
          </div>
        </div>

        {/* RIGHT – Preview + Save */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={card}>
            <label style={sectionLabel}>Preview Card</label>
            <div style={{ border:"1px solid #E5E7EB", borderRadius:10, overflow:"hidden" }}>
              <div style={{ position:"relative", background:"#f0f0f0", height:160 }}>
                {imagePreview
                  ? <img src={safeImg(imagePreview)} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#CBD5E1" }}><Image size={36} color="#CBD5E1" /></div>
                }
                {form.badge && <span style={{ position:"absolute", top:8, left:8, padding:"3px 10px", fontSize:10, fontWeight:700, borderRadius:4, color:"#fff", background: form.badge==="HOT"?"#ef4444":"#16c35b" }}>{form.badge}</span>}
                <span style={{ position:"absolute", top:8, right:8, background:"rgba(22,195,91,0.9)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{form.category}</span>
              </div>
              <div style={{ padding:"12px 14px" }}>
                <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:4 }}>{form.name || "Nama Attraction"}</div>
                <div style={{ fontSize:12, color:"#6B7280", marginBottom:6, display:"flex", alignItems:"center", gap:4 }}>
                  <MapPin size={13} /><span>{form.location || "Lokasi"}</span>
                </div>
                <div style={{ fontSize:12, color:"#6B7280", lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                  {form.desc || "Deskripsi attraction akan muncul di sini..."}
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving || uploading}
            style={{ width:"100%", padding:"14px", background:(saving||uploading)?"#9CA3AF":"#1B3A2A", color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:(saving||uploading)?"not-allowed":"pointer" }}>
            {saving ? "Menyimpan..." : uploading ? "Menunggu upload..." : editId ? "Perbarui Attraction" : "Simpan Attraction"}
          </button>
          <button onClick={() => { setView("list"); resetForm(); }}
            style={{ width:"100%", padding:"12px", background:"#fff", border:"1px solid #E5E7EB", color:"#374151", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );

  /* ── LIST VIEW ── */
  return (
    <div>
      {toast && <div style={{ position:"fixed", top:24, right:24, background:toast.startsWith("✓")?"#1B3A2A":"#DC2626", color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, zIndex:999, boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>{toast}</div>}

      <div className="ad-page-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 className="ad-page-title">Manajemen Attractions</h1>
          <p className="ad-page-sub">{items.length} attraction · data realtime dari Firebase</p>
        </div>
        <button onClick={() => { resetForm(); setView("form"); }}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", background:"#1B3A2A", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>
          <Plus size={16} /> Tambah Attraction
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["Semua", ...categories].map(cat => {
          const count = cat === "Semua" ? items.length : items.filter(i => i.category === cat).length;
          return (
            <button key={cat} onClick={() => setFilterCat(cat)}
              style={{ padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:filterCat===cat?600:400, border:"1px solid "+(filterCat===cat?"#1B3A2A":"#E5E7EB"), background:filterCat===cat?"#1B3A2A":"#fff", color:filterCat===cat?"#fff":"#374151", cursor:"pointer" }}>
              {cat} <span style={{ opacity:0.7, fontSize:11 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {loading && <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200 }}><Loader size={28} color="#9CA3AF" /></div>}

      {!loading && displayed.length === 0 && (
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"60px 20px", textAlign:"center" }}>
          <MapPin size={40} color="#D1D5DB" style={{ marginBottom:12 }} />
          <p style={{ color:"#6B7280", fontSize:14 }}>Belum ada attraction. Klik "Tambah Attraction" untuk mulai.</p>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
        {displayed.map(item => (
          <div key={item.firebaseId} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", display:"flex", flexDirection:"column" }}>
            <div style={{ position:"relative", height:180, background:"#f0f0f0", overflow:"hidden" }}>
              {item.image
                ? <img src={safeImg(item.image)} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#CBD5E1" }}><Image size={40} color="#CBD5E1" /></div>
              }
              <span style={{ position:"absolute", top:8, right:8, background:"rgba(22,195,91,0.9)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{item.category}</span>
              {item.badge && <span style={{ position:"absolute", top:8, left:8, background: item.badge==="HOT"?"#ef4444":"#16c35b", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:4 }}>{item.badge}</span>}
            </div>
            <div style={{ padding:"14px 16px", flex:1, display:"flex", flexDirection:"column" }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:4 }}>{item.title || item.name}</div>
              <div style={{ fontSize:12, color:"#6B7280", marginBottom:6, display:"flex", alignItems:"center", gap:4 }}>
                <MapPin size={12} /><span>{item.location}</span>
              </div>
              <div style={{ fontSize:12, color:"#6B7280", lineHeight:1.6, flex:1, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{item.desc}</div>
            </div>
            <div style={{ display:"flex", gap:8, padding:"0 16px 14px" }}>
              <button onClick={() => handleEdit(item)}
                style={{ flex:1, padding:8, background:"#F0FDF4", color:"#1B3A2A", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <Pencil size={13} /> Edit
              </button>
              <button onClick={() => setDeleteConfirm(item)}
                style={{ flex:1, padding:8, background:"#FEF2F2", color:"#DC2626", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <Trash2 size={13} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", padding:28, borderRadius:14, width:360, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"#FEF2F2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
              <Trash2 size={24} color="#DC2626" />
            </div>
            <h3 style={{ margin:"0 0 8px", color:"#111827", fontSize:17, fontWeight:700 }}>Hapus Attraction?</h3>
            <p style={{ color:"#6B7280", fontSize:13, marginBottom:22 }}>
              Attraction <strong>"{deleteConfirm.title || deleteConfirm.name}"</strong> akan dihapus permanen.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding:"9px 20px", borderRadius:8, border:"1px solid #E5E7EB", background:"#fff", color:"#374151", fontSize:14, cursor:"pointer", fontWeight:600 }}>Batal</button>
              <button onClick={() => handleDelete(deleteConfirm.firebaseId)} style={{ padding:"9px 20px", borderRadius:8, border:"none", background:"#DC2626", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>Ya, Hapus</button>
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
  // prices: array of { key, label, weekday, weekend }
  // key  = slug unik (anak, dewasa, pelajar, dll)
  // dikonversi ke object saat disimpan ke Firebase
  priceCategories: [],
};

const PRICE_CAT_BLANK = { key: "", label: "", weekday: "", weekend: "" };

const TICKET_ICON_OPTIONS = [
  { value: "FaSwimmingPool", label: "Kolam Renang" },
  { value: "FaTree",         label: "Alam / Pohon" },
  { value: "FaCampground",   label: "Camping" },
  { value: "FaTicketAlt",    label: "Tiket" },
  { value: "FaUsers",        label: "Rombongan" },
  { value: "FaStar",         label: "Unggulan" },
];

const IMGBB_KEY_TICKET = "6604bf748a40b7eaf83a5d4792bff01e";

function TicketsOnlineAdminView() {
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

  const iStyle = {
    width:"100%", padding:"9px 12px", borderRadius:8,
    border:"1px solid #D1D5DB", fontSize:14, boxSizing:"border-box",
    fontFamily:"inherit", color:"#111827", outline:"none",
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  /* ── realtime listener ── */
  useEffect(() => {
    const tickRef = ref(db, "ticketsOnline");
    const unsub = onValue(tickRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([key, val]) => ({ ...val, firebaseId: key }));
        setItems(list.sort((a, b) => (a.order || 0) - (b.order || 0) || (b.createdAt || "") > (a.createdAt || "") ? -1 : 1));
      } else {
        setItems([]);
      }
      setLoading(false);
    }, () => { setItems([]); setLoading(false); });
    return () => unsub();
  }, []);

  /* ── upload foto ke ImgBB ── */
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY_TICKET}`, { method: "POST", body: fd });
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

  const fmtRp = (val) => {
    const num = parseInt(String(val).replace(/\D/g,""), 10) || 0;
    return num ? "Rp " + num.toLocaleString("id-ID") : "";
  };

  /* ── save ── */
  const handleSave = async () => {
    if (!form.title.trim()) return showToast("✗ Nama paket wajib diisi.");
    if (!form.image.trim()) return showToast("✗ Upload foto terlebih dahulu.");

    // Validasi price categories jika ada
    const validCats = (form.priceCategories || []).filter(c => c.label.trim());
    for (const cat of validCats) {
      if (!cat.weekday || isNaN(Number(String(cat.weekday).replace(/\D/g,"")))) return showToast(`✗ Harga weekday untuk "${cat.label}" harus angka.`);
      if (!cat.weekend || isNaN(Number(String(cat.weekend).replace(/\D/g,"")))) return showToast(`✗ Harga weekend untuk "${cat.label}" harus angka.`);
    }

    // Jika tidak ada price categories, validasi field weekday/weekend lama
    if (validCats.length === 0) {
      if (!form.weekday || isNaN(Number(String(form.weekday).replace(/\D/g,"")))) return showToast("✗ Harga weekday harus angka, atau tambah minimal 1 kategori harga.");
      if (!form.weekend || isNaN(Number(String(form.weekend).replace(/\D/g,"")))) return showToast("✗ Harga weekend harus angka, atau tambah minimal 1 kategori harga.");
    }

    setSaving(true);
    try {
      const fmtPrice = (val) => {
        const num = parseInt(String(val).replace(/\D/g,""), 10) || 0;
        return "Rp " + num.toLocaleString("id-ID");
      };

      // Bangun objek prices dari priceCategories
      let pricesObj = null;
      if (validCats.length > 0) {
        pricesObj = {};
        validCats.forEach((cat, idx) => {
          // Gunakan key custom atau generate dari label
          const slug = cat.key.trim()
            || cat.label.trim().toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 20)
            || `kategori_${idx + 1}`;
          pricesObj[slug] = {
            label:   cat.label.trim(),
            weekday: fmtPrice(cat.weekday),
            weekend: fmtPrice(cat.weekend),
          };
        });
      }

      const payload = {
        title:     form.title.trim(),
        category:  form.category.trim() || "Paket Wisata",
        image:     form.image.trim(),
        weekday:   validCats.length === 0 ? fmtPrice(form.weekday) : (form.weekday ? fmtPrice(form.weekday) : ""),
        weekend:   validCats.length === 0 ? fmtPrice(form.weekend) : (form.weekend ? fmtPrice(form.weekend) : ""),
        featured:  !!form.featured,
        iconName:  form.iconName || "FaTicketAlt",
        features:  (form.features || []).map(f => f.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
      };

      // Tambahkan prices hanya jika ada kategori
      if (pricesObj) payload.prices = pricesObj;

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
    const rawPrice = (str) => str ? str.replace(/[^\d]/g, "") : "";

    // Konversi object prices dari Firebase → array priceCategories
    let priceCategories = [];
    if (item.prices && typeof item.prices === "object") {
      priceCategories = Object.entries(item.prices).map(([key, val]) => ({
        key:     key,
        label:   val.label || "",
        weekday: rawPrice(val.weekday),
        weekend: rawPrice(val.weekend),
      }));
    }

    setForm({
      title:           item.title || "",
      category:        item.category || "Paket Wisata",
      image:           item.image || "",
      weekday:         rawPrice(item.weekday),
      weekend:         rawPrice(item.weekend),
      featured:        !!item.featured,
      iconName:        item.iconName || "FaTicketAlt",
      features:        Array.isArray(item.features)
        ? [...item.features, "", "", "", "", "", ""].slice(0, 6)
        : ["", "", "", "", "", ""],
      priceCategories,
    });
    setEditId(item.firebaseId);
    setImagePreview(safeImg(item.image || ""));
    setView("form");
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `ticketsOnline/${id}`));
      showToast("Paket dihapus."); setDeleteConfirm(null);
    } catch (err) { showToast("✗ Gagal menghapus: " + err.message); }
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

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, alignItems:"flex-start" }}>
        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Foto */}
          <div style={card}>
            <label style={sectionLabel}>Foto Paket</label>
            <div onClick={() => document.getElementById("adm-ticket-file-input").click()}
              style={{ border:"2px dashed #D1D5DB", borderRadius:12, cursor:"pointer", overflow:"hidden",
                transition:"border-color 0.2s", height: imagePreview ? "auto" : 200,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#16c35b"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#D1D5DB"}>
              {imagePreview ? (
                <div style={{ position:"relative", width:"100%" }}>
                  <img src={safeImg(imagePreview)} alt="preview" style={{ width:"100%", height:240, objectFit:"cover", display:"block" }} />
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"0.3s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0}>
                    <span style={{ color:"#fff", fontWeight:600, fontSize:14 }}>Klik untuk ganti foto</span>
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, textAlign:"center", padding:"0 20px" }}>
                  <Upload size={36} color="#D1D5DB" />
                  <p style={{ fontSize:15, fontWeight:600, color:"#374151", margin:0 }}>{uploading ? "Mengupload..." : "Klik untuk upload foto paket"}</p>
                  <span style={{ fontSize:12, color:"#9CA3AF" }}>PNG, JPG, WEBP</span>
                </div>
              )}
            </div>
            <input id="adm-ticket-file-input" type="file" accept="image/*" onChange={handleFileChange} style={{ display:"none" }} />
            {uploading && <p style={{ fontSize:12, color:"#16c35b", marginTop:8, fontWeight:600 }}>Sedang mengupload foto...</p>}
            <div style={{ marginTop:10 }}>
              <label style={fieldLabel}>Atau masukkan URL foto</label>
              <input value={form.image} onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(safeImg(e.target.value)); }}
                placeholder="https://..." style={iStyle} />
            </div>
          </div>

          {/* Info Paket */}
          <div style={card}>
            <label style={sectionLabel}>Informasi Paket</label>
            <div style={{ marginBottom:12 }}>
              <label style={fieldLabel}>Nama Paket *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="cth. Paket Keluarga Weekday" style={iStyle} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                <label style={fieldLabel}>Harga Weekday (Rp) *</label>
                <input type="number" min="0" value={form.weekday}
                  onChange={e => setForm(f => ({ ...f, weekday: e.target.value }))}
                  placeholder="cth. 50000" style={iStyle} />
              </div>
              <div>
                <label style={fieldLabel}>Harga Weekend (Rp) *</label>
                <input type="number" min="0" value={form.weekend}
                  onChange={e => setForm(f => ({ ...f, weekend: e.target.value }))}
                  placeholder="cth. 75000" style={iStyle} />
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                <label style={fieldLabel}>Kategori</label>
                <input type="text" placeholder="Paket Wisata" value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={iStyle} />
              </div>
              <div>
                <label style={fieldLabel}>Icon</label>
                <select value={form.iconName} onChange={e => setForm(f => ({ ...f, iconName: e.target.value }))} style={iStyle}>
                  {TICKET_ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginTop:4 }}>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, fontWeight:600, color:"#374151" }}>
                <input type="checkbox" checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  style={{ width:16, height:16, accentColor:"#1B3A2A" }} />
                Tandai sebagai paket unggulan (featured)
              </label>
              <p style={{ fontSize:11, color:"#9CA3AF", marginTop:3, marginLeft:24 }}>Paket featured akan ditampilkan dengan border hijau di halaman publik.</p>
            </div>
          </div>

          {/* ── Harga per Kategori ── */}
          <div style={card}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
              <label style={{ ...sectionLabel, margin:0 }}>
                Harga per Kategori
                <span style={{ fontWeight:400, color:"#9CA3AF", fontSize:12, marginLeft:6 }}>
                  (opsional — jika diisi, menggantikan harga global)
                </span>
              </label>
              <button
                onClick={() => setForm(f => ({
                  ...f,
                  priceCategories: [...(f.priceCategories || []), { ...PRICE_CAT_BLANK }],
                }))}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px",
                  background:"#1B3A2A", color:"#fff", border:"none", borderRadius:8,
                  fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
                <Plus size={13} /> Tambah Kategori
              </button>
            </div>
            <p style={{ fontSize:12, color:"#9CA3AF", margin:"0 0 14px" }}>
              Contoh: Anak-Anak, Dewasa, Rombongan Pelajar. Setiap kategori punya harga weekday & weekend sendiri.
            </p>

            {(!form.priceCategories || form.priceCategories.length === 0) ? (
              <div style={{ border:"1.5px dashed #E5E7EB", borderRadius:10, padding:"22px 16px",
                textAlign:"center", color:"#9CA3AF", fontSize:13 }}>
                Belum ada kategori. Klik "+ Tambah Kategori" atau biarkan kosong untuk pakai harga global.
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {form.priceCategories.map((cat, idx) => (
                  <div key={idx} style={{ background:"#F9FAFB", border:"1px solid #E5E7EB",
                    borderRadius:10, padding:"12px 14px", position:"relative" }}>
                    {/* Row 1: Label + Key */}
                    <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:10, marginBottom:10 }}>
                      <div>
                        <label style={fieldLabel}>Nama Kategori *</label>
                        <input
                          placeholder="cth. Anak-Anak (2–12 thn)"
                          value={cat.label}
                          onChange={e => {
                            const updated = [...form.priceCategories];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setForm(f => ({ ...f, priceCategories: updated }));
                          }}
                          style={iStyle} />
                      </div>
                      <div>
                        <label style={fieldLabel}>Key / Slug</label>
                        <input
                          placeholder="cth. anak (auto)"
                          value={cat.key}
                          onChange={e => {
                            const updated = [...form.priceCategories];
                            updated[idx] = { ...updated[idx], key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,"") };
                            setForm(f => ({ ...f, priceCategories: updated }));
                          }}
                          style={{ ...iStyle, color:"#6B7280" }} />
                      </div>
                    </div>
                    {/* Row 2: Harga */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      <div>
                        <label style={fieldLabel}>Harga Weekday (Rp) *</label>
                        <input
                          type="number" min="0"
                          placeholder="cth. 25000"
                          value={cat.weekday}
                          onChange={e => {
                            const updated = [...form.priceCategories];
                            updated[idx] = { ...updated[idx], weekday: e.target.value };
                            setForm(f => ({ ...f, priceCategories: updated }));
                          }}
                          style={iStyle} />
                      </div>
                      <div>
                        <label style={fieldLabel}>Harga Weekend (Rp) *</label>
                        <input
                          type="number" min="0"
                          placeholder="cth. 35000"
                          value={cat.weekend}
                          onChange={e => {
                            const updated = [...form.priceCategories];
                            updated[idx] = { ...updated[idx], weekend: e.target.value };
                            setForm(f => ({ ...f, priceCategories: updated }));
                          }}
                          style={iStyle} />
                      </div>
                    </div>
                    {/* Preview harga */}
                    {(cat.weekday || cat.weekend) && (
                      <div style={{ display:"flex", gap:8, marginTop:10 }}>
                        {cat.weekday && (
                          <span style={{ background:"#E3F2FD", color:"#1565C0", fontSize:11, fontWeight:700,
                            padding:"3px 10px", borderRadius:6 }}>
                            Weekday: {fmtRp(cat.weekday)}
                          </span>
                        )}
                        {cat.weekend && (
                          <span style={{ background:"#FFF3E0", color:"#E65100", fontSize:11, fontWeight:700,
                            padding:"3px 10px", borderRadius:6 }}>
                            Weekend: {fmtRp(cat.weekend)}
                          </span>
                        )}
                      </div>
                    )}
                    {/* Hapus kategori */}
                    <button
                      onClick={() => {
                        const updated = form.priceCategories.filter((_, i) => i !== idx);
                        setForm(f => ({ ...f, priceCategories: updated }));
                      }}
                      title="Hapus kategori ini"
                      style={{ position:"absolute", top:10, right:10, background:"#FEF2F2",
                        border:"none", borderRadius:6, padding:"4px 8px", cursor:"pointer",
                        color:"#DC2626", fontSize:11, fontWeight:700,
                        display:"flex", alignItems:"center", gap:4 }}>
                      <X size={11} /> Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail Paket / Features */}
          <div style={card}>
            <label style={{ display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:4 }}>
              Detail Paket <span style={{ fontWeight:400, color:"#9CA3AF", fontSize:12 }}>(tampil di modal detail — maks 6 item)</span>
            </label>
            <p style={{ fontSize:12, color:"#9CA3AF", margin:"0 0 12px" }}>
              Isi keunggulan / fasilitas yang termasuk dalam paket ini. Kosongkan baris yang tidak diperlukan.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {(form.features || ["","","","","",""]).map((feat, idx) => (
                <div key={idx} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:12, color:"#9CA3AF", width:20, textAlign:"right", flexShrink:0 }}>{idx+1}.</span>
                  <input type="text"
                    placeholder={`Fasilitas ke-${idx+1}, misal: Kolam anak dengan wahana interaktif`}
                    value={feat}
                    onChange={e => {
                      const updated = [...(form.features || ["","","","","",""])];
                      updated[idx] = e.target.value;
                      setForm(f => ({ ...f, features: updated }));
                    }}
                    style={{ ...iStyle, flex:1 }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT – Preview + Save */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Preview */}
          <div style={card}>
            <label style={sectionLabel}>Preview Card</label>
            <div style={{ border: form.featured ? "2px solid #4caf50" : "1px solid #E5E7EB", borderRadius:14, overflow:"hidden" }}>
              <div style={{ height:140, background:"#f0f0f0", overflow:"hidden" }}>
                {imagePreview
                  ? <img src={safeImg(imagePreview)} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}>
                      <Image size={32} color="#D1D5DB" />
                    </div>
                }
              </div>
              <div style={{ padding:"12px 14px" }}>
                <div style={{ fontSize:11, color:"#4caf50", fontWeight:700, marginBottom:6 }}>
                  {form.category || "Paket Wisata"}
                </div>
                <div style={{ fontSize:15, fontWeight:700, color:"#1e3b25", marginBottom:10 }}>{form.title || "Nama Paket"}</div>
                <div style={{ display:"flex", gap:8 }}>
                  {(form.priceCategories && form.priceCategories.length > 0) ? (
                    <div style={{ flex:1 }}>
                      {form.priceCategories.filter(c => c.label).slice(0, 3).map((cat, i) => (
                        <div key={i} style={{ background:"#f6f8f5", borderRadius:8, padding:"6px 10px", marginBottom:4 }}>
                          <div style={{ fontSize:10, color:"#8a9e8a", fontWeight:600 }}>{cat.label || "Kategori"}</div>
                          <div style={{ fontSize:12, color:"#2f6f3e", fontWeight:700 }}>
                            {cat.weekday ? fmtRp(cat.weekday) : "—"}
                            <span style={{ color:"#9CA3AF", fontSize:10, fontWeight:400, marginLeft:4 }}>weekday</span>
                          </div>
                        </div>
                      ))}
                      {form.priceCategories.length > 3 && (
                        <div style={{ fontSize:11, color:"#9CA3AF", padding:"4px 10px" }}>
                          +{form.priceCategories.length - 3} kategori lainnya
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div style={{ flex:1, background:"#f6f8f5", borderRadius:8, padding:"8px 10px" }}>
                        <div style={{ fontSize:10, color:"#8a9e8a", fontWeight:600 }}>WEEKDAY</div>
                        <div style={{ fontSize:13, color:"#2f6f3e", fontWeight:700 }}>{form.weekday ? fmtRp(form.weekday) : "—"}</div>
                      </div>
                      <div style={{ flex:1, background:"#f6f8f5", borderRadius:8, padding:"8px 10px" }}>
                        <div style={{ fontSize:10, color:"#8a9e8a", fontWeight:600 }}>WEEKEND</div>
                        <div style={{ fontSize:13, color:"#2f6f3e", fontWeight:700 }}>{form.weekend ? fmtRp(form.weekend) : "—"}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving || uploading}
            style={{ width:"100%", padding:"14px", background:(saving||uploading)?"#9CA3AF":"#1B3A2A",
              color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700,
              cursor:(saving||uploading)?"not-allowed":"pointer" }}>
            {saving ? "Menyimpan..." : uploading ? "Menunggu upload..." : editId ? "Perbarui Paket" : "Simpan Paket"}
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

      <div className="ad-page-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 className="ad-page-title">Manajemen Tiket Online</h1>
          <p className="ad-page-sub">{items.length} paket aktif · tampil realtime di /tickets-online</p>
        </div>
        <button onClick={() => { resetForm(); setView("form"); }}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px",
            background:"#1B3A2A", color:"#fff", border:"none", borderRadius:10,
            fontSize:14, fontWeight:600, cursor:"pointer" }}>
          <Plus size={16} /> Tambah Paket
        </button>
      </div>

      {loading && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200 }}>
          <Loader size={28} color="#9CA3AF" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12,
          padding:"60px 20px", textAlign:"center" }}>
          <Ticket size={40} color="#D1D5DB" style={{ marginBottom:12 }} />
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
                ? <img src={safeImg(item.image)} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}><Image size={36} color="#D1D5DB" /></div>
              }
              {item.featured && (
                <span style={{ position:"absolute", top:8, left:8, background:"#4caf50", color:"#fff",
                  fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:4 }}>UNGGULAN</span>
              )}
              <span style={{ position:"absolute", top:8, right:8, background:"rgba(22,195,91,0.9)", color:"#fff",
                fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{item.category}</span>
            </div>
            <div style={{ padding:"14px 16px", flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:8 }}>{item.title}</div>
              <div style={{ display:"flex", gap:8 }}>
                {item.prices && typeof item.prices === "object" && Object.keys(item.prices).length > 0 ? (
                  <div style={{ flex:1, background:"#F0FDF4", borderRadius:8, padding:"8px 10px",
                    border:"1px solid #BBF7D0", display:"flex", alignItems:"center", gap:6 }}>
                    <Ticket size={13} color="#16a34a" />
                    <div>
                      <div style={{ fontSize:10, color:"#16a34a", fontWeight:700 }}>
                        {Object.keys(item.prices).length} KATEGORI HARGA
                      </div>
                      <div style={{ fontSize:11, color:"#166534", fontWeight:600 }}>
                        {Object.values(item.prices).map(p => p.label).slice(0,2).join(", ")}
                        {Object.keys(item.prices).length > 2 && " ..."}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ flex:1, background:"#f6f8f5", borderRadius:8, padding:"8px 10px" }}>
                      <div style={{ fontSize:10, color:"#8a9e8a", fontWeight:600 }}>WEEKDAY</div>
                      <div style={{ fontSize:13, color:"#2f6f3e", fontWeight:700 }}>{item.weekday || "—"}</div>
                    </div>
                    <div style={{ flex:1, background:"#f6f8f5", borderRadius:8, padding:"8px 10px" }}>
                      <div style={{ fontSize:10, color:"#8a9e8a", fontWeight:600 }}>WEEKEND</div>
                      <div style={{ fontSize:13, color:"#2f6f3e", fontWeight:700 }}>{item.weekend || "—"}</div>
                    </div>
                  </>
                )}
              </div>
              {Array.isArray(item.features) && item.features.length > 0 && (
                <div style={{ marginTop:10 }}>
                  {item.features.slice(0,3).map((f, i) => (
                    <div key={i} style={{ fontSize:12, color:"#374151", display:"flex", alignItems:"flex-start", gap:5, marginBottom:3 }}>
                      <span style={{ color:"#4caf50", fontWeight:700, flexShrink:0 }}>✓</span> {f}
                    </div>
                  ))}
                  {item.features.length > 3 && <div style={{ fontSize:11, color:"#9CA3AF", marginTop:3 }}>+{item.features.length-3} lainnya</div>}
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:8, padding:"0 16px 14px" }}>
              <button onClick={() => handleEdit(item)}
                style={{ flex:1, padding:8, background:"#F0FDF4", color:"#1B3A2A", border:"none",
                  borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <Pencil size={13} /> Edit
              </button>
              <button onClick={() => setDeleteConfirm(item)}
                style={{ flex:1, padding:8, background:"#FEF2F2", color:"#DC2626", border:"none",
                  borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <Trash2 size={13} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", padding:28, borderRadius:14, width:360, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"#FEF2F2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
              <Trash2 size={24} color="#DC2626" />
            </div>
            <h3 style={{ margin:"0 0 8px", color:"#111827", fontSize:17, fontWeight:700 }}>Hapus Paket?</h3>
            <p style={{ color:"#6B7280", fontSize:13, marginBottom:22 }}>
              Paket <strong>"{deleteConfirm.title}"</strong> akan dihapus permanen dari halaman /tickets-online.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding:"9px 20px", borderRadius:8, border:"1px solid #E5E7EB", background:"#fff", color:"#374151", fontSize:14, cursor:"pointer", fontWeight:600 }}>Batal</button>
              <button onClick={() => handleDelete(deleteConfirm.firebaseId)} style={{ padding:"9px 20px", borderRadius:8, border:"none", background:"#DC2626", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   WRITER DIRECTORY VIEW
───────────────────────────────────────────── */
function WriterDirectoryView({ articles, users }) {
  const writers = users.filter(u => u.role === "writer");

  const getWriterStats = (w) => {
    // Match by uid (authorUid), atau fallback ke displayName, atau authorAliases
    const aliases = [w.displayName, ...(w.authorAliases || [])].filter(Boolean);
    const writerArticles = articles.filter(a =>
      (w.uid && a.authorUid === w.uid) ||
      (!a.authorUid && aliases.includes(a.author))
    );
    const count     = writerArticles.length;
    const published = writerArticles.filter(a => a.status === "published").length;
    const pending   = writerArticles.filter(a => a.status === "pending").length;
    const revision  = writerArticles.filter(a => a.status === "revision").length;
    const totalViews = writerArticles.reduce((s, a) => s + (a.views || 0), 0);
    return { count, published, pending, revision, totalViews, articles: writerArticles };
  };

  return (
    <div>
      <div className="ad-page-header">
        <h1 className="ad-page-title">Writer Directory</h1>
        <p className="ad-page-sub">{writers.length} penulis terdaftar di platform Edupark</p>
      </div>
      {writers.length === 0 ? (
        <div className="ad-empty-state">
          <Users size={40} color="#D1D5DB" />
          <p>Belum ada penulis terdaftar. Tambahkan role "writer" melalui Add / Edit Role.</p>
        </div>
      ) : (
        <div className="ad-writers-grid">
          {writers.map(w => {
            const stats = getWriterStats(w);
            const initials = w.displayName
              ? w.displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
              : "W";
            return (
              <div key={w.uid} className="ad-writer-card">
                <div className="ad-writer-card__avatar">{initials}</div>
                <div className="ad-writer-card__name">{w.displayName || "—"}</div>
                <div className="ad-writer-card__email">{w.email || "—"}</div>
                <div className="ad-writer-card__stats">
                  <span>{stats.count} artikel</span>
                  <span>{stats.published} published</span>
                </div>
                {stats.count > 0 && (
                  <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                    {stats.pending > 0 && (
                      <span style={{ fontSize: 10, background: "#FFF8E1", color: "#F57F17", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>
                        {stats.pending} pending
                      </span>
                    )}
                    {stats.revision > 0 && (
                      <span style={{ fontSize: 10, background: "#FBE9E7", color: "#BF360C", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>
                        {stats.revision} revisi
                      </span>
                    )}
                    {stats.totalViews > 0 && (
                      <span style={{ fontSize: 10, background: "#EFF6FF", color: "#1565C0", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>
                        {stats.totalViews.toLocaleString()} views
                      </span>
                    )}
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
   MANAGE USERS VIEW
───────────────────────────────────────────── */
function ManageUsersView({ users }) {
  const [search, setSearch]           = useState("");
  const [toast, showToast]            = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState(null); // user object

  const displayed = users.filter(u => !search ||
    u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (uid, newRole) => {
    try {
      await update(ref(db, `users/${uid}`), { role:newRole });
      showToast(`✓ Role berhasil diubah ke ${newRole}`);
    } catch (err) { alert("Gagal ubah role: "+err.message); }
  };

  const handleDeleteUser = async (uid) => {
    try {
      await remove(ref(db, `users/${uid}`));
      showToast("✓ User berhasil dihapus dari database.");
      setDeleteConfirm(null);
    } catch (err) {
      showToast("✗ Gagal hapus: " + err.message);
      setDeleteConfirm(null);
    }
  };

  return (
    <div>
      <Toast msg={toast} />
      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", padding:28, borderRadius:14, width:360, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"#FEF2F2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
              <Trash2 size={24} color="#DC2626" />
            </div>
            <h3 style={{ margin:"0 0 8px", color:"#111827", fontSize:17, fontWeight:700 }}>Hapus User?</h3>
            <p style={{ color:"#6B7280", fontSize:13, marginBottom:6 }}>
              User <strong>"{deleteConfirm.displayName || deleteConfirm.uid}"</strong> akan dihapus dari database.
            </p>
            <p style={{ color:"#DC2626", fontSize:12, marginBottom:22, background:"#FEF2F2", padding:"8px 12px", borderRadius:8 }}>
              ⚠ Ini hanya menghapus data di Realtime Database, bukan akun Firebase Auth.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding:"9px 22px", borderRadius:8, border:"1px solid #E5E7EB", background:"#fff", color:"#374151", fontSize:14, cursor:"pointer", fontWeight:600 }}>Batal</button>
              <button onClick={() => handleDeleteUser(deleteConfirm.uid)} style={{ padding:"9px 22px", borderRadius:8, border:"none", background:"#DC2626", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
      <div className="ad-page-header">
        <h1 className="ad-page-title">Manage Users</h1>
        <p className="ad-page-sub">{users.length} pengguna terdaftar</p>
      </div>
      <div className="ad-toolbar">
        <div className="ad-search-wrap">
          <Search size={14} />
          <input className="ad-search-input" placeholder="Cari nama, email, atau role..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>
      <div className="ad-card" style={{ padding:0, overflow:"hidden" }}>
        <table className="ad-table">
          <thead>
            <tr><th>Pengguna</th><th>Email</th><th>Role Saat Ini</th><th>Ubah Role</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {displayed.length === 0
              ? <tr><td colSpan={5} className="ad-table__empty">Tidak ada pengguna.</td></tr>
              : displayed.map(u => (
                <tr key={u.uid}>
                  <td>
                    <div className="ad-table__user">
                      <div className="ad-table__avatar">{(u.displayName||"U").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}</div>
                      <span className="ad-table__name">{u.displayName||"—"}</span>
                    </div>
                  </td>
                  <td className="ad-table__email">{u.email||"—"}</td>
                  <td>
                    <span className="ad-role-badge" style={{ background:ROLE_COLORS[u.role]?.bg, color:ROLE_COLORS[u.role]?.text, border:`1px solid ${ROLE_COLORS[u.role]?.border}` }}>
                      {u.role?.toUpperCase()||"—"}
                    </span>
                  </td>
                  <td>
                    <select className="ad-role-select" value={u.role||""} onChange={e=>handleRoleChange(u.uid,e.target.value)}>
                      {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => setDeleteConfirm(u)}
                      title="Hapus user"
                      style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"6px 8px", background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA", borderRadius:7, cursor:"pointer", transition:"all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background="#DC2626"; e.currentTarget.style.color="#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="#FEF2F2"; e.currentTarget.style.color="#DC2626"; }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ADD / EDIT ROLE VIEW  — fully automatic
───────────────────────────────────────────── */
function AddRoleView({ users }) {
  const [search, setSearch]             = useState("");
  const [savingUid, setSavingUid]       = useState(null);
  const [pendingRoles, setPendingRoles] = useState({});   // { uid: selectedRole }
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, showToast]              = useToast();

  /* Split users into two lists */
  const pendingUsers  = users.filter(u => u.role === "pending");
  const activeUsers   = users.filter(u => u.role !== "pending");

  /* Filter active users by search */
  const filteredActive = activeUsers.filter(u =>
    [u.displayName, u.email, u.role].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  /*
   * FIX: Inisialisasi pendingRoles untuk setiap pending user dengan default "writer".
   * Ini penting agar dropdown selalu punya nilai yang valid sejak render pertama,
   * sehingga klik "Setujui" tanpa menyentuh dropdown tetap memakai "writer"
   * dan bukan fallback ke u.role ("pending").
   */
  useEffect(() => {
    setPendingRoles(prev => {
      const updated = { ...prev };
      users
        .filter(u => u.role === "pending")
        .forEach(u => {
          if (updated[u.uid] === undefined) {
            updated[u.uid] = "writer";
          }
        });
      return updated;
    });
  }, [users]);

  /* Get the in-flight role value for a user (or fall back to saved role) */
  const getRoleFor = (u) => pendingRoles[u.uid] ?? u.role ?? "writer";

  /* Change role inline (optimistic UI) */
  const handleRoleChange = (uid, newRole) => {
    setPendingRoles(p => ({ ...p, [uid]: newRole }));
  };

  /* Save role to Firebase (untuk active users) */
  const handleSaveRole = async (u) => {
    const newRole = getRoleFor(u);
    setSavingUid(u.uid);
    try {
      await update(ref(db, `users/${u.uid}`), { role: newRole });
      setPendingRoles(p => { const c = {...p}; delete c[u.uid]; return c; });
      showToast(`✓ Role ${u.displayName || u.uid} → ${newRole}`);
    } catch (err) {
      showToast(`✗ Gagal simpan: ${err.message}`);
    } finally {
      setSavingUid(null);
    }
  };

  /*
   * FIX: Approve pending user — baca role dari pendingRoles[u.uid] yang sudah
   * diinisialisasi di useEffect. Tidak lagi bergantung pada parameter role
   * yang bisa berisi "pending" saat dropdown belum disentuh.
   */
  const handleApprove = async (u) => {
    const role = pendingRoles[u.uid] ?? "writer";
    setSavingUid(u.uid);
    try {
      await update(ref(db, `users/${u.uid}`), { role });
      setPendingRoles(p => { const c = {...p}; delete c[u.uid]; return c; });
      showToast(`✓ ${u.displayName || u.email} disetujui sebagai ${role}`);
    } catch (err) {
      showToast(`✗ Gagal: ${err.message}`);
    } finally {
      setSavingUid(null);
    }
  };

  /* Delete user from DB */
  const handleDeleteUser = async () => {
    if (!deleteConfirm) return;
    try {
      await remove(ref(db, `users/${deleteConfirm.uid}`));
      showToast("✓ User berhasil dihapus.");
      setDeleteConfirm(null);
    } catch (err) {
      showToast(`✗ Gagal hapus: ${err.message}`);
      setDeleteConfirm(null);
    }
  };

  const isDirty = (u) => pendingRoles[u.uid] !== undefined && pendingRoles[u.uid] !== u.role;

  return (
    <div>
      <Toast msg={toast} />

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"#fff", padding:28, borderRadius:14, width:360, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"#FEF2F2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
              <Trash2 size={24} color="#DC2626" />
            </div>
            <h3 style={{ margin:"0 0 8px", color:"#111827", fontSize:17, fontWeight:700 }}>Hapus User?</h3>
            <p style={{ color:"#6B7280", fontSize:13, marginBottom:10 }}>
              <strong>"{deleteConfirm?.displayName || deleteConfirm?.uid}"</strong> akan dihapus dari database.
            </p>
            <p style={{ color:"#DC2626", fontSize:12, marginBottom:22, background:"#FEF2F2", padding:"8px 12px", borderRadius:8 }}>
              ⚠ Ini hanya menghapus data di Realtime Database, bukan akun Firebase Auth.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding:"9px 22px", borderRadius:8, border:"1px solid #E5E7EB", background:"#fff", color:"#374151", fontSize:14, cursor:"pointer", fontWeight:600 }}>Batal</button>
              <button onClick={handleDeleteUser} style={{ padding:"9px 22px", borderRadius:8, border:"none", background:"#DC2626", color:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      <div className="ad-page-header">
        <h1 className="ad-page-title">Manajemen Role</h1>
        <p className="ad-page-sub">Setujui pengguna baru dan ubah role secara langsung</p>
      </div>

      {/* ── PENDING APPROVAL SECTION ── */}
      {pendingUsers.length > 0 && (
        <div style={{ marginBottom:28 }}>
          <div style={{
            display:"flex", alignItems:"center", gap:10, marginBottom:14,
          }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#F59E0B", flexShrink:0 }} />
            <h2 style={{ margin:0, fontSize:15, fontWeight:700, color:"#111827" }}>
              Menunggu Persetujuan
            </h2>
            <span style={{ background:"#FEF3C7", color:"#92400E", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99 }}>
              {pendingUsers.length}
            </span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {pendingUsers.map(u => (
              <div key={u.uid} style={{
                background:"#fff", border:"1px solid #FCD34D", borderRadius:12,
                padding:"14px 18px", display:"flex", alignItems:"center", gap:14,
                flexWrap:"wrap",
              }}>
                {/* Avatar */}
                <div style={{
                  width:42, height:42, borderRadius:"50%", background:"#FEF3C7",
                  color:"#92400E", fontWeight:700, fontSize:15,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                }}>
                  {(u.displayName||u.email||"?").slice(0,2).toUpperCase()}
                </div>
                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{u.displayName || "—"}</div>
                  <div style={{ fontSize:12, color:"#6B7280", marginTop:1 }}>{u.email || u.uid}</div>
                </div>
                {/* Status badge */}
                <span style={{ background:"#FEF3C7", color:"#92400E", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99, border:"1px solid #FCD34D", flexShrink:0 }}>
                  PENDING
                </span>
                {/* Role picker for approve */}
                <select
                  className="ad-role-select"
                  value={getRoleFor(u)}
                  onChange={e => handleRoleChange(u.uid, e.target.value)}
                  style={{ flexShrink:0 }}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {/* Approve btn */}
                <button
                  disabled={savingUid === u.uid}
                  onClick={() => handleApprove(u)}
                  style={{
                    display:"flex", alignItems:"center", gap:6,
                    padding:"8px 16px", background:"#1B3A2A", color:"#fff",
                    border:"none", borderRadius:8, fontSize:13, fontWeight:700,
                    cursor: savingUid === u.uid ? "not-allowed" : "pointer",
                    opacity: savingUid === u.uid ? 0.7 : 1, flexShrink:0,
                  }}
                >
                  {savingUid === u.uid ? <Loader size={13} style={{ animation:"spin 1s linear infinite" }} /> : <CheckCircle size={14} />}
                  Setujui
                </button>
                {/* Reject / delete */}
                <button
                  onClick={() => setDeleteConfirm(u)}
                  style={{
                    display:"flex", alignItems:"center", gap:6,
                    padding:"8px 14px", background:"#FEF2F2", color:"#DC2626",
                    border:"1px solid #FECACA", borderRadius:8, fontSize:13, fontWeight:600,
                    cursor:"pointer", flexShrink:0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background="#DC2626"; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="#FEF2F2"; e.currentTarget.style.color="#DC2626"; }}
                >
                  <XCircle size={14} /> Tolak
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingUsers.length === 0 && (
        <div style={{
          background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:12,
          padding:"14px 20px", marginBottom:24, display:"flex", alignItems:"center", gap:10,
        }}>
          <CheckCircle size={16} color="#16A34A" />
          <span style={{ fontSize:13, color:"#15803D", fontWeight:600 }}>
            Tidak ada pengguna yang menunggu persetujuan.
          </span>
        </div>
      )}

      {/* ── ACTIVE USERS ROLE MANAGEMENT ── */}
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#2FA084", flexShrink:0 }} />
            <h2 style={{ margin:0, fontSize:15, fontWeight:700, color:"#111827" }}>
              Pengguna Aktif
            </h2>
            <span style={{ background:"#D1FAE5", color:"#065F46", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99 }}>
              {activeUsers.length}
            </span>
          </div>
          <div className="ad-search-wrap" style={{ maxWidth:280 }}>
            <Search size={14} />
            <input
              className="ad-search-input"
              placeholder="Cari nama, email, role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="ad-card" style={{ padding:0, overflow:"hidden" }}>
          <table className="ad-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Email</th>
                <th>Role Saat Ini</th>
                <th>Ubah Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredActive.length === 0
                ? <tr><td colSpan={5} className="ad-table__empty">Tidak ada pengguna ditemukan.</td></tr>
                : filteredActive.map(u => {
                    const dirty = isDirty(u);
                    const saving = savingUid === u.uid;
                    return (
                      <tr key={u.uid}>
                        <td>
                          <div className="ad-table__user">
                            <div className="ad-table__avatar">
                              {(u.displayName||"U").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                            </div>
                            <span className="ad-table__name">{u.displayName||"—"}</span>
                          </div>
                        </td>
                        <td className="ad-table__email">{u.email||"—"}</td>
                        <td>
                          <span className="ad-role-badge" style={{
                            background: ROLE_COLORS[u.role]?.bg,
                            color: ROLE_COLORS[u.role]?.text,
                            border: `1px solid ${ROLE_COLORS[u.role]?.border}`,
                          }}>
                            {u.role?.toUpperCase()||"—"}
                          </span>
                        </td>
                        <td>
                          <select
                            className="ad-role-select"
                            value={getRoleFor(u)}
                            onChange={e => handleRoleChange(u.uid, e.target.value)}
                          >
                            {[...ROLES, "pending"].map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </td>
                        <td>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            {/* Save btn — hanya muncul jika ada perubahan */}
                            {dirty && (
                              <button
                                disabled={saving}
                                onClick={() => handleSaveRole(u)}
                                title="Simpan role"
                                style={{
                                  display:"flex", alignItems:"center", gap:5,
                                  padding:"6px 12px", background:"#1B3A2A", color:"#fff",
                                  border:"none", borderRadius:7, fontSize:12, fontWeight:700,
                                  cursor: saving ? "not-allowed" : "pointer",
                                  opacity: saving ? 0.7 : 1,
                                }}
                              >
                                {saving ? <Loader size={12} /> : <Save size={12} />}
                                Simpan
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteConfirm(u)}
                              title="Hapus user"
                              style={{
                                display:"flex", alignItems:"center", justifyContent:"center",
                                padding:"6px 8px", background:"#FEF2F2", color:"#DC2626",
                                border:"1px solid #FECACA", borderRadius:7, cursor:"pointer",
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background="#DC2626"; e.currentTarget.style.color="#fff"; }}
                              onMouseLeave={e => { e.currentTarget.style.background="#FEF2F2"; e.currentTarget.style.color="#DC2626"; }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>

        {/* Role legend */}
        <div style={{ display:"flex", gap:10, marginTop:16, flexWrap:"wrap" }}>
          {ROLES.map(r => (
            <div key={r} style={{
              display:"flex", alignItems:"center", gap:8,
              background:"#fff", border:`1px solid ${ROLE_COLORS[r]?.border}`,
              borderRadius:10, padding:"8px 14px",
            }}>
              <span className="ad-role-badge" style={{ background:ROLE_COLORS[r]?.bg, color:ROLE_COLORS[r]?.text, border:`1px solid ${ROLE_COLORS[r]?.border}` }}>
                {r.toUpperCase()}
              </span>
              <span style={{ fontSize:12, color:"#6B7280" }}>
                {r==="admin"&&"Akses penuh ke semua fitur"}
                {r==="editor"&&"Review dan approve/reject artikel"}
                {r==="writer"&&"Membuat dan mengirim artikel"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MY ARTICLES VIEW — khusus artikel milik admin sendiri
───────────────────────────────────────────── */
function MyArticlesAdminView({ articles, currentUser, setActiveNav }) {
  const [filter, setFilter] = useState("all");
  const [editingArticle, setEditingArticle] = useState(null);

  const myArticles = articles.filter(a => a.authorUid === currentUser?.uid);
  const revisionArticles = myArticles.filter(a => a.status === "revision");

  const displayed = myArticles
    .filter(a => filter === "all" || a.status === filter)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus artikel ini?")) return;
    try { await remove(ref(db, `articles/${id}`)); }
    catch (err) { alert("Gagal hapus: " + err.message); }
  };

  if (editingArticle) {
    return (
      <CreateArticleView
        currentUser={currentUser}
        editArticle={editingArticle}
        onDone={() => setEditingArticle(null)}
      />
    );
  }

  return (
    <div>
      <div className="ad-page-header">
        <h1 className="ad-page-title">My Articles</h1>
        <p className="ad-page-sub">Kelola semua artikel yang sudah Anda tulis</p>
      </div>

      {/* Revision notification banner */}
      {revisionArticles.length > 0 && (
        <div style={{
          background:"#FEF3C7", border:"1px solid #FCD34D", borderRadius:12,
          padding:"14px 20px", marginBottom:20,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, fontWeight:700, color:"#92400E", fontSize:14 }}>
            <AlertCircle size={16} /> {revisionArticles.length} artikel perlu diperbaiki
          </div>
          {revisionArticles.map(a => (
            <div key={a.id} style={{ background:"#fff", borderRadius:8, padding:"10px 14px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontWeight:600, fontSize:13, color:"#111827" }}>"{a.title}"</div>
                {a.feedback && <div style={{ fontSize:12, color:"#6B7280", marginTop:2 }}>Catatan editor: {a.feedback}</div>}
              </div>
              <button
                onClick={() => setEditingArticle(a)}
                style={{ padding:"7px 16px", background:"#D97706", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                Perbaiki →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs + New Article button */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <div className="ad-filter-tabs">
          {["all","published","pending","revision","draft"].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`ad-filter-tab${filter===s?" ad-filter-tab--active":""}`}>
              {s === "all" ? "Semua" : STATUS_COLORS[s]?.label || s}
              <span className="ad-filter-tab__count">{s==="all"?myArticles.length:myArticles.filter(a=>a.status===s).length}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setActiveNav("create-article")}
          style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px", background:"#1B3A2A", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
          <Plus size={15} /> + Artikel Baru
        </button>
      </div>

      {displayed.length === 0
        ? (
          <div className="ad-empty-state">
            <BookOpen size={40} color="#D1D5DB" />
            <p>{filter === "all" ? "Belum ada artikel yang Anda tulis." : `Tidak ada artikel dengan status "${filter}".`}</p>
            <button onClick={() => setActiveNav("create-article")} style={{ marginTop:12, padding:"9px 20px", background:"#1B3A2A", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>
              Buat Artikel Pertama
            </button>
          </div>
        )
        : (
          <div className="ad-article-list">
            {displayed.map(a => (
              <div key={a.id} className={`ad-article-row-card${a.status==="revision"?" ad-article-row-card--revision":""}`}>
                <div className="ad-article-row-card__thumb">
                  {a.image ? <img src={safeImg(a.image)} alt={a.title} /> : <FileText size={20} color="#D1D5DB" />}
                </div>
                <div className="ad-article-row-card__body">
                  <div className="ad-article-row-card__cat">{a.category}</div>
                  <div className="ad-article-row-card__title">{a.title}</div>
                  <div className="ad-article-row-card__meta">
                    {a.wordCount||0} kata · {a.date}
                  </div>
                  {a.status === "revision" && a.feedback && (
                    <div style={{ fontSize:11, color:"#DC2626", marginTop:3, fontStyle:"italic" }}>
                      Catatan: {a.feedback}
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span className="ad-status-badge" style={{ background:STATUS_COLORS[a.status]?.bg, color:STATUS_COLORS[a.status]?.text }}>
                    {a.status === "revision" ? "Needs Revision" : STATUS_COLORS[a.status]?.label || a.status}
                  </span>
                  {(a.status === "revision" || a.status === "draft") && (
                    <button onClick={() => setEditingArticle(a)} title="Edit" style={{ padding:"6px", background:"none", border:"1px solid #E5E7EB", borderRadius:6, cursor:"pointer", color:"#374151", display:"flex" }}>
                      <Pencil size={14} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(a.id)} title="Hapus" style={{ padding:"6px", background:"none", border:"1px solid #FECACA", borderRadius:6, cursor:"pointer", color:"#DC2626", display:"flex" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROMO MANAGEMENT VIEW
───────────────────────────────────────────── */
const PROMO_TYPES = [
  { value:"discount_percent", label:"Diskon Persen" },
  { value:"discount_fixed",   label:"Potongan Harga" },
  { value:"cashback",         label:"Cashback" },
  { value:"free_shipping",    label:"Gratis Ongkir" },
  { value:"bundle",           label:"Bundle Promo" },
];
const BADGE_OPTIONS_PROMO = ["HOT","NEW","LIMITED","FLASH SALE","SPECIAL"];
const PROMO_BLANK = {
  title:"", subtitle:"", description:"", image:"",
  type:"discount_percent", discountValue:"", minPurchase:"",
  badgeLabel:"HOT", featured:false, active:true,
  productLink:"/produk", ctaLabel:"Belanja Sekarang",
  startDate:"", endDate:"",
};

function PromoTypeIcon({ type, size=15 }) {
  const icons = {
    discount_percent: <Percent size={size}/>,
    discount_fixed:   <Tag size={size}/>,
    bundle:           <Package size={size}/>,
    free_shipping:    <Truck size={size}/>,
    cashback:         <CreditCard size={size}/>,
  };
  return icons[type] || <Gift size={size}/>;
}

function PromoManagementView({ currentUser }) {
  const [promos, setPromos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null); // firebaseId saat edit
  const [form, setForm]         = useState(PROMO_BLANK);
  const [saving, setSaving]     = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [toast, showToast]      = useToast();

  // Realtime listener
  useEffect(() => {
    const unsub = onValue(ref(db, "promos"), snap => {
      const d = snap.val();
      setPromos(d ? Object.entries(d).map(([id,v])=>({...v,firebaseId:id})).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)) : []);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const isExpired = p => p.endDate && new Date(p.endDate).getTime() < Date.now();

  // Stats
  const totalPromos    = promos.length;
  const activeCount    = promos.filter(p => p.active && !isExpired(p)).length;
  const featuredCount  = promos.filter(p => p.featured && p.active && !isExpired(p)).length;
  const expiringSoon   = promos.filter(p => !isExpired(p) && p.endDate && new Date(p.endDate).getTime() - Date.now() < 7*86400000).length;

  const openAdd = () => { setForm(PROMO_BLANK); setEditing(null); setShowForm(true); };
  const openEdit = p => {
    setForm({
      title: p.title||"", subtitle: p.subtitle||"", description: p.description||"",
      image: p.image||"", type: p.type||"discount_percent",
      discountValue: p.discountValue||"", minPurchase: p.minPurchase||"",
      badgeLabel: p.badgeLabel||"HOT", featured: !!p.featured, active: !!p.active,
      productLink: p.productLink||"/produk", ctaLabel: p.ctaLabel||"Belanja Sekarang",
      startDate: p.startDate||"", endDate: p.endDate||"",
    });
    setEditing(p.firebaseId);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { showToast("✗ Judul promo wajib diisi."); return; }
    setSaving(true);
    try {
      const data = {
        ...form,
        discountValue: Number(form.discountValue)||0,
        minPurchase: Number(form.minPurchase)||0,
        createdBy: currentUser?.displayName || "Admin",
        updatedAt: Date.now(),
      };
      if (editing) {
        await update(ref(db, `promos/${editing}`), data);
        showToast("✓ Promo berhasil diperbarui.");
      } else {
        await push(ref(db, "promos"), { ...data, createdAt: Date.now() });
        showToast("✓ Promo berhasil ditambahkan.");
      }
      setShowForm(false);
    } catch (e) {
      showToast("✗ Gagal menyimpan: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (p) => {
    await update(ref(db, `promos/${p.firebaseId}`), { active: !p.active });
    showToast(`✓ Promo ${!p.active ? "diaktifkan" : "dinonaktifkan"}.`);
  };
  const handleToggleFeatured = async (p) => {
    await update(ref(db, `promos/${p.firebaseId}`), { featured: !p.featured });
    showToast(`✓ Promo ${!p.featured ? "dijadikan unggulan" : "dihapus dari unggulan"}.`);
  };
  const handleDelete = async () => {
    await remove(ref(db, `promos/${deleteModal.firebaseId}`));
    showToast("✓ Promo berhasil dihapus.");
    setDeleteModal(null);
  };

  const inp = { width:"100%", padding:"9px 12px", borderRadius:8, border:"1px solid #D1D5DB", fontSize:14, boxSizing:"border-box", fontFamily:"inherit", outline:"none" };

  return (
    <div>
      <Toast msg={toast} />
      {deleteModal && (
        <DeleteModal name={deleteModal.title} onConfirm={handleDelete} onCancel={()=>setDeleteModal(null)} />
      )}

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>Manajemen Promo</h1>
          <p style={{ color:"#6B7280", fontSize:14, marginTop:4 }}>Kelola seluruh promo dan penawaran Edupark secara realtime.</p>
        </div>
        <button onClick={openAdd} style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 18px", background:"#1B3A2A", color:"#fff", border:"none", borderRadius:9, fontSize:14, fontWeight:600, cursor:"pointer" }}>
          <Plus size={15}/> Tambah Promo
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Total Promo",           value:totalPromos,   color:"#1B3A2A", Icon:Gift },
          { label:"Promo Aktif",           value:activeCount,   color:"#065F46", Icon:CheckCircle },
          { label:"Featured Promo",        value:featuredCount, color:"#7C3AED", Icon:Star },
          { label:"Berakhir Minggu Ini",   value:expiringSoon,  color:"#E65100", Icon:AlertCircle },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"16px 18px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:color+"15", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon size={20} color={color}/>
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color, lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:12, color:"#6B7280", marginTop:3 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"48px 0" }}>
          <Loader size={28} color="#9CA3AF" style={{ animation:"spin 1s linear infinite" }}/>
          <p style={{ color:"#6B7280", fontSize:14, marginTop:12 }}>Memuat data promo...</p>
        </div>
      ) : promos.length === 0 ? (
        <div style={{ textAlign:"center", padding:"64px 0", background:"#fff", borderRadius:14, border:"1px solid #E5E7EB" }}>
          <Gift size={48} color="#D1D5DB" style={{ display:"block", margin:"0 auto 12px" }}/>
          <p style={{ color:"#9CA3AF", fontSize:15, fontWeight:600 }}>Belum ada promo</p>
          <p style={{ color:"#9CA3AF", fontSize:13 }}>Klik "Tambah Promo" untuk memulai.</p>
        </div>
      ) : (
        <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:14, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#F9FAFB", borderBottom:"1px solid #E5E7EB" }}>
                  {["Gambar","Judul Promo","Jenis","Diskon","Mulai","Berakhir","Status","Featured","Dibuat Oleh","Aksi"].map(h => (
                    <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontWeight:700, color:"#374151", fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promos.map((p, i) => {
                  const expired = isExpired(p);
                  return (
                    <tr key={p.firebaseId} style={{ borderBottom: i < promos.length-1 ? "1px solid #F3F4F6" : "none", background: expired ? "#FFFBF5" : "#fff" }}>
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ width:44, height:44, borderRadius:8, overflow:"hidden", background:"#F3F4F6", flexShrink:0 }}>
                          {p.image ? <img src={safeImg(p.image)} alt={p.title} style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><Gift size={18} color="#D1D5DB"/></div>}
                        </div>
                      </td>
                      <td style={{ padding:"10px 14px", maxWidth:180 }}>
                        <div style={{ fontWeight:700, color:"#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.title}</div>
                        {p.subtitle && <div style={{ fontSize:11, color:"#9CA3AF", marginTop:2 }}>{p.subtitle}</div>}
                        {p.badgeLabel && <span style={{ fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:4, background:"#FEE2E2", color:"#DC2626", marginTop:3, display:"inline-block" }}>{p.badgeLabel}</span>}
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5, color:"#6B7280" }}>
                          <PromoTypeIcon type={p.type}/>
                          <span style={{ fontSize:12 }}>{PROMO_TYPES.find(t=>t.value===p.type)?.label||p.type}</span>
                        </div>
                      </td>
                      <td style={{ padding:"10px 14px", fontWeight:700, color:"#1B3A2A" }}>
                        {p.type==="discount_percent"||p.type==="cashback" ? `${p.discountValue||0}%` : p.type==="discount_fixed" ? `Rp ${Number(p.discountValue||0).toLocaleString("id-ID")}` : "-"}
                      </td>
                      <td style={{ padding:"10px 14px", color:"#6B7280", fontSize:12 }}>{p.startDate||"-"}</td>
                      <td style={{ padding:"10px 14px", color: expired?"#DC2626":"#6B7280", fontSize:12, fontWeight: expired?700:400 }}>{p.endDate||"-"}</td>
                      <td style={{ padding:"10px 14px" }}>
                        <button onClick={()=>handleToggleActive(p)} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, border:"none", cursor:"pointer", fontSize:11, fontWeight:700, background: p.active&&!expired?"#D1FAE5":"#F3F4F6", color: p.active&&!expired?"#065F46":"#9CA3AF" }}>
                          {p.active&&!expired ? <ToggleRight size={14}/> : <ToggleLeft size={14}/>}
                          {expired ? "Expired" : p.active ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <button onClick={()=>handleToggleFeatured(p)} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:20, border:"none", cursor:"pointer", fontSize:11, fontWeight:700, background: p.featured?"#EDE9FE":"#F3F4F6", color: p.featured?"#7C3AED":"#9CA3AF" }}>
                          <Star size={12}/> {p.featured?"Ya":"Tidak"}
                        </button>
                      </td>
                      <td style={{ padding:"10px 14px", color:"#6B7280", fontSize:12 }}>{p.createdBy||"-"}</td>
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={()=>openEdit(p)} style={{ padding:"6px", background:"none", border:"1px solid #BFDBFE", borderRadius:6, cursor:"pointer", color:"#1E40AF", display:"flex" }}>
                            <Pencil size={13}/>
                          </button>
                          <button onClick={()=>setDeleteModal(p)} style={{ padding:"6px", background:"none", border:"1px solid #FECACA", borderRadius:6, cursor:"pointer", color:"#DC2626", display:"flex" }}>
                            <Trash2 size={13}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:1000, overflowY:"auto", padding:"32px 16px" }}>
          <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:640, padding:28, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:"#111827", margin:0 }}>{editing ? "Edit Promo" : "Tambah Promo Baru"}</h2>
              <button onClick={()=>setShowForm(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF" }}><X size={20}/></button>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {/* Judul */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Judul Promo *</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Misal: Diskon Merchandise 20%" style={inp}/>
              </div>
              {/* Subjudul */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Subjudul Promo</label>
                <input value={form.subtitle} onChange={e=>setForm(f=>({...f,subtitle:e.target.value}))} placeholder="Misal: Promo Minggu Ini" style={inp}/>
              </div>
              {/* Deskripsi */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Deskripsi Promo</label>
                <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Deskripsi singkat promo..." rows={3} style={{ ...inp, resize:"vertical" }}/>
              </div>
              {/* URL Gambar */}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>URL Gambar Promo</label>
                <input value={form.image} onChange={e=>setForm(f=>({...f,image:e.target.value}))} placeholder="https://..." style={inp}/>
              </div>
              {/* Jenis Promo */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Jenis Promo</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={{ ...inp }}>
                  {PROMO_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {/* Nilai Diskon */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Nilai Diskon</label>
                <input type="number" value={form.discountValue} onChange={e=>setForm(f=>({...f,discountValue:e.target.value}))} placeholder="Misal: 20" style={inp}/>
              </div>
              {/* Min Pembelian */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Minimum Pembelian (Rp)</label>
                <input type="number" value={form.minPurchase} onChange={e=>setForm(f=>({...f,minPurchase:e.target.value}))} placeholder="0 = tidak ada minimum" style={inp}/>
              </div>
              {/* Badge */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Label Badge</label>
                <select value={form.badgeLabel} onChange={e=>setForm(f=>({...f,badgeLabel:e.target.value}))} style={inp}>
                  {BADGE_OPTIONS_PROMO.map(b=><option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              {/* Tanggal Mulai */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Tanggal Mulai</label>
                <input type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} style={inp}/>
              </div>
              {/* Tanggal Berakhir */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Tanggal Berakhir</label>
                <input type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} style={inp}/>
              </div>
              {/* CTA Label */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Label Tombol CTA</label>
                <input value={form.ctaLabel} onChange={e=>setForm(f=>({...f,ctaLabel:e.target.value}))} placeholder="Belanja Sekarang" style={inp}/>
              </div>
              {/* Product Link */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 }}>Link Produk</label>
                <input value={form.productLink} onChange={e=>setForm(f=>({...f,productLink:e.target.value}))} placeholder="/produk" style={inp}/>
              </div>
              {/* Switches */}
              <div style={{ gridColumn:"1/-1", display:"flex", gap:24 }}>
                {[
                  { key:"active",   label:"Promo Aktif",            color:"#065F46", bg:"#D1FAE5" },
                  { key:"featured", label:"Promo Unggulan (Featured)", color:"#7C3AED", bg:"#EDE9FE" },
                ].map(({ key, label, color, bg }) => (
                  <label key={key} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"10px 16px", background: form[key] ? bg : "#F9FAFB", borderRadius:10, border:`1px solid ${form[key] ? color+"40":"#E5E7EB"}`, flex:1 }}>
                    <div onClick={()=>setForm(f=>({...f,[key]:!f[key]}))} style={{ width:38, height:22, borderRadius:11, background: form[key] ? color : "#D1D5DB", position:"relative", transition:"background 0.2s", cursor:"pointer", flexShrink:0 }}>
                      <div style={{ position:"absolute", top:3, left: form[key]?18:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
                    </div>
                    <span style={{ fontSize:13, fontWeight:600, color: form[key] ? color : "#6B7280" }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:22 }}>
              <button onClick={()=>setShowForm(false)} style={{ padding:"10px 20px", borderRadius:8, border:"1px solid #E5E7EB", background:"#fff", color:"#374151", fontSize:14, cursor:"pointer", fontWeight:600 }}>Batal</button>
              <button onClick={handleSave} disabled={saving} style={{ padding:"10px 22px", borderRadius:8, border:"none", background: saving?"#6B7280":"#1B3A2A", color:"#fff", fontSize:14, cursor: saving?"not-allowed":"pointer", fontWeight:700, display:"flex", alignItems:"center", gap:8 }}>
                <Save size={15}/> {saving ? "Menyimpan..." : "Simpan Promo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ADMIN SETTINGS VIEW
───────────────────────────────────────────── */
function AdminSettingsView({ currentUser, onLogout }) {
  const [name,   setName]   = useState(currentUser?.displayName || "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const inputSt = {
    width:"100%", padding:"9px 12px", borderRadius:8,
    border:"1px solid #D1D5DB", fontSize:14, boxSizing:"border-box",
    fontFamily:"inherit", color:"#111827", outline:"none",
  };

  const handleSave = async () => {
    if (!name.trim()) { setErrMsg("Nama tidak boleh kosong."); setStatus("error"); return; }
    setSaving(true); setStatus(null); setErrMsg("");
    try {
      const { getAuth, updateProfile } = await import("firebase/auth");
      const auth = getAuth();
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name.trim() });
        const { ref: dbRef, update: dbUpdate } = await import("firebase/database");
        await dbUpdate(dbRef(db, `users/${auth.currentUser.uid}`), { displayName: name.trim() });
      }
      setStatus("success");
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setErrMsg(err.message || "Gagal menyimpan.");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", margin:0 }}>Settings</h1>
        <p style={{ color:"#6B7280", fontSize:14, marginTop:4 }}>Kelola profil dan preferensi akun administrator</p>
      </div>

      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:24, marginBottom:16 }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:"#111827", margin:"0 0 16px" }}>Informasi Profil</h3>
        <div style={{ marginBottom:12 }}>
          <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 }}>Nama Lengkap</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nama lengkap Anda"
            style={inputSt}
            onFocus={e => e.target.style.borderColor="#1B3A2A"}
            onBlur={e => e.target.style.borderColor="#D1D5DB"}
          />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 }}>Email</label>
          <input
            type="email"
            value={currentUser?.email || ""}
            disabled
            style={{ ...inputSt, background:"#F9FAFB", color:"#9CA3AF", cursor:"not-allowed" }}
          />
          <p style={{ fontSize:11, color:"#9CA3AF", marginTop:4 }}>Email tidak dapat diubah dari sini.</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding:"9px 20px", background:saving?"#6B7280":"#1B3A2A", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:saving?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:7 }}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          {status === "success" && <span style={{ fontSize:13, color:"#16a34a" }}>✓ Perubahan berhasil disimpan!</span>}
          {status === "error"   && <span style={{ fontSize:13, color:"#dc2626" }}>✗ {errMsg}</span>}
        </div>
      </div>

      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:24 }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:"#111827", margin:"0 0 8px" }}>Akun</h3>
        <p style={{ fontSize:13, color:"#6B7280", marginBottom:16 }}>Keluar dari sesi admin portal Anda.</p>
        <button onClick={onLogout}
          style={{ padding:"9px 20px", background:"#dc2626", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("dashboard");

  const [articles,      setArticles]      = useState([]);
  const [users,         setUsers]         = useState([]);
  const [products,      setProducts]      = useState([]);
  const [gallery,       setGallery]       = useState([]);
  const [attractions,   setAttractions]   = useState([]);
  const [ticketsOnline, setTicketsOnline] = useState([]);
  const [promos,        setPromos]        = useState([]);

  /* ── Auto-create/update user entry in /users ──
     CATATAN: Pembuatan user baru & sinkronisasi role kini ditangani sepenuhnya
     oleh AuthContext.jsx (onValue realtime listener). useEffect ini sengaja
     dihapus untuk mencegah race condition yang bisa overwrite role user
     (misalnya role "writer" menimpa role yang baru saja di-approve admin).
  ── */

  /* ── Realtime listeners ── */
  useEffect(() => {
    if (!user) return;

    const unsubA = onValue(ref(db, "articles"), snap => {
      const d = snap.val();
      setArticles(d ? Object.entries(d).map(([id,v])=>({id,...v})) : []);
    });
    const unsubU = onValue(ref(db, "users"), snap => {
      const d = snap.val();
      setUsers(d ? Object.entries(d).map(([uid,v])=>({uid,...v})) : []);
    });
    const unsubP = onValue(ref(db, "produk"), snap => {
      const d = snap.val();
      setProducts(d ? Object.entries(d).map(([id,v])=>({id,...v})) : []);
    });
    const unsubG = onValue(ref(db, "gallery"), snap => {
      const d = snap.val();
      setGallery(d ? Object.entries(d).map(([id,v])=>({id,...v})) : []);
    });
    const unsubAtt = onValue(ref(db, "attractions"), snap => {
      const d = snap.val();
      setAttractions(d ? Object.entries(d).map(([id,v])=>({...v, firebaseId:id})) : []);
    });
    const unsubTick = onValue(ref(db, "ticketsOnline"), snap => {
      const d = snap.val();
      setTicketsOnline(d ? Object.entries(d).map(([id,v])=>({...v, firebaseId:id})) : []);
    });
    const unsubPromo = onValue(ref(db, "promos"), snap => {
      const d = snap.val();
      setPromos(d ? Object.entries(d).map(([id,v])=>({...v, firebaseId:id})) : []);
    });

    return () => { unsubA(); unsubU(); unsubP(); unsubG(); unsubAtt(); unsubTick(); unsubPromo(); };
  }, [user]);

  const handleLogout = async () => { await logout(); };

  const pendingCount = articles.filter(a => a.status === "pending").length;
  const myRevisionCount = articles.filter(a => a.authorUid === user?.uid && a.status === "revision").length;

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard":
        return <DashboardView articles={articles} users={users} products={products} gallery={gallery} attractions={attractions} ticketsOnline={ticketsOnline} promos={promos} setActiveNav={setActiveNav} currentUser={user} />;
      case "create-article":
        return <CreateArticleView currentUser={user} onDone={() => setActiveNav("my-articles")} />;
      case "my-articles":
        return <MyArticlesAdminView articles={articles} currentUser={user} setActiveNav={setActiveNav} />;
      case "all-articles":
        return <AllArticlesView articles={articles} />;
      case "analytics":
        return <AnalyticsView articles={articles} />;
      case "review-articles":
        return <ReviewArticlesView articles={articles} />;
      case "produk":
        return <ProdukView />;
      case "gallery":
        return <GalleryView />;
      case "attractions":
        return <AttractionsView />;
      case "tiket-online":
        return <TicketsOnlineAdminView />;
      case "promo":
        return <PromoManagementView currentUser={user} />;
      case "writer-directory":
        return <WriterDirectoryView articles={articles} users={users} />;
      case "manage-users":
        return <ManageUsersView users={users} />;
      case "add-role":
        return <AddRoleView users={users} />;
      case "settings":
        return <AdminSettingsView currentUser={user} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="ad-root">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} currentUser={user} pendingCount={pendingCount} myRevisionCount={myRevisionCount} />
      <div className="ad-main">
        <Topbar activeNav={activeNav} onLogout={handleLogout} pendingCount={pendingCount} />
        <div className="ad-content">{renderContent()}</div>
      </div>
    </div>
  );
}