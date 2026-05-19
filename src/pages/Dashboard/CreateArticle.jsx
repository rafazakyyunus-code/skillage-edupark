import { useState, useEffect } from "react";
import "./CreateArticle.css";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import ImageExtension from "@tiptap/extension-image";

import { db } from "../../firebase";
import { ref, onValue, remove, set, update } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";

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
  LogOut,
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

const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",      Icon: LayoutDashboard },
  { id: "create",      label: "Create Article", Icon: PenSquare },
  { id: "my-articles", label: "My Articles",    Icon: FileText },
  { id: "analytics",   label: "Analytics",      Icon: BarChart3 },
];

/* ──────────────────────────────────────────
   SIDEBAR
   ────────────────────────────────────────── */
function Sidebar({ activeNav, setActiveNav, currentUser }) {
  const initials = currentUser?.displayName
    ? currentUser.displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "AT";

  return (
    <aside className="ca-sidebar">
      <div className="ca-sidebar__brand">
        <div className="ca-brand-icon">
          {/* Graduation cap icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
          </svg>
        </div>
        <div>
          <div className="ca-brand-name">Edupark</div>
          <div className="ca-brand-sub">Writer Portal</div>
        </div>
      </div>

      <nav className="ca-nav">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`ca-nav-btn${active ? " ca-nav-btn--active" : ""}`}
            >
              <Icon size={16} color={active ? "#fff" : "rgba(255,255,255,0.55)"} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="ca-nav-settings">
        <button
          onClick={() => setActiveNav("settings")}
          className={`ca-nav-btn${activeNav === "settings" ? " ca-nav-btn--active" : ""}`}
        >
          <Settings size={16} color={activeNav === "settings" ? "#fff" : "rgba(255,255,255,0.55)"} />
          Settings
        </button>
      </div>

      <div className="ca-sidebar__user">
        <div className="ca-user-btn">
          <div className="ca-avatar">{initials}</div>
          <div>
            <div className="ca-user-name">{currentUser?.displayName || "Alex Thompson"}</div>
            <div className="ca-user-role">{currentUser?.role || "Senior Writer"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────
   TOPBAR — tombol duplikat dihapus
   ────────────────────────────────────────── */
function Topbar({ activeNav }) {
  const breadcrumb = {
    dashboard:    "Dashboard",
    create:       "Create Article",
    "my-articles": "My Articles",
    analytics:    "Analytics",
    settings:     "Settings",
  }[activeNav] || activeNav;

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
      {/* Tombol Save Draft & Submit for Review dihapus dari sini karena sudah ada di dalam form */}
    </div>
  );
}

/* ──────────────────────────────────────────
   DASHBOARD VIEW
   ────────────────────────────────────────── */
function DashboardView({ myArticles, setActiveNav }) {
  const published  = myArticles.filter(a => a.status === "published").length;
  const pending    = myArticles.filter(a => a.status === "pending").length;
  const totalViews = myArticles.reduce((sum, a) => sum + (a.views || 0), 0);

  return (
    <div>
      <div className="ca-dash__greeting">
        <h1>Selamat datang, Penulis! 👋</h1>
        <p>Berikut ringkasan aktivitas penulisan Anda.</p>
      </div>

      <div className="ca-stats">
        {[
          { label: "Total Artikel",  value: myArticles.length,          color: "#1b3a2a" },
          { label: "Published",      value: published,                   color: "#16a34a" },
          { label: "Pending Review", value: pending,                     color: "#f57f17" },
          { label: "Total Views",    value: totalViews.toLocaleString(), color: "#1565c0" },
        ].map(s => (
          <div key={s.label} className="ca-stat">
            <div className="ca-stat__label">{s.label}</div>
            <div className="ca-stat__value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div className="ca-recent">
          <div className="ca-recent__head">
            <h2>Artikel Terbaru</h2>
            <button className="ca-link-btn" onClick={() => setActiveNav("my-articles")}>Lihat semua →</button>
          </div>
          {myArticles.slice(0, 4).map(a => {
            const s = STATUS_MAP[a.status] || STATUS_MAP.draft;
            return (
              <div key={a.id} className="ca-article-row">
                <div className="ca-article-row__initials" style={{ overflow: "hidden", borderRadius: 6 }}>
                  {a.image
                    ? <img src={a.image} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : (a.title ? a.title.charAt(0) : "A")}
                </div>
                <div className="ca-article-row__info">
                  <div className="ca-article-row__title">{a.title}</div>
                  <div className="ca-article-row__meta">{a.category} · {a.date}</div>
                </div>
                <span className="ca-badge" style={{ background: s.bg, color: s.text }}>{s.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Tips Menulis</h2>
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
          <button className="ca-btn-submit" style={{ width: "100%", marginTop: 12 }} onClick={() => setActiveNav("create")}>
            + Tulis Artikel Baru
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   CREATE / EDIT ARTICLE VIEW
   Mendukung mode "edit" untuk artikel revision
   ────────────────────────────────────────── */
function CreateArticleView({ onSubmitSuccess, onSaveDraft, onRefresh, editArticle, onCancelEdit }) {
  const isEditMode = !!editArticle;

  const [image, setImage]         = useState(editArticle?.image || null);
  const [tags, setTags]           = useState(editArticle?.tags || ["FutureOfEd", "AI"]);
  const [inputTag, setInputTag]   = useState("");
  const [visibility, setVisibility] = useState(editArticle?.visibility || "public");
  const [title, setTitle]         = useState(editArticle?.title || "");
  const [category, setCategory]   = useState(editArticle?.category || CATEGORIES[0]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  // Load draft dari localStorage hanya jika bukan edit mode
  useEffect(() => {
    if (isEditMode) return;
    const saved = JSON.parse(localStorage.getItem("edupark_draft")) || {};
    if (saved.title)      setTitle(saved.title);
    if (saved.tags)       setTags(saved.tags);
    if (saved.visibility) setVisibility(saved.visibility);
    if (saved.category)   setCategory(saved.category);
    if (saved.image)      setImage(saved.image);
  }, [isEditMode]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Underline,
      ImageExtension,
    ],
    content: isEditMode ? (editArticle.content || "") : "",
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

  // Save draft ke Firebase (bukan localStorage saja)
  const saveDraft = async () => {
    if (!title.trim()) {
      alert("Isi judul terlebih dahulu untuk menyimpan draft");
      return;
    }
    setIsLoading(true);
    try {
      const draftData = {
        title:      title.trim(),
        category,
        content:    editor?.getHTML() || "",
        status:     "draft",
        author:     "Admin Edupark",
        wordCount:  editor ? editor.getText().split(/\s+/).filter(Boolean).length : 0,
        date:       new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        image:      image || "",
        tags,
        visibility,
        views:      0,
        feedback:   "",
      };

      if (isEditMode && editArticle.id) {
        // Update draft yang sudah ada
        await update(ref(db, `articles/${editArticle.id}`), draftData);
      } else {
        // Buat draft baru dengan ID unik
        const newId = `draft_${Date.now()}`;
        await set(ref(db, `articles/${newId}`), { ...draftData, id: newId });
      }

      // Juga simpan ke localStorage sebagai backup
      localStorage.setItem("edupark_draft", JSON.stringify(draftData));
      onSaveDraft?.();
      alert("Draft berhasil disimpan!");
    } catch (err) {
      console.error("Save draft error:", err);
      alert("Gagal menyimpan draft: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!title.trim()) {
      alert("Judul artikel tidak boleh kosong!");
      return;
    }

    const articleContent = editor ? editor.getHTML() : "";
    const articleData = {
      title:      title.trim(),
      category,
      content:    articleContent,
      status:     "pending",
      author:     isEditMode ? editArticle.author : "Admin Edupark",
      wordCount:  editor ? editor.getText().split(/\s+/).filter(Boolean).length : 0,
      date:       new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      image:      image || "",
      tags,
      visibility,
      views:      isEditMode ? (editArticle.views || 0) : 0,
      feedback:   "",
    };

    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode && editArticle.id) {
        // UPDATE artikel yang sudah ada (mode revisi)
        await update(ref(db, `articles/${editArticle.id}`), articleData);
      } else {
        // CREATE artikel baru
        if (onSubmitSuccess) await onSubmitSuccess(articleData);
      }

      localStorage.removeItem("edupark_draft");
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Gagal mengirim artikel: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="ca-success">
        <div className="ca-success__icon"><CheckCircle size={30} color="#16a34a" /></div>
        <h2>{isEditMode ? "Artikel Berhasil Diperbarui!" : "Artikel Berhasil Disubmit!"}</h2>
        <p>{isEditMode ? "Artikel revisi Anda telah dikirim kembali untuk review." : "Artikel Anda sedang dalam proses review oleh editor."}</p>
        <button
          className="ca-success__btn"
          onClick={() => {
            setSubmitted(false);
            if (isEditMode && onCancelEdit) onCancelEdit();
            else onRefresh?.();
          }}
        >
          {isEditMode ? "Kembali ke My Articles" : "+ Tulis Artikel Baru"}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header edit mode */}
      {isEditMode && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Edit Artikel</h2>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
              Perbaiki sesuai catatan revisi dari editor.
              {editArticle.feedback && (
                <span style={{ display: "block", marginTop: 6, padding: "8px 12px", background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 8, color: "#5D4037", fontStyle: "italic" }}>
                  Catatan editor: "{editArticle.feedback}"
                </span>
              )}
            </p>
          </div>
          <button onClick={onCancelEdit} style={{ padding: "8px 16px", background: "none", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#4B5563" }}>
            Batal
          </button>
        </div>
      )}

      {error && (
        <div style={{ background: "#FBE9E7", border: "1px solid #FFCCBC", borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: "#BF360C", fontSize: 13 }}>
          {error}
        </div>
      )}

      <div className="ca-editor-layout">
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
              <button className={`ca-toolbar-btn${editor?.isActive("bold") ? " ca-toolbar-btn--active" : ""}`} onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }} title="Bold"><Bold size={14} /></button>
              <button className={`ca-toolbar-btn${editor?.isActive("italic") ? " ca-toolbar-btn--active" : ""}`} onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleItalic().run(); }} title="Italic"><Italic size={14} /></button>
              <button className={`ca-toolbar-btn${editor?.isActive("underline") ? " ca-toolbar-btn--active" : ""}`} onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleUnderline().run(); }} title="Underline"><UnderlineIcon size={14} /></button>
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
                <button key={lbl} className={`ca-toolbar-btn${editor?.isActive(type, attrs) ? " ca-toolbar-btn--active" : ""}`} onMouseDown={e => { e.preventDefault(); editor?.chain().focus().toggleHeading(attrs).run(); }} style={{ width: "auto", padding: "0 8px", fontSize: 11, fontWeight: 700 }}>{lbl}</button>
              ))}
            </div>
            <EditorContent editor={editor} className="ca-editor-content" />
          </div>
        </div>

        <div className="ca-right">
          <div className="ca-panel">
            <h4 className="ca-panel__title">Featured Image</h4>
            <label className="ca-upload">
              {image ? <img src={image} alt="preview" /> : (
                <>
                  <div className="ca-upload__icon"><ImagePlus size={20} color="#1b3a2a" /></div>
                  <p>Click to upload</p>
                  <span>PNG, JPG or WEBP (Max 2MB)</span>
                </>
              )}
              <input type="file" hidden accept="image/*" onChange={handleImage} />
            </label>
            {image && (
              <button style={{ marginTop: 8, fontSize: 12, color: "#dc2626", background: "none", border: "none", cursor: "pointer" }} onClick={() => setImage(null)}>Hapus gambar</button>
            )}
          </div>

          <div className="ca-panel">
            <h4 className="ca-panel__title">Category</h4>
            <select className="ca-select" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
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
            <input className="ca-tag-input" value={inputTag} onChange={e => setInputTag(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="Add a tag..." />
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

          {/* Submit for Review */}
          <button
            className="ca-btn-submit"
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ width: "100%", opacity: isLoading ? 0.6 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
          >
            {isLoading ? "Mengirim..." : (isEditMode ? "Kirim Ulang untuk Review" : "Submit for Review")}
          </button>

          {/* Save Draft — hanya tampil jika bukan edit mode */}
          {!isEditMode && (
            <button
              className="ca-btn-draft"
              onClick={saveDraft}
              disabled={isLoading}
              style={{ width: "100%", marginTop: 8 }}
            >
              Save as Draft
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   MY ARTICLES VIEW
   ────────────────────────────────────────── */
function MyArticlesView({ articles, setActiveNav, onEditArticle }) {
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [viewingArticle, setViewingArticle] = useState(null);

  const filters = [
    { id: "all",       label: "Semua" },
    { id: "published", label: "Published" },
    { id: "pending",   label: "Pending" },
    { id: "revision",  label: "Revisi" },
    { id: "draft",     label: "Draft" },
  ];

  const filtered = filter === "all" ? articles : articles.filter(a => a.status === filter);

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus artikel ini?")) return;
    setIsLoading(true);
    try {
      await remove(ref(db, `articles/${id}`));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus artikel: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Modal preview artikel
  if (viewingArticle) {
    return (
      <div>
        <button
          onClick={() => setViewingArticle(null)}
          style={{ background: "none", border: "none", color: "#6B7280", fontSize: 13, cursor: "pointer", marginBottom: 16, fontWeight: 500, padding: 0 }}
        >
          ← Kembali ke My Articles
        </button>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "28px 32px" }}>
          {viewingArticle.image && (
            <img src={viewingArticle.image} alt={viewingArticle.title} style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 10, marginBottom: 20 }} />
          )}
          <div style={{ fontSize: 11, background: "#E8F4FD", color: "#1565C0", borderRadius: 4, padding: "2px 8px", fontWeight: 700, display: "inline-block", marginBottom: 12 }}>
            {viewingArticle.category}
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>{viewingArticle.title}</h1>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>
            {viewingArticle.wordCount} kata · {viewingArticle.date}
            {viewingArticle.views > 0 && ` · ${viewingArticle.views.toLocaleString()} views`}
          </div>
          <div style={{ color: "#374151", fontSize: 15, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: viewingArticle.content }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ca-myart__head">
        <h1>My Articles</h1>
        <p>Kelola semua artikel yang sudah Anda tulis</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="ca-myart-filters">
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`ca-filter-btn${filter === f.id ? " ca-filter-btn--active" : ""}`}>{f.label}</button>
          ))}
        </div>
        <button className="ca-btn-submit" onClick={() => setActiveNav("create")}>+ Artikel Baru</button>
      </div>

      {filtered.length === 0 ? (
        <div className="ca-empty">
          <FileText size={40} />
          <p style={{ margin: "8px 0 0", fontSize: 14 }}>Tidak ada artikel dengan status ini.</p>
        </div>
      ) : (
        <div className="ca-article-list">
          {filtered.map(a => {
            const s = STATUS_MAP[a.status] || STATUS_MAP.draft;
            return (
              <div key={a.id} className="ca-article-item">
                <div className="ca-article-item__thumb">
                  {a.image
                    ? <img src={a.image} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", background: "#c8e6c9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📄</div>
                  }
                </div>
                <div className="ca-article-item__body">
                  <div className="ca-article-item__title">{a.title}</div>
                  <div className="ca-article-item__meta">
                    {a.category} · {(a.wordCount || 0).toLocaleString()} kata · {a.date}
                    {a.views > 0 && ` · ${a.views.toLocaleString()} views`}
                  </div>
                  {/* Tampilkan catatan revision jika ada */}
                  {a.status === "revision" && a.feedback && (
                    <div style={{ fontSize: 12, color: "#BF360C", marginTop: 4, fontStyle: "italic" }}>
                      Catatan: {a.feedback}
                    </div>
                  )}
                </div>
                <span className="ca-badge" style={{ background: s.bg, color: s.text }}>{s.label}</span>
                <div className="ca-article-item__actions">
                  {/* Tombol Eye: hanya untuk artikel published, buka preview */}
                  {a.status === "published" && (
                    <button
                      className="ca-icon-btn"
                      title="Lihat Artikel"
                      onClick={() => setViewingArticle(a)}
                    >
                      <Eye size={14} />
                    </button>
                  )}
                  {/* Tombol Pencil: untuk revision dan draft, buka edit mode */}
                  {(a.status === "revision" || a.status === "draft") && (
                    <button
                      className="ca-icon-btn"
                      title="Edit & Perbaiki"
                      onClick={() => onEditArticle(a)}
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  {/* Tombol Hapus */}
                  <button
                    className="ca-icon-btn"
                    title="Hapus"
                    style={{ color: "#dc2626" }}
                    onClick={() => handleDelete(a.id)}
                    disabled={isLoading}
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
   ANALYTICS VIEW — data realtime dari Firebase
   ────────────────────────────────────────── */
function AnalyticsView({ myArticles }) {
  const totalViews    = myArticles.reduce((s, a) => s + (a.views || 0), 0);
  const published     = myArticles.filter(a => a.status === "published").length;
  const totalWords    = myArticles.reduce((s, a) => s + (a.wordCount || 0), 0);
  const avgReadTime   = totalWords > 0 ? (totalWords / 200).toFixed(1) : "0";
  const uniqueReaders = Math.round(totalViews * 0.72); // estimasi dari total views

  // Agregasi views per bulan dari data artikel (berdasarkan field date)
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const viewsByMonth = Array(12).fill(0);
  myArticles.forEach(a => {
    if (!a.date) return;
    const d = new Date(a.date);
    if (!isNaN(d)) viewsByMonth[d.getMonth()] += (a.views || 0);
  });
  const maxVal = Math.max(...viewsByMonth, 1);

  const topArticles = [...myArticles].filter(a => a.views > 0).sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div>
      <div className="ca-analytics__head">
        <h1>Analytics</h1>
        <p>Pantau performa artikel Anda secara realtime</p>
      </div>

      <div className="ca-analytics-grid">
        {[
          { label: "Total Views",       value: totalViews.toLocaleString(), Icon: Eye,       color: "#1565c0" },
          { label: "Artikel Published", value: published,                   Icon: BookOpen,  color: "#16a34a" },
          { label: "Avg Read Time",     value: `${avgReadTime}m`,           Icon: TrendingUp, color: "#f57f17" },
          { label: "Est. Unique Readers", value: uniqueReaders.toLocaleString(), Icon: Users, color: "#6d28d9" },
        ].map(card => (
          <div key={card.label} className="ca-analytics-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div className="ca-analytics-card__label">{card.label}</div>
              <card.Icon size={16} color="#9ca3af" />
            </div>
            <div className="ca-analytics-card__value" style={{ color: card.color }}>{card.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Data realtime dari Firebase</div>
          </div>
        ))}
      </div>

      {/* Chart views per bulan */}
      <div className="ca-chart-placeholder">
        <h3>Views per Bulan (berdasarkan data artikel)</h3>
        <div className="ca-bar-chart">
          {viewsByMonth.map((val, i) => (
            <div
              key={monthLabels[i]}
              className="ca-bar"
              style={{ height: `${(val / maxVal) * 100}%`, background: val > 0 ? "#1b3a2a" : "#e5e7eb" }}
              title={`${monthLabels[i]}: ${val} views`}
            />
          ))}
        </div>
        <div className="ca-bar-labels">
          {monthLabels.map(m => <div key={m} className="ca-bar-label">{m}</div>)}
        </div>
      </div>

      {topArticles.length > 0 ? (
        <div className="ca-top-articles">
          <h3>Artikel Terpopuler</h3>
          {topArticles.map((a, i) => (
            <div key={a.id} className="ca-top-article-row">
              <div className="ca-rank">{i + 1}</div>
              <div style={{ width: 36, height: 36, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#E8F4EE" }}>
                {a.image
                  ? <img src={a.image} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📄</div>
                }
              </div>
              <div className="ca-top-article-row__title">{a.title}</div>
              <div className="ca-top-article-row__views">
                <Eye size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
                {a.views.toLocaleString()} views
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24, textAlign: "center", color: "#6B7280", fontSize: 14 }}>
          Belum ada artikel dengan data views. Publish artikel untuk melihat statistik.
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   SETTINGS VIEW — dengan Login/Logout
   ────────────────────────────────────────── */
function SettingsView({ currentUser }) {
  const [name, setName]   = useState(currentUser?.displayName || "Alex Thompson");
  const [email, setEmail] = useState(currentUser?.email || "alex.thompson@edupark.id");
  const [bio, setBio]     = useState("Senior writer and education enthusiast.");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
      alert("Gagal logout: " + err.message);
    }
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
          <textarea className="ca-form-input" value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ resize: "vertical" }} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button className="ca-settings-save-btn" onClick={handleSave}>Simpan Perubahan</button>
        {saved && <span style={{ fontSize: 13, color: "#16a34a", display: "flex", alignItems: "center", gap: 5 }}><CheckCircle size={14} /> Tersimpan!</span>}
      </div>

      {/* Logout Section */}
      <div className="ca-settings-card">
        <h3>Akun & Keamanan</h3>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
          Keluar dari sesi penulis Anda. Anda perlu login kembali untuk mengakses portal.
        </p>
        <button
          onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   MAIN EXPORT
   ────────────────────────────────────────── */
export default function CreateArticle({ onExternalSubmit, currentUser }) {
  const [activeNav, setActiveNav]     = useState("dashboard");
  const [myArticles, setMyArticles]   = useState([]);
  const [editingArticle, setEditingArticle] = useState(null); // artikel yang sedang diedit

  // Sync data artikel dari Firebase Realtime
  useEffect(() => {
    const articlesRef = ref(db, "articles");
    const unsubscribe = onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setMyArticles(list);
      } else {
        setMyArticles([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Mulai edit artikel (mode revisi/draft)
  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setActiveNav("create");
  };

  // Batal edit
  const handleCancelEdit = () => {
    setEditingArticle(null);
    setActiveNav("my-articles");
  };

  // Navigasi sidebar — reset edit mode saat pindah ke create baru
  const handleSetActiveNav = (nav) => {
    if (nav === "create" && activeNav !== "create") {
      setEditingArticle(null); // reset ke mode buat baru
    }
    setActiveNav(nav);
  };

  const handleSubmitSuccess = async (articleData) => {
    if (onExternalSubmit) {
      await onExternalSubmit(articleData);
    }
    setActiveNav("my-articles");
  };

  return (
    <div className="ca-root">
      <Sidebar activeNav={activeNav} setActiveNav={handleSetActiveNav} currentUser={currentUser} />

      <div className="ca-main">
        <Topbar activeNav={activeNav} />

        <div className="ca-body">
          {activeNav === "dashboard" && (
            <DashboardView myArticles={myArticles} setActiveNav={handleSetActiveNav} />
          )}

          {activeNav === "create" && (
            <CreateArticleView
              onSubmitSuccess={handleSubmitSuccess}
              onSaveDraft={() => {}}
              onRefresh={() => { setEditingArticle(null); setActiveNav("my-articles"); }}
              editArticle={editingArticle}
              onCancelEdit={handleCancelEdit}
            />
          )}

          {activeNav === "my-articles" && (
            <MyArticlesView
              articles={myArticles}
              setActiveNav={handleSetActiveNav}
              onEditArticle={handleEditArticle}
            />
          )}

          {activeNav === "analytics" && (
            <AnalyticsView myArticles={myArticles} />
          )}

          {activeNav === "settings" && (
            <SettingsView currentUser={currentUser} />
          )}
        </div>
      </div>
    </div>
  );
}