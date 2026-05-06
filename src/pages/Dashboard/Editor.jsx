import { useState } from "react";

const ARTICLES = [
  {
    id: 1,
    title: "Modern Pedagogical Approaches in Virtual Classrooms: A Comprehensive Review",
    author: "Sarah Jenkins",
    role: "Academic Contributor",
    category: "EDUCATION TECH",
    submitted: "2 hours ago",
    wordCount: 1248,
    status: "pending",
    content: [
      { type: "paragraph", text: "The shift towards digital learning environments has necessitated a fundamental re-evaluation of how we engage with students. No longer can we rely solely on traditional lecture-style delivery; instead, we must pivot toward interactive, multimodal strategies that prioritize student agency and collaborative inquiry." },
      { type: "heading", text: "The Rise of Asynchronous Collaboration" },
      { type: "paragraph", text: "One of the most significant changes observed in the last decade is the movement towards asynchronous learning models. By allowing students to digest materials at their own pace before coming together for live discussions, educators are finding higher levels of critical engagement and better retention of complex concepts." },
      { type: "heading", text: "Gamification and Student Motivation" },
      { type: "paragraph", text: "Gamification, when applied thoughtfully, goes beyond simple points and leaderboards. It involves creating a 'flow state' where the challenge level matches the learner's skill. This article explores how Edupark's proprietary modules leverage these psychology-backed mechanics to reduce dropout rates by 24% in secondary education pilots." },
      { type: "paragraph", text: "In conclusion, the modern virtual classroom is not merely a mirror of the physical one. It is a unique ecosystem that requires tailored pedagogical tools. The future of education lies in the seamless integration of AI-driven personalization with human-centric instructional design." },
    ],
    checklist: { plagiarism: true, styleGuide: true, imageAttribution: false, seoKeywords: false },
  },
  {
    id: 2,
    title: "Integrating Project-Based Learning in STEM Curricula",
    author: "Budi Santoso",
    role: "Guest Contributor",
    category: "STEM EDUCATION",
    submitted: "5 hours ago",
    wordCount: 975,
    status: "pending",
    content: [
      { type: "paragraph", text: "Project-based learning (PBL) has emerged as one of the most effective pedagogical frameworks for STEM disciplines. By situating students within authentic problem contexts, PBL bridges the gap between theoretical knowledge and real-world application." },
      { type: "heading", text: "Key Components of Effective PBL" },
      { type: "paragraph", text: "Effective project-based learning requires a carefully structured challenge, sustained inquiry, student voice and choice, reflection, critique and revision, and public product presentation. These components work together to create rich learning experiences." },
    ],
    checklist: { plagiarism: true, styleGuide: false, imageAttribution: false, seoKeywords: false },
  },
  {
    id: 3,
    title: "The Role of Emotional Intelligence in Early Childhood Education",
    author: "Dewi Rahayu",
    role: "Education Researcher",
    category: "EARLY CHILDHOOD",
    submitted: "1 day ago",
    wordCount: 1540,
    status: "revision",
    content: [
      { type: "paragraph", text: "Emotional intelligence (EQ) is increasingly recognized as a cornerstone of holistic child development. Research consistently demonstrates that children with higher EQ outperform their peers not only socially but academically as well." },
    ],
    checklist: { plagiarism: true, styleGuide: true, imageAttribution: true, seoKeywords: false },
  },
];

const CATEGORY_COLORS = {
  "EDUCATION TECH":  { bg: "#E8F4FD", text: "#1565C0" },
  "STEM EDUCATION":  { bg: "#E8F5E9", text: "#2E7D32" },
  "EARLY CHILDHOOD": { bg: "#FFF3E0", text: "#E65100" },
};

const STATUS_COLORS = {
  pending:   { bg: "#FFF8E1", text: "#F57F17", label: "Pending Review" },
  revision:  { bg: "#FBE9E7", text: "#BF360C", label: "Revision" },
  published: { bg: "#E8F5E9", text: "#1B5E20", label: "Published" },
};

const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",       Icon: DashboardIcon },
  { id: "review",      label: "Review Articles",  Icon: ReviewIcon },
  { id: "writers",     label: "Writer Directory", Icon: WritersIcon },
  { id: "performance", label: "Performance",      Icon: PerformanceIcon },
  { id: "settings",    label: "Settings",         Icon: SettingsIcon },
];

/* ── Icons ── */
function DashboardIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}
function ReviewIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}
function WritersIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function PerformanceIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function SettingsIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#fff" : "rgba(255,255,255,0.6)"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

/* ── Sidebar ── */
function Sidebar({ activeNav, setActiveNav }) {
  return (
    <div style={{
      width: 200, minWidth: 200, background: "#1B3A2A",
      height: "100vh", position: "fixed", left: 0, top: 0,
      display: "flex", flexDirection: "column", zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.12)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "0.02em", fontFamily: "Georgia, serif" }}>Edupark</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "sans-serif" }}>Editor Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "10px 16px",
                background: active ? "rgba(255,255,255,0.12)" : "transparent",
                border: "none", cursor: "pointer",
                color: active ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: 13, fontFamily: "sans-serif", textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <Icon active={active} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#3D6B52", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "sans-serif" }}>
            JW
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "sans-serif" }}>James Wilson</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>Senior Editor</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard View ── */
function DashboardView({ articles, setActiveNav }) {
  const pending  = articles.filter(a => a.status === "pending").length;
  const revision = articles.filter(a => a.status === "revision").length;
  const published = articles.filter(a => a.status === "published").length;

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Dashboard</h1>
        <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Selamat datang, James. Ada artikel yang perlu direview hari ini.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Pending Review",      value: pending,   color: "#F57F17" },
          { label: "Revisi Diminta",      value: revision,  color: "#BF360C" },
          { label: "Published Bulan Ini", value: published, color: "#1B5E20" },
        ].map(stat => (
          <div key={stat.label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Artikel Terbaru</h2>
          <button onClick={() => setActiveNav("review")} style={{ fontSize: 13, color: "#1B3A2A", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            Lihat semua →
          </button>
        </div>
        {articles.map(a => {
          const sc = STATUS_COLORS[a.status] || STATUS_COLORS.pending;
          return (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ width: 36, height: 36, background: "#E8F4EE", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#1B3A2A", flexShrink: 0 }}>
                {a.author.split(" ").map(n => n[0]).join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{a.author} · {a.submitted}</div>
              </div>
              <span style={{ fontSize: 11, background: sc.bg, color: sc.text, borderRadius: 20, padding: "3px 10px", fontWeight: 600, whiteSpace: "nowrap" }}>
                {sc.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Article List View ── */
function ArticleListView({ articles, onSelectArticle }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? articles : articles.filter(a => a.status === filter);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Review Articles</h1>
        <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Artikel yang perlu direview dan dipublikasikan</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { id: "all",       label: "Semua" },
          { id: "pending",   label: "Pending" },
          { id: "revision",  label: "Revisi" },
          { id: "published", label: "Published" },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: "7px 16px", borderRadius: 20,
              border: filter === f.id ? "none" : "1px solid #E5E7EB",
              background: filter === f.id ? "#1B3A2A" : "#fff",
              color: filter === f.id ? "#fff" : "#374151",
              fontSize: 13, cursor: "pointer", fontFamily: "sans-serif",
              fontWeight: filter === f.id ? 600 : 400,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "40px 24px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
            Tidak ada artikel dengan status ini.
          </div>
        )}
        {filtered.map(article => {
          const sc = STATUS_COLORS[article.status] || STATUS_COLORS.pending;
          const cc = CATEGORY_COLORS[article.category] || { bg: "#F3F4F6", text: "#374151" };
          return (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "18px 20px", cursor: "pointer", transition: "box-shadow 0.15s, border-color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#1B3A2A"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(27,58,42,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#E8F4EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#1B3A2A", flexShrink: 0 }}>
                  {article.author.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, background: cc.bg, color: cc.text, borderRadius: 4, padding: "2px 8px", fontWeight: 700, letterSpacing: "0.05em" }}>{article.category}</span>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>· Submitted {article.submitted}</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 6px", lineHeight: 1.4 }}>{article.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "#6B7280" }}>
                    <span>by {article.author} · {article.role}</span>
                    <span>{article.wordCount.toLocaleString()} words</span>
                  </div>
                </div>
                <span style={{ fontSize: 12, background: sc.bg, color: sc.text, borderRadius: 20, padding: "4px 12px", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {sc.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Article Review View ── */
function ArticleReviewView({ article, onBack, onAction }) {
  const [feedback, setFeedback]     = useState(article.feedback || "");
  const [checklist, setChecklist]   = useState({ ...article.checklist });
  const [actionDone, setActionDone] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  const cc = CATEGORY_COLORS[article.category] || { bg: "#F3F4F6", text: "#374151" };

  const confirmAction = () => {
    setActionDone(showConfirm);
    setShowConfirm(null);
    onAction(article.id, showConfirm === "publish" ? "published" : showConfirm, feedback);
  };

  /* Success state */
  if (actionDone) {
    const isPublish = actionDone === "publish";
    return (
      <div style={{ fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: isPublish ? "#E8F5E9" : "#FBE9E7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          {isPublish
            ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BF360C" strokeWidth="2.5"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
          }
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
          {isPublish ? "Artikel Dipublikasikan!" : "Artikel Dikembalikan ke Penulis"}
        </h2>
        <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px", maxWidth: 360 }}>
          {isPublish
            ? "Artikel telah berhasil dipublikasikan dan dapat dilihat oleh pengunjung."
            : "Notifikasi revisi telah dikirim ke penulis beserta feedback Anda."}
        </p>
        <button onClick={onBack} style={{ padding: "10px 24px", background: "#1B3A2A", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif" }}>
          Kembali ke Daftar Artikel
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {/* Confirm Modal */}
      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "28px 32px", width: 380, textAlign: "center" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 10 }}>
              {showConfirm === "publish" ? "Publikasikan Artikel?" : "Kembalikan untuk Revisi?"}
            </h3>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>
              {showConfirm === "publish"
                ? "Artikel akan langsung ditampilkan di website Edupark."
                : "Penulis akan menerima notifikasi beserta feedback Anda."}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setShowConfirm(null)} style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 14, cursor: "pointer", fontWeight: 600, fontFamily: "sans-serif" }}>
                Batal
              </button>
              <button
                onClick={confirmAction}
                style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: showConfirm === "publish" ? "#2E7D32" : "#BF360C", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600, fontFamily: "sans-serif" }}
              >
                {showConfirm === "publish" ? "Ya, Publikasikan" : "Ya, Kembalikan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 13, color: "#6B7280" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, padding: 0 }}>Review Articles</button>
        <span>›</span>
        <span style={{ color: "#111827", fontWeight: 500 }}>Review Article</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Article Content */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 11, background: cc.bg, color: cc.text, borderRadius: 4, padding: "3px 10px", fontWeight: 700, letterSpacing: "0.05em" }}>{article.category}</span>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>· Submitted {article.submitted}</span>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", lineHeight: 1.3, marginBottom: 20, fontFamily: "Georgia, serif" }}>
            {article.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 20, borderBottom: "1px solid #F3F4F6", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E8F4EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#1B3A2A" }}>
                {article.author.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{article.author}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{article.role}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Word Count</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{article.wordCount.toLocaleString()} words</div>
            </div>
          </div>

          {/* Article image if available */}
          {article.image && (
            <img src={article.image} alt={article.title} style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 10, marginBottom: 20 }} />
          )}

          {/* Content: HTML string or content blocks */}
          <div style={{ lineHeight: 1.8, color: "#374151" }}>
            {article.content && typeof article.content === "string" ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : Array.isArray(article.content) ? (
              article.content.map((block, i) =>
                block.type === "heading"
                  ? <h2 key={i} style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: "24px 0 10px", fontFamily: "Georgia, serif" }}>{block.text}</h2>
                  : <p key={i} style={{ fontSize: 15, margin: "0 0 16px", color: "#4B5563" }}>{block.text}</p>
              )
            ) : (
              <p style={{ color: "#9CA3AF" }}>Tidak ada konten artikel.</p>
            )}
          </div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 20 }}>
              {article.tags.map(t => (
                <span key={t} style={{ fontSize: 11, background: "#E8F4EE", color: "#1B3A2A", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>#{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Editor Feedback */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A2A" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
              </svg>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Editor's Feedback</span>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 10px" }}>Notes will be sent to the writer along with the revision request.</p>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Add your comments here..."
              style={{ width: "100%", minHeight: 100, padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 13, color: "#374151", resize: "vertical", outline: "none", fontFamily: "sans-serif", boxSizing: "border-box", lineHeight: 1.6 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
              <span>AUTO-SAVED</span>
              <span>{feedback.length} CHARACTERS</span>
            </div>
          </div>

          {/* Submission Checklist */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Submission Checklist</h3>
            {[
              { key: "plagiarism",       label: "Plagiarism check passed" },
              { key: "styleGuide",       label: "Style guide compliance" },
              { key: "imageAttribution", label: "Image attribution verified" },
              { key: "seoKeywords",      label: "SEO Keywords optimized" },
            ].map(item => (
              <label key={item.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                <div
                  onClick={() => setChecklist(p => ({ ...p, [item.key]: !p[item.key] }))}
                  style={{ width: 18, height: 18, borderRadius: 4, border: checklist[item.key] ? "none" : "2px solid #D1D5DB", background: checklist[item.key] ? "#2E7D32" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
                >
                  {checklist[item.key] && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </div>
                <span style={{ fontSize: 13, color: "#374151" }}>{item.label}</span>
              </label>
            ))}
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => setShowConfirm("revision")}
            style={{ width: "100%", padding: "12px", background: "#E65100", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "sans-serif" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
            Send Back for Revision
          </button>

          <button
            onClick={() => setShowConfirm("publish")}
            style={{ width: "100%", padding: "12px", background: "#2E7D32", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "sans-serif" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="22 2 11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Publish Article
          </button>

          <button
            onClick={() => onAction(article.id, "draft", feedback)}
            style={{ width: "100%", padding: "11px", background: "#fff", color: "#374151", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif" }}
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN EXPORT — EditorPortal
   Tidak ada login. Langsung tampil halaman utama.
   Terima props dari App.jsx (opsional):
     externalArticles  — artikel dari writer
     onUpdateStatus    — callback update status
   ═══════════════════════════════════════════ */
export default function EditorPortal({ externalArticles = [], onUpdateStatus }) {
  const [activeNav, setActiveNav]         = useState("review");
  const [selectedArticle, setSelectedArticle] = useState(null);

  /* Gabungkan artikel seed dengan artikel dari writer (external) */
  const [localArticles, setLocalArticles] = useState(ARTICLES);
  const allArticles = [
    ...externalArticles,
    ...localArticles.filter(a => !externalArticles.find(e => e.id === a.id)),
  ];

  const handleAction = (articleId, actionType, feedback) => {
    /* Update di external state (App.jsx) jika ada */
    if (onUpdateStatus) {
      onUpdateStatus(articleId, actionType, feedback);
    }

    /* Update di local state juga untuk artikel seed */
    setLocalArticles(prev =>
      prev.map(a =>
        a.id === articleId
          ? { ...a, status: actionType, feedback }
          : a
      )
    );

    setSelectedArticle(null);
  };

  const handleSetActiveNav = (nav) => {
    setActiveNav(nav);
    setSelectedArticle(null);
  };

  const pendingCount = allArticles.filter(a => a.status === "pending").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F7F5" }}>
      <Sidebar activeNav={activeNav} setActiveNav={handleSetActiveNav} />

      <main style={{ marginLeft: 200, flex: 1, padding: "28px 32px", minHeight: "100vh" }}>
        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, fontFamily: "sans-serif" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280" }}>
            {selectedArticle && activeNav === "review" ? (
              <>
                <span>Review Articles</span>
                <span>›</span>
                <span style={{ color: "#111827", fontWeight: 500 }}>Review Article</span>
              </>
            ) : (
              <span style={{ color: "#111827", fontWeight: 500, textTransform: "capitalize" }}>
                {activeNav === "review" ? "Review Articles" : activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Bell with badge */}
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => handleSetActiveNav("review")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {pendingCount > 0 && (
                <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, background: "#E65100", borderRadius: "50%", fontSize: 9, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  {pendingCount > 9 ? "9+" : pendingCount}
                </div>
              )}
            </div>
            <button style={{ fontSize: 13, color: "#374151", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
              Guidelines
            </button>
          </div>
        </div>

        {/* Views */}
        {activeNav === "dashboard" && (
          <DashboardView articles={allArticles} setActiveNav={handleSetActiveNav} />
        )}

        {activeNav === "review" && !selectedArticle && (
          <ArticleListView articles={allArticles} onSelectArticle={setSelectedArticle} />
        )}

        {activeNav === "review" && selectedArticle && (
          <ArticleReviewView
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
            onAction={handleAction}
          />
        )}

        {activeNav === "writers" && (
          <div style={{ fontFamily: "sans-serif" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Writer Directory</h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>Daftar semua penulis yang terdaftar di platform Edupark</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[...new Map(allArticles.map(a => [a.author, { name: a.author, role: a.role || "Writer", count: allArticles.filter(x => x.author === a.author).length }])).values()].map(w => (
                <div key={w.name} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 18px", textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E8F4EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#1B3A2A", margin: "0 auto 12px" }}>
                    {w.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{w.name}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>{w.role}</div>
                  <div style={{ fontSize: 12, background: "#E8F4EE", color: "#1B3A2A", borderRadius: 20, padding: "3px 12px", display: "inline-block", fontWeight: 600 }}>
                    {w.count} artikel
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNav === "performance" && (
          <div style={{ fontFamily: "sans-serif" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Performance</h1>
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24, textAlign: "center", color: "#9CA3AF" }}>
              <p>Fitur laporan performa akan segera tersedia.</p>
            </div>
          </div>
        )}

        {activeNav === "settings" && (
          <div style={{ fontFamily: "sans-serif" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>Settings</h1>
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24, color: "#9CA3AF", textAlign: "center" }}>
              <p>Pengaturan akun editor akan tersedia segera.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}