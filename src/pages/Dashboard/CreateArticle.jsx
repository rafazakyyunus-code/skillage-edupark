import { useState, useEffect } from "react";
import "./createArticle.css";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";

import {
  LayoutDashboard,
  PenSquare,
  FileText,
  BarChart3,
  Settings,
  ImagePlus,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  X,
  CheckCircle,
  Eye,
  Pencil,
  Trash2,
  TrendingUp,
  Users,
  BookOpen,
  Star,
} from "lucide-react";

/* ──────────────────────────────────────────
   CONSTANTS
   ────────────────────────────────────────── */
const CATEGORIES = [
  "Education Technology",
  "AI & Machine Learning",
  "STEM Education",
  "Early Childhood",
  "Higher Education",
  "K-12",
  "EdTech",
];

const STATUS_MAP = {
  published: { bg: "#E8F5E9", text: "#1B5E20", label: "Published" },
  pending:   { bg: "#FFF8E1", text: "#F57F17", label: "Pending Review" },
  revision:  { bg: "#FBE9E7", text: "#BF360C", label: "Needs Revision" },
  draft:     { bg: "#F3F4F6", text: "#4B5563", label: "Draft" },
};

const SEED_MY_ARTICLES = [
  {
    id: 1,
    title: "The Future of Digital Learning in Post-Pandemic Era",
    category: "Education Technology",
    status: "published",
    date: "Oct 24, 2023",
    wordCount: 1248,
    views: 3420,
  },
  {
    id: 2,
    title: "Integrating AI Tools in Modern Classrooms",
    category: "AI & Machine Learning",
    status: "pending",
    date: "Oct 18, 2023",
    wordCount: 980,
    views: 0,
  },
  {
    id: 3,
    title: "Early Childhood Education: Play-Based Learning",
    category: "Early Childhood",
    status: "revision",
    date: "Oct 10, 2023",
    wordCount: 1540,
    views: 0,
  },
  {
    id: 4,
    title: "STEM Programs That Actually Work",
    category: "STEM Education",
    status: "draft",
    date: "Oct 5, 2023",
    wordCount: 620,
    views: 0,
  },
];

const NAV_ITEMS = [
  { id: "dashboard",       label: "Dashboard",      Icon: LayoutDashboard },
  { id: "create",          label: "Create Article", Icon: PenSquare },
  { id: "my-articles",     label: "My Articles",    Icon: FileText },
  { id: "analytics",       label: "Analytics",      Icon: BarChart3 },
];

/* ──────────────────────────────────────────
   SIDEBAR
   ────────────────────────────────────────── */
function Sidebar({ activeNav, setActiveNav }) {
  return (
    <aside className="ca-sidebar">
      {/* Brand */}
      <div className="ca-sidebar__brand">
        <div className="ca-brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <div>
          <div className="ca-brand-name">Edupark</div>
          <div className="ca-brand-sub">Writer Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="ca-nav">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`ca-nav-btn${active ? " ca-nav-btn--active" : ""}`}
            >
              <Icon
                size={16}
                color={active ? "#fff" : "rgba(255,255,255,0.55)"}
              />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="ca-nav-settings">
        <button
          onClick={() => setActiveNav("settings")}
          className={`ca-nav-btn${activeNav === "settings" ? " ca-nav-btn--active" : ""}`}
        >
          <Settings
            size={16}
            color={activeNav === "settings" ? "#fff" : "rgba(255,255,255,0.55)"}
          />
          Settings
        </button>
      </div>

      {/* User */}
      <div className="ca-sidebar__user">
        <div className="ca-user-btn">
          <div className="ca-avatar">AT</div>
          <div>
            <div className="ca-user-name">Alex Thompson</div>
            <div className="ca-user-role">Senior Writer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────
   TOPBAR
   ────────────────────────────────────────── */
function Topbar({ activeNav, lastSaved, onSaveDraft, onSubmit }) {
  const breadcrumb = {
    dashboard:    "Dashboard",
    create:       "Create Article",
    "my-articles": "My Articles",
    analytics:    "Analytics",
    settings:     "Settings",
  }[activeNav] || activeNav;

  const formatTime = (date) => {
    if (!date) return "Not saved yet";
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="ca-topbar">
      <div className="ca-breadcrumb">
        <span>Dashboard</span>
        {activeNav !== "dashboard" && (
          <>
            <span className="ca-breadcrumb__sep">›</span>
            <span className="ca-breadcrumb__current">{breadcrumb}</span>
          </>
        )}
      </div>

      <div className="ca-topbar__right">
        {activeNav === "create" && (
          <>
            <span className="ca-save-status">
              Last saved: {formatTime(lastSaved)}
            </span>
            <button className="ca-btn-draft" onClick={onSaveDraft}>
              Save Draft
            </button>
            <button className="ca-btn-submit" onClick={onSubmit}>
              Submit for Review
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   DASHBOARD VIEW
   ────────────────────────────────────────── */
function DashboardView({ myArticles, setActiveNav }) {
  const published = myArticles.filter(a => a.status === "published").length;
  const pending   = myArticles.filter(a => a.status === "pending").length;
  const totalViews = myArticles.reduce((sum, a) => sum + (a.views || 0), 0);

  return (
    <div>
      <div className="ca-dash__greeting">
        <h1>Selamat datang, Alex! 👋</h1>
        <p>Berikut ringkasan aktivitas penulisan Anda.</p>
      </div>

      {/* Stats */}
      <div className="ca-stats">
        {[
          { label: "Total Artikel",  value: myArticles.length, color: "#1b3a2a" },
          { label: "Published",      value: published,         color: "#16a34a" },
          { label: "Pending Review", value: pending,           color: "#f57f17" },
          { label: "Total Views",    value: totalViews.toLocaleString(), color: "#1565c0" },
        ].map(s => (
          <div key={s.label} className="ca-stat" style={{ gridColumn: "auto" }}>
            <div className="ca-stat__label">{s.label}</div>
            <div className="ca-stat__value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Recent articles */}
        <div className="ca-recent">
          <div className="ca-recent__head">
            <h2>Artikel Terbaru</h2>
            <button className="ca-link-btn" onClick={() => setActiveNav("my-articles")}>
              Lihat semua →
            </button>
          </div>
          {myArticles.slice(0, 4).map(a => {
            const s = STATUS_MAP[a.status] || STATUS_MAP.draft;
            return (
              <div key={a.id} className="ca-article-row">
                <div className="ca-article-row__initials">
                  {a.title.charAt(0)}
                </div>
                <div className="ca-article-row__info">
                  <div className="ca-article-row__title">{a.title}</div>
                  <div className="ca-article-row__meta">
                    {a.category} · {a.date}
                  </div>
                </div>
                <span className="ca-badge" style={{ background: s.bg, color: s.text }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick tips */}
        <div
          style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>
            Tips Menulis
          </h2>
          {[
            "Gunakan judul yang menarik dan informatif",
            "Sertakan gambar berkualitas tinggi",
            "Tambahkan tag yang relevan untuk SEO",
            "Review sebelum submit untuk menghindari revisi",
            "Artikel 800–1500 kata lebih sering dibaca",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 13, color: "#374151", alignItems: "flex-start" }}>
              <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>✓</span>
              {tip}
            </div>
          ))}

          <button
            className="ca-btn-submit"
            style={{ width: "100%", marginTop: 12 }}
            onClick={() => setActiveNav("create")}
          >
            + Tulis Artikel Baru
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   CREATE ARTICLE VIEW
   ────────────────────────────────────────── */
function CreateArticleView({ onSubmitSuccess, onSaveDraft }) {
  const [image, setImage]         = useState(null);
  const [tags, setTags]           = useState(["FutureOfEd", "AI"]);
  const [inputTag, setInputTag]   = useState("");
  const [visibility, setVisibility] = useState("public");
  const [title, setTitle]         = useState("");
  const [category, setCategory]   = useState(CATEGORIES[0]);
  const [submitted, setSubmitted] = useState(false);

  /* Load draft from localStorage */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("edupark_draft")) || {};
    if (saved.title) setTitle(saved.title);
    if (saved.tags)  setTags(saved.tags);
    if (saved.visibility) setVisibility(saved.visibility);
    if (saved.category)   setCategory(saved.category);
  }, []);

  /* TipTap editor */
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: true }),
      Underline,
      Image,
    ],
    content: "<p>Start writing your masterpiece...</p>",
  });

  /* Image upload */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* Tags */
  const addTag = () => {
    const t = inputTag.trim();
    if (t && !tags.includes(t)) setTags(p => [...p, t]);
    setInputTag("");
  };

  /* Save draft */
  const saveDraft = () => {
    localStorage.setItem("edupark_draft", JSON.stringify({
      title,
      content: editor?.getHTML(),
      tags,
      visibility,
      category,
    }));
    onSaveDraft();
  };

  /* Submit */

const handleSubmit = async () => {
  const contentHTML = editor?.getHTML() || "";

  const article = {
    title,
    content: contentHTML,
    author: "Admin Edupark",
    image,
  };

  try {
    // 🔗 kirim ke backend PHP
    await fetch("http://localhost/api/create_article.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });

    // hitung word count (TETAP DIPAKE UI KAMU)
    const wc = contentHTML
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;

    // 🔁 update state local (biar langsung muncul di My Articles)
    onSubmitSuccess({
      title,
      category,
      tags,
      visibility,
      image,
      wordCount: Math.max(wc, 1),
      content: contentHTML,
    });

    // UI success
    setSubmitted(true);

  } catch (err) {
    console.error(err);
    alert("Gagal kirim artikel");
  }
};

  if (submitted) {
    return (
      <div className="ca-success">
        <div className="ca-success__icon">
          <CheckCircle size={30} color="#16a34a" />
        </div>
        <h2>Artikel Berhasil Disubmit!</h2>
        <p>
          Artikel Anda sedang dalam proses review oleh editor.
          Anda akan mendapat notifikasi setelah selesai diproses.
        </p>
        <button className="ca-success__btn" onClick={() => setSubmitted(false)}>
          + Tulis Artikel Baru
        </button>
      </div>
    );
  }

  const toolbarBtn = (label, onClick, isActive = false) => (
    <button
      key={label}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`ca-toolbar-btn${isActive ? " ca-toolbar-btn--active" : ""}`}
      title={label}
    >
      {label}
    </button>
  );

  return (
    <div className="ca-editor-layout">
      {/* LEFT — title + editor */}
      <div className="ca-left">
        {/* Title */}
        <div className="ca-title-card">
          <div className="ca-title-label">Article Title</div>
          <input
            className="ca-title-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter your catchy title..."
          />
        </div>

        {/* Editor */}
        <div className="ca-editor-card">
          {/* Toolbar */}
          <div className="ca-toolbar">
            <button
              className={`ca-toolbar-btn${editor?.isActive("bold") ? " ca-toolbar-btn--active" : ""}`}
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }}
              title="Bold"
            >
              <Bold size={14} />
            </button>
            <button
              className={`ca-toolbar-btn${editor?.isActive("italic") ? " ca-toolbar-btn--active" : ""}`}
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleItalic().run(); }}
              title="Italic"
            >
              <Italic size={14} />
            </button>
            <button
              className={`ca-toolbar-btn${editor?.isActive("underline") ? " ca-toolbar-btn--active" : ""}`}
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleUnderline().run(); }}
              title="Underline"
            >
              <UnderlineIcon size={14} />
            </button>

            <div className="ca-toolbar-sep" />

            <button
              className="ca-toolbar-btn"
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBulletList().run(); }}
              title="Bullet List"
            >
              <List size={14} />
            </button>
            <button
              className="ca-toolbar-btn"
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleOrderedList().run(); }}
              title="Ordered List"
            >
              <ListOrdered size={14} />
            </button>
            <button
              className="ca-toolbar-btn"
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBlockquote().run(); }}
              title="Blockquote"
            >
              <Quote size={14} />
            </button>
            <button
              className="ca-toolbar-btn"
              onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleCodeBlock().run(); }}
              title="Code Block"
            >
              <Code size={14} />
            </button>

            <div className="ca-toolbar-sep" />

            <button
              className="ca-toolbar-btn"
              onMouseDown={e => {
                e.preventDefault();
                const url = prompt("Masukkan URL:");
                if (url) editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
              }}
              title="Insert Link"
            >
              <LinkIcon size={14} />
            </button>
            <button
              className="ca-toolbar-btn"
              onMouseDown={e => {
                e.preventDefault();
                const url = prompt("Masukkan URL gambar:");
                if (url) editor?.chain().focus().setImage({ src: url }).run();
              }}
              title="Insert Image"
            >
              <ImagePlus size={14} />
            </button>

            <div className="ca-toolbar-sep" />

            {/* Heading shortcuts */}
            {[["H1", "heading", { level: 1 }], ["H2", "heading", { level: 2 }], ["H3", "heading", { level: 3 }]].map(([lbl, type, attrs]) => (
              <button
                key={lbl}
                className={`ca-toolbar-btn${editor?.isActive(type, attrs) ? " ca-toolbar-btn--active" : ""}`}
                onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleHeading(attrs).run(); }}
                style={{ width: "auto", padding: "0 8px", fontSize: 11, fontWeight: 700 }}
              >
                {lbl}
              </button>
            ))}
          </div>

          {/* Editor content */}
          <EditorContent editor={editor} className="ca-editor-content" />
        </div>
      </div>

      {/* RIGHT — metadata panels */}
      <div className="ca-right">
        {/* Featured Image */}
        <div className="ca-panel">
          <h4 className="ca-panel__title">Featured Image</h4>
          <label className="ca-upload">
            {image ? (
              <img src={image} alt="preview" />
            ) : (
              <>
                <div className="ca-upload__icon">
                  <ImagePlus size={20} color="#1b3a2a" />
                </div>
                <p>Click to upload</p>
                <span>PNG, JPG or WEBP (Max 2MB)</span>
              </>
            )}
            <input type="file" hidden accept="image/*" onChange={handleImage} />
          </label>
          {image && (
            <button
              style={{ marginTop: 8, fontSize: 12, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif" }}
              onClick={() => setImage(null)}
            >
              Hapus gambar
            </button>
          )}
        </div>

        {/* Category */}
        <div className="ca-panel">
          <h4 className="ca-panel__title">Category</h4>
          <select
            className="ca-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Tags */}
        <div className="ca-panel">
          <h4 className="ca-panel__title">Tags</h4>
          <div className="ca-tags">
            {tags.map((t, i) => (
              <span key={i} className="ca-tag">
                {t}
                <button className="ca-tag__remove" onClick={() => setTags(tags.filter((_, j) => j !== i))}>
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
          <input
            className="ca-tag-input"
            value={inputTag}
            onChange={e => setInputTag(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder="Add a tag..."
          />
        </div>

        {/* Visibility */}
        <div className="ca-panel">
          <h4 className="ca-panel__title">Visibility</h4>
          <div className="ca-radio-group">
            {[["public", "Public"], ["private", "Members Only"]].map(([val, lbl]) => (
              <label key={val} className="ca-radio-item">
                <input
                  type="radio"
                  checked={visibility === val}
                  onChange={() => setVisibility(val)}
                />
                {lbl}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   MY ARTICLES VIEW
   ────────────────────────────────────────── */
function MyArticlesView({ articles, setArticles, setActiveNav }) {
  const [filter, setFilter] = useState("all");

  const filters = [
    { id: "all",       label: "Semua" },
    { id: "published", label: "Published" },
    { id: "pending",   label: "Pending" },
    { id: "revision",  label: "Revisi" },
    { id: "draft",     label: "Draft" },
  ];

  const filtered =
    filter === "all" ? articles : articles.filter(a => a.status === filter);

  const handleDelete = (id) => {
    if (!window.confirm("Hapus artikel ini?")) return;
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div>
      <div className="ca-myart__head">
        <h1>My Articles</h1>
        <p>Kelola semua artikel yang sudah Anda tulis</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="ca-myart-filters">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`ca-filter-btn${filter === f.id ? " ca-filter-btn--active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="ca-btn-submit" onClick={() => setActiveNav("create")}>
          + Artikel Baru
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="ca-empty">
          <FileText size={40} />
          <p style={{ margin: "8px 0 0", fontSize: 14 }}>
            Tidak ada artikel dengan status ini.
          </p>
        </div>
      ) : (
        <div className="ca-article-list">
          {filtered.map(a => {
            const s = STATUS_MAP[a.status] || STATUS_MAP.draft;
            return (
              <div key={a.id} className="ca-article-item">
                {/* Thumb placeholder */}
                <div className="ca-article-item__thumb">
                  <div style={{ width: "100%", height: "100%", background: "#c8e6c9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    📄
                  </div>
                </div>

                <div className="ca-article-item__body">
                  <div className="ca-article-item__title">{a.title}</div>
                  <div className="ca-article-item__meta">
                    {a.category} · {a.wordCount.toLocaleString()} kata · {a.date}
                    {a.views > 0 && ` · ${a.views.toLocaleString()} views`}
                  </div>
                </div>

                <span className="ca-badge" style={{ background: s.bg, color: s.text }}>
                  {s.label}
                </span>

                <div className="ca-article-item__actions">
                  {a.status === "published" && (
                    <button className="ca-icon-btn" title="Lihat">
                      <Eye size={14} />
                    </button>
                  )}
                  <button
                    className="ca-icon-btn"
                    title="Edit"
                    onClick={() => setActiveNav("create")}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="ca-icon-btn"
                    title="Hapus"
                    style={{ color: "#dc2626" }}
                    onClick={() => handleDelete(a.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   ANALYTICS VIEW
   ────────────────────────────────────────── */
function AnalyticsView({ myArticles }) {
  const totalViews  = myArticles.reduce((s, a) => s + (a.views || 0), 0);
  const published   = myArticles.filter(a => a.status === "published").length;

  const barData = [
    { label: "Jan", val: 40 },
    { label: "Feb", val: 65 },
    { label: "Mar", val: 55 },
    { label: "Apr", val: 80 },
    { label: "May", val: 70 },
    { label: "Jun", val: 95 },
    { label: "Jul", val: 85 },
    { label: "Aug", val: 110 },
    { label: "Sep", val: 90 },
    { label: "Oct", val: 130 },
    { label: "Nov", val: 115 },
    { label: "Dec", val: 100 },
  ];
  const maxVal = Math.max(...barData.map(d => d.val));

  const topArticles = [...myArticles]
    .filter(a => a.views > 0)
    .sort((a, b) => b.views - a.views);

  return (
    <div>
      <div className="ca-analytics__head">
        <h1>Analytics</h1>
        <p>Pantau performa artikel Anda</p>
      </div>

      {/* KPI cards */}
      <div className="ca-analytics-grid">
        {[
          {
            label: "Total Views",
            value: totalViews.toLocaleString(),
            change: "+18%",
            up: true,
            Icon: Eye,
          },
          {
            label: "Artikel Published",
            value: published,
            change: "+2",
            up: true,
            Icon: BookOpen,
          },
          {
            label: "Avg Read Time",
            value: "4.2m",
            change: "+0.3m",
            up: true,
            Icon: TrendingUp,
          },
          {
            label: "Unique Readers",
            value: "1,842",
            change: "-5%",
            up: false,
            Icon: Users,
          },
        ].map(card => (
          <div key={card.label} className="ca-analytics-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div className="ca-analytics-card__label">{card.label}</div>
              <card.Icon size={16} color="#9ca3af" />
            </div>
            <div className="ca-analytics-card__value">{card.value}</div>
            <div className={`ca-analytics-card__change ${card.up ? "ca-analytics-card__change--up" : "ca-analytics-card__change--down"}`}>
              {card.up ? "↑" : "↓"} {card.change} dari bulan lalu
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="ca-chart-placeholder">
        <h3>Views per Bulan (2023)</h3>
        <div className="ca-bar-chart">
          {barData.map((d, i) => (
            <div
              key={d.label}
              className={`ca-bar${i === 9 ? " ca-bar--highlight" : ""}`}
              style={{ height: `${(d.val / maxVal) * 100}%` }}
              title={`${d.label}: ${d.val} views`}
            />
          ))}
        </div>
        <div className="ca-bar-labels">
          {barData.map(d => (
            <div key={d.label} className="ca-bar-label">{d.label}</div>
          ))}
        </div>
      </div>

      {/* Top articles */}
      {topArticles.length > 0 && (
        <div className="ca-top-articles">
          <h3>Artikel Terpopuler</h3>
          {topArticles.map((a, i) => (
            <div key={a.id} className="ca-top-article-row">
              <div className="ca-rank">{i + 1}</div>
              <div className="ca-top-article-row__title">{a.title}</div>
              <div className="ca-top-article-row__views">
                <Eye size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
                {a.views.toLocaleString()} views
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   SETTINGS VIEW
   ────────────────────────────────────────── */
function SettingsView() {
  const [name, setName]   = useState("Alex Thompson");
  const [email, setEmail] = useState("alex.thompson@edupark.id");
  const [bio, setBio]     = useState("Senior writer and education enthusiast.");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="ca-settings__head">
        <h1>Settings</h1>
        <p>Kelola profil dan preferensi akun Anda</p>
      </div>

      <div className="ca-settings-card">
        <h3>Informasi Profil</h3>
        <div className="ca-form-row">
          <label className="ca-form-label">Nama Lengkap</label>
          <input className="ca-form-input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="ca-form-row">
          <label className="ca-form-label">Email</label>
          <input className="ca-form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="ca-form-row">
          <label className="ca-form-label">Bio</label>
          <textarea
            className="ca-form-input"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            style={{ resize: "vertical" }}
          />
        </div>
      </div>

      <div className="ca-settings-card">
        <h3>Ganti Password</h3>
        <div className="ca-form-row">
          <label className="ca-form-label">Password Lama</label>
          <input className="ca-form-input" type="password" placeholder="••••••••" />
        </div>
        <div className="ca-form-row">
          <label className="ca-form-label">Password Baru</label>
          <input className="ca-form-input" type="password" placeholder="••••••••" />
        </div>
        <div className="ca-form-row">
          <label className="ca-form-label">Konfirmasi Password Baru</label>
          <input className="ca-form-input" type="password" placeholder="••••••••" />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="ca-settings-save-btn" onClick={handleSave}>
          Simpan Perubahan
        </button>
        {saved && (
          <span style={{ fontSize: 13, color: "#16a34a", display: "flex", alignItems: "center", gap: 5 }}>
            <CheckCircle size={14} /> Tersimpan!
          </span>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   MAIN EXPORT
   ────────────────────────────────────────── */
export default function CreateArticle() {
  const [activeNav, setActiveNav]   = useState("create");
  const [lastSaved, setLastSaved]   = useState(null);
  const [myArticles, setMyArticles] = useState(SEED_MY_ARTICLES);

  const handleSaveDraft = () => setLastSaved(new Date());

  const handleSubmitSuccess = (articleData) => {
    const now = new Date();
    const newArticle = {
      ...articleData,
      id: Date.now(),
      status: "pending",
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      views: 0,
    };
    setMyArticles(p => [newArticle, ...p]);
  };

  return (
    <div className="ca-root">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div className="ca-main">
        <Topbar
          activeNav={activeNav}
          lastSaved={lastSaved}
          onSaveDraft={handleSaveDraft}
          onSubmit={() => {
            /* trigger submit from topbar — we need a ref or lifting state.
               For now the topbar Submit button is wired to inner component
               via the shared handler below. This is a placeholder if you want
               to wire it from the topbar.  The Create view handles its own submit. */
          }}
        />

        <div className="ca-body">
          {activeNav === "dashboard" && (
            <DashboardView
              myArticles={myArticles}
              setActiveNav={setActiveNav}
            />
          )}

          {activeNav === "create" && (
            <CreateArticleView
              onSubmitSuccess={handleSubmitSuccess}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {activeNav === "my-articles" && (
            <MyArticlesView
              articles={myArticles}
              setArticles={setMyArticles}
              setActiveNav={setActiveNav}
            />
          )}

          {activeNav === "analytics" && (
            <AnalyticsView myArticles={myArticles} />
          )}

          {activeNav === "settings" && <SettingsView />}
        </div>
      </div>
    </div>
  );
}