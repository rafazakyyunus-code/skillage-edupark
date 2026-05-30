import { useState, useEffect } from "react";
import "./CreateArticle.css";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import ImageExtension from "@tiptap/extension-image";

import { db } from "../../firebase";
import { ref, onValue, remove, set, update, push } from "firebase/database";
import { getAuth, signOut, onAuthStateChanged, updateProfile, updateEmail } from "firebase/auth";

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
   SIDEBAR — identik dengan Editor.jsx
   ────────────────────────────────────────── */
function Sidebar({ activeNav, setActiveNav, currentUser, myArticles, displayName }) {
  const resolvedName = displayName || currentUser?.displayName || "";
  const initials = resolvedName
    ? resolvedName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "AT";

  const navBtnStyle = (active) => ({
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
  });

  const pending  = myArticles ? myArticles.filter(a => a.status === "pending").length : 0;
  const revision = myArticles ? myArticles.filter(a => a.status === "revision").length : 0;

  return (
    <aside style={{
      width: 220, background: "linear-gradient(180deg, #1a3828 0%, #0f2318 100%)",
      height: "100vh", position: "fixed", left: 0, top: 0,
      display: "flex", flexDirection: "column", zIndex: 100,
      boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
    }}>

      {/* Brand */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ background: "linear-gradient(135deg, #2d6a4f, #16c35b)", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 10px rgba(22,195,91,0.3)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 800, color: "#fff", fontSize: 15, fontFamily: "Georgia, serif", lineHeight: 1.2, letterSpacing: "-0.01em" }}>Edupark</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 1 }}>Writer Portal</div>
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: "14px 18px 6px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Menu</div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 10px", overflowY: "auto" }}>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activeNav === id;
          const isRevisionBadge = id === "my-articles" && revision > 0;
          const badge = id === "my-articles"
            ? (revision > 0 ? revision : (myArticles?.length || 0))
            : null;
          return (
            <button key={id}
              onClick={() => setActiveNav(id)}
              style={navBtnStyle(active)}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}}>
              {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, borderRadius: 2, background: "#16c35b" }} />}
              <Icon size={16} color={active ? "#fff" : "rgba(255,255,255,0.5)"} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: isRevisionBadge ? "#BF360C" : "rgba(22,195,91,0.3)",
                  color: isRevisionBadge ? "#fff" : "#16c35b",
                  borderRadius: 10, padding: "1px 6px", minWidth: 18, textAlign: "center"
                }}>{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div style={{ padding: "6px 10px 4px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button
          onClick={() => setActiveNav("settings")}
          style={navBtnStyle(activeNav === "settings")}
          onMouseEnter={e => { if (activeNav !== "settings") { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}}
          onMouseLeave={e => { if (activeNav !== "settings") { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}}>
          {activeNav === "settings" && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, borderRadius: 2, background: "#16c35b" }} />}
          <Settings size={16} color={activeNav === "settings" ? "#fff" : "rgba(255,255,255,0.5)"} />
          <span style={{ flex: 1 }}>Settings</span>
        </button>
      </div>

      {/* User */}
      <div style={{ padding: "12px 16px 14px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #2d6a4f, #16c35b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow: "0 2px 8px rgba(22,195,91,0.3)" }}>
            {initials}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{resolvedName || "Writer"}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Writer Portal</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────
   TOPBAR — identik dengan Editor.jsx
   ────────────────────────────────────────── */
function Topbar({ activeNav }) {
  const breadcrumb = {
    dashboard:     "Dashboard",
    create:        "Create Article",
    "my-articles": "My Articles",
    analytics:     "Analytics",
    settings:      "Settings",
  }[activeNav] || activeNav;

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: 56,
      background: "#fff", borderBottom: "1px solid #E5E7EB",
      position: "sticky", top: 0, zIndex: 50,
      boxSizing: "border-box", width: "100%", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280" }}>
        <span>Dashboard</span>
        {activeNav !== "dashboard" && (
          <>
            <span style={{ color: "#D1D5DB" }}>›</span>
            <span style={{ color: "#111827", fontWeight: 600 }}>{breadcrumb}</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   DASHBOARD VIEW — Editor-style with section previews
   ────────────────────────────────────────── */
function DashboardView({ myArticles, setActiveNav }) {
  const published    = myArticles.filter(a => a.status === "published").length;
  const pending      = myArticles.filter(a => a.status === "pending").length;
  const revision     = myArticles.filter(a => a.status === "revision").length;
  const totalViews   = myArticles.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalWords   = myArticles.reduce((sum, a) => sum + (a.wordCount || 0), 0);
  const avgReadTime  = totalWords > 0 ? (totalWords / 200).toFixed(1) : "0";

  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const viewsByMonth = Array(12).fill(0);
  myArticles.forEach(a => {
    if (!a.date) return;
    const d = new Date(a.date);
    if (!isNaN(d)) viewsByMonth[d.getMonth()] += (a.views || 0);
  });
  const maxVal = Math.max(...viewsByMonth, 1);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 11 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : hour < 18 ? "Selamat Sore" : "Selamat Malam";

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>{greeting}, Penulis</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>Dashboard Overview</h1>
          <p style={{ color: "#9CA3AF", fontSize: 13, margin: "4px 0 0" }}>
            {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · Data realtime dari Firebase
          </p>
        </div>
        <button
          onClick={() => setActiveNav("create")}
          style={{ padding: "10px 20px", background: "#1b3a2a", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, flexShrink: 0, whiteSpace: "nowrap" }}
        >
          <PenSquare size={15} color="#fff" /> + Tulis Artikel Baru
        </button>
      </div>

      {/* ── Banner Revisi ── */}
      {revision > 0 && (
        <div onClick={() => setActiveNav("my-articles")} style={{
          background: "#FBE9E7", border: "1px solid #FFCCBC", borderRadius: 10,
          padding: "12px 18px", marginBottom: 18, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 12,
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(191,54,12,0.15)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
        >
          <span style={{ fontSize: 22, flexShrink: 0 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#BF360C", fontSize: 14 }}>
              {revision} artikel membutuhkan revisi!
            </div>
            <div style={{ fontSize: 12, color: "#5D4037", marginTop: 2 }}>
              Editor telah mengirimkan catatan perbaikan. Klik untuk melihat dan memperbaiki.
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#BF360C", flexShrink: 0 }}>Lihat →</span>
        </div>
      )}

      {/* ── ROW 1: 4 stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14, marginBottom: 18 }}>
        {[
          { label: "Total Artikel",  val: myArticles.length,          bg: "#F0FDF4", border: "#BBF7D0", valColor: "#1b3a2a", sub: "total artikel ditulis",  icon: <FileText size={18} color="#1b3a2a" /> },
          { label: "Published",      val: published,                   bg: "#F0FDF4", border: "#BBF7D0", valColor: "#16a34a", sub: "artikel tayang",         icon: <CheckCircle size={18} color="#16a34a" /> },
          { label: "Pending Review", val: pending,                     bg: "#FFFBEB", border: "#FDE68A", valColor: "#D97706", sub: "menunggu review",         icon: <BookOpen size={18} color="#D97706" /> },
          { label: "Total Views",    val: totalViews.toLocaleString(), bg: "#EFF6FF", border: "#BFDBFE", valColor: "#2563EB", sub: "total pembaca",           icon: <Eye size={18} color="#2563EB" /> },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 18px 14px", position: "relative", overflow: "hidden", minWidth: 0 }}>
            <div style={{ position: "absolute", right: 14, top: 14, opacity: 0.5 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: s.valColor, lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── ROW 2: 3 section shortcut cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14, marginBottom: 18 }}>
        {[
          { id: "create",       label: "Create Article", val: revision > 0 ? revision : "Baru", sub: revision > 0 ? `${revision} artikel perlu direvisi` : "Tulis artikel baru sekarang", valColor: "#7C3AED", bg: "#FAF5FF", border: "#DDD6FE", icon: <PenSquare size={20} color="#7C3AED" />, cta: "Mulai Menulis →" },
          { id: "my-articles",  label: "My Articles",    val: myArticles.length,                  sub: `${published} published · ${pending} pending`,                                       valColor: "#0E7490", bg: "#ECFEFF", border: "#A5F3FC", icon: <FileText size={20} color="#0E7490" />, cta: "Lihat Semua →" },
          { id: "analytics",    label: "Analytics",      val: `${avgReadTime}m`,                  sub: `Est. avg. read time · ${totalViews.toLocaleString()} views`,                        valColor: "#BE185D", bg: "#FDF2F8", border: "#FBCFE8", icon: <BarChart3 size={20} color="#BE185D" />, cta: "Lihat Analytics →" },
        ].map(s => (
          <div key={s.id} onClick={() => setActiveNav(s.id)}
            style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 18px 14px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "box-shadow 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.07)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ position: "absolute", right: 14, top: 14, opacity: 0.45 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: s.valColor, lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.sub}</div>
            <div style={{ position: "absolute", bottom: 12, right: 14, fontSize: 11, color: s.valColor, fontWeight: 600, opacity: 0.7 }}>{s.cta}</div>
          </div>
        ))}
      </div>

      {/* ── ROW 3: Artikel terbaru + Tips Menulis ── */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(220px, 280px)", gap: 16, marginBottom: 16 }}>

        {/* My Articles preview */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Artikel Terbaru</h2>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>Artikel yang baru saja kamu tulis</p>
            </div>
            <button onClick={() => setActiveNav("my-articles")} style={{ fontSize: 12, color: "#1B3A2A", background: "#E8F4EE", border: "none", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontWeight: 600 }}>Lihat semua →</button>
          </div>
          {myArticles.length === 0 ? (
            <div style={{ padding: "28px 0", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><FileText size={32} color="#D1D5DB" /></div>
              <p style={{ color: "#9CA3AF", fontSize: 13, margin: "0 0 14px" }}>Belum ada artikel. Mulai tulis sekarang!</p>
              <button onClick={() => setActiveNav("create")} style={{ padding: "8px 18px", background: "#1b3a2a", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Tulis Artikel</button>
            </div>
          ) : (
            myArticles.slice(0, 5).map((a, i) => {
              const s = STATUS_MAP[a.status] || STATUS_MAP.draft;
              return (
                <div key={a.id}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < Math.min(myArticles.length, 5) - 1 ? "1px solid #F9FAFB" : "none", cursor: "pointer" }}
                  onClick={() => setActiveNav("my-articles")}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 42, height: 42, borderRadius: 9, overflow: "hidden", flexShrink: 0, background: "#E8F4EE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {a.image ? <img src={a.image} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <FileText size={18} color="#9CA3AF" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "#111827", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{a.category} · {a.date}</div>
                  </div>
                  <span style={{ fontSize: 11, background: s.bg, color: s.text, borderRadius: 20, padding: "3px 10px", fontWeight: 600, flexShrink: 0 }}>{s.label}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Tips Menulis */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Tips Menulis</h2>
          {[
            "Gunakan judul yang menarik dan informatif",
            "Sertakan gambar berkualitas tinggi",
            "Tambahkan tag yang relevan untuk SEO",
            "Review sebelum submit untuk menghindari revisi",
            "Artikel 800–1500 kata lebih sering dibaca",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 13, color: "#374151", alignItems: "flex-start" }}>
              <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
              {tip}
            </div>
          ))}
          <button onClick={() => setActiveNav("create")}
            style={{ width: "100%", marginTop: 14, padding: "10px", background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            + Tulis Artikel Baru
          </button>
        </div>
      </div>

      {/* ── ROW 4: Analytics preview ── */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Performa Artikel</h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>Views per bulan dari semua artikel kamu</p>
          </div>
          <button onClick={() => setActiveNav("analytics")} style={{ fontSize: 12, color: "#1B3A2A", background: "#E8F4EE", border: "none", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontWeight: 600 }}>Lihat Analytics →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Mini bar chart */}
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, marginBottom: 6 }}>
              {viewsByMonth.map((val, i) => (
                <div key={monthLabels[i]} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                  <div
                    style={{ width: "100%", borderRadius: "4px 4px 0 0", background: val > 0 ? "#1b3a2a" : "#e5e7eb", height: `${(val / maxVal) * 88}%`, minHeight: val > 0 ? 4 : 0, transition: "background 0.2s", cursor: "pointer" }}
                    title={`${monthLabels[i]}: ${val} views`}
                    onMouseEnter={e => { e.currentTarget.style.background = val > 0 ? "#16c35b" : "#d1d5db"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = val > 0 ? "#1b3a2a" : "#e5e7eb"; }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {monthLabels.map(m => <div key={m} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#9CA3AF" }}>{m}</div>)}
            </div>
          </div>
          {/* Mini stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Total Views",   value: totalViews.toLocaleString(), color: "#2563EB", bg: "#EFF6FF" },
              { label: "Published",     value: published,                   color: "#16a34a", bg: "#F0FDF4" },
              { label: "Avg Read Time", value: `${avgReadTime}m`,           color: "#D97706", bg: "#FFFBEB" },
              { label: "In Revision",   value: revision,                    color: "#EA580C", bg: "#FFF7ED" },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   CREATE / EDIT ARTICLE VIEW
   Mendukung mode "edit" untuk artikel revision
   ────────────────────────────────────────── */
function CreateArticleView({ onSubmitSuccess, onSaveDraft, onRefresh, editArticle, onCancelEdit, currentUser }) {
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
        title:       title.trim(),
        category,
        content:     editor?.getHTML() || "",
        status:      "draft",
        author:      currentUser?.displayName || currentUser?.email || "Penulis",
        authorUid:   currentUser?.uid || "",
        authorEmail: currentUser?.email || "",
        wordCount:   editor ? editor.getText().split(/\s+/).filter(Boolean).length : 0,
        date:        new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        image:       image || "",
        tags,
        visibility,
        views:       0,
        feedback:    "",
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

    if (!currentUser?.uid) {
      alert("Sesi login tidak ditemukan. Silakan refresh halaman.");
      return;
    }

    const articleContent = editor ? editor.getHTML() : "";
    const articleData = {
      title:       title.trim(),
      category,
      content:     articleContent,
      status:      "pending",
      author:      isEditMode ? editArticle.author : (currentUser.displayName || currentUser.email || "Penulis"),
      authorUid:   isEditMode ? editArticle.authorUid : currentUser.uid,
      authorEmail: isEditMode ? (editArticle.authorEmail || "") : (currentUser.email || ""),
      wordCount:   editor ? editor.getText().split(/\s+/).filter(Boolean).length : 0,
      date:        new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      image:       image || "",
      tags,
      visibility,
      views:       isEditMode ? (editArticle.views || 0) : 0,
      feedback:    "",
    };

    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode && editArticle.id) {
        // UPDATE artikel yang sudah ada (mode revisi/draft)
        await update(ref(db, `articles/${editArticle.id}`), articleData);
      } else {
        // CREATE artikel baru — langsung push ke Firebase (bukan lewat parent)
        const newRef = push(ref(db, "articles"));
        await set(newRef, { ...articleData, id: newRef.key });
      }

      localStorage.removeItem("edupark_draft");
      setSubmitted(true);
      // Beritahu parent hanya untuk navigasi (bukan untuk write lagi)
      if (onSubmitSuccess) onSubmitSuccess(articleData);
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

      {/* ── Banner Revisi ── */}
      {articles.filter(a => a.status === "revision").length > 0 && (
        <div style={{
          background: "#FBE9E7", border: "1px solid #FFCCBC", borderRadius: 10,
          padding: "14px 18px", marginBottom: 18,
        }}>
          <div style={{ fontWeight: 700, color: "#BF360C", fontSize: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span>⚠️</span> {articles.filter(a => a.status === "revision").length} artikel perlu diperbaiki
          </div>
          {articles.filter(a => a.status === "revision").map(a => (
            <div key={a.id} style={{
              background: "#fff", border: "1px solid #FFCCBC", borderRadius: 8,
              padding: "10px 14px", marginBottom: 8,
              display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
            }}>
              <div>
                <div style={{ fontWeight: 600, color: "#111827", fontSize: 13, marginBottom: 4 }}>"{a.title}"</div>
                {a.feedback
                  ? <div style={{ fontSize: 12, color: "#5D4037", fontStyle: "italic" }}>Catatan editor: {a.feedback}</div>
                  : <div style={{ fontSize: 12, color: "#9CA3AF" }}>Belum ada catatan dari editor.</div>
                }
              </div>
              <button
                onClick={() => onEditArticle(a)}
                style={{ flexShrink: 0, fontSize: 12, fontWeight: 600, color: "#fff", background: "#BF360C", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}
              >Perbaiki →</button>
            </div>
          ))}
        </div>
      )}

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
function SettingsView({ currentUser, onNameChange }) {
  const auth = getAuth();

  const [name,   setName]   = useState("");
  const [email,  setEmail]  = useState(currentUser?.email || "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  // Baca nama dari Realtime DB — sumber kebenaran utama
  // Firebase Auth displayName tidak reliable setelah re-login
  useEffect(() => {
    if (!currentUser?.uid) return;
    const userRef = ref(db, `users/${currentUser.uid}`);
    const unsub = onValue(userRef, (snap) => {
      const data = snap.val();
      if (data?.displayName) setName(data.displayName);
      else if (currentUser?.displayName) setName(currentUser.displayName);
      if (data?.email) setEmail(data.email);
      else if (currentUser?.email) setEmail(currentUser.email);
    });
    return () => unsub();
  }, [currentUser?.uid]);

  const handleSave = async () => {
    if (!name.trim()) { setErrMsg("Nama tidak boleh kosong."); setStatus("error"); return; }
    if (!email.trim()) { setErrMsg("Email tidak boleh kosong."); setStatus("error"); return; }
    setSaving(true);
    setStatus(null);
    setErrMsg("");
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error("Sesi tidak ditemukan, silakan login ulang.");

      if (firebaseUser.displayName !== name.trim()) {
        await updateProfile(firebaseUser, { displayName: name.trim() });
      }
      if (firebaseUser.email !== email.trim()) {
        await updateEmail(firebaseUser, email.trim());
      }
      if (firebaseUser.uid) {
        const userUpdates = {};
        if (name.trim())  userUpdates.displayName = name.trim();
        if (email.trim()) userUpdates.email = email.trim();
        await update(ref(db, `users/${firebaseUser.uid}`), userUpdates);
      }
      // Update sidebar langsung
      if (onNameChange) onNameChange(name.trim());
      setStatus("success");
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error("Settings save error:", err);
      if (err.code === "auth/requires-recent-login") {
        setErrMsg("Untuk mengubah email, silakan logout lalu login kembali.");
      } else if (err.code === "auth/email-already-in-use") {
        setErrMsg("Email sudah digunakan akun lain.");
      } else if (err.code === "auth/invalid-email") {
        setErrMsg("Format email tidak valid.");
      } else {
        setErrMsg(err.message || "Gagal menyimpan perubahan.");
      }
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try { await signOut(auth); }
    catch (err) { console.error("Logout error:", err); alert("Gagal logout: " + err.message); }
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1px solid #D1D5DB", fontSize: 14, boxSizing: "border-box",
    fontFamily: "inherit", outline: "none",
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
          <input
            className="ca-form-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nama lengkap Anda"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#1B3A2A"}
            onBlur={e => e.target.style.borderColor = "#D1D5DB"}
          />
        </div>
        <div className="ca-form-row">
          <label className="ca-form-label">Email</label>
          <input
            className="ca-form-input"
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
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          className="ca-settings-save-btn"
          onClick={handleSave}
          disabled={saving}
          style={{ opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        {status === "success" && (
          <span style={{ fontSize: 13, color: "#16a34a", display: "flex", alignItems: "center", gap: 5 }}>
            <CheckCircle size={14} /> Perubahan berhasil disimpan!
          </span>
        )}
        {status === "error" && (
          <span style={{ fontSize: 13, color: "#dc2626" }}>✗ {errMsg}</span>
        )}
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
export default function CreateArticle({ onExternalSubmit, currentUser: currentUserProp }) {
  const [activeNav, setActiveNav]     = useState("dashboard");
  const [myArticles, setMyArticles]   = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);

  // Ambil currentUser dari Firebase Auth secara langsung
  // agar tidak bergantung penuh pada prop (antisipasi prop tidak di-pass dari router)
  const [authUser, setAuthUser] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    // Gunakan prop dulu kalau sudah ada uid-nya, kalau tidak listen dari Auth
    if (currentUserProp?.uid) {
      setAuthUser(currentUserProp);
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setAuthUser(user);
    });
    return () => unsub();
  }, [currentUserProp]);

  // currentUser yang dipakai di seluruh komponen
  const currentUser = authUser;

  // profileName — baca dari Realtime DB (sumber kebenaran), bukan dari Auth displayName
  const [profileName, setProfileName] = useState("");
  useEffect(() => {
    if (!currentUser?.uid) return;
    const userRef = ref(db, `users/${currentUser.uid}`);
    const unsub = onValue(userRef, (snap) => {
      const data = snap.val();
      if (data?.displayName) {
        setProfileName(data.displayName);
      } else if (currentUser?.displayName) {
        setProfileName(currentUser.displayName);
      }
    });
    return () => unsub();
  }, [currentUser?.uid]);

  // Auto-create / sync user entry di /users agar muncul di Writer Directory
  useEffect(() => {
    if (!currentUser?.uid) return;
    const userRef = ref(db, `users/${currentUser.uid}`);
    onValue(userRef, snap => {
      const existing = snap.val();
      const updates = {};
      if (!existing) {
        // Buat entry baru — gunakan Auth displayName hanya jika DB belum ada
        set(userRef, {
          displayName: currentUser.displayName || "Writer",
          email: currentUser.email || "",
          role: "writer",
          createdAt: Date.now(),
        });
        return;
      }
      // ⚠️ JANGAN overwrite displayName di DB dengan nilai dari Firebase Auth.
      // DB adalah sumber kebenaran — user bisa ganti nama lewat Settings,
      // dan Firebase Auth displayName tidak reliable setelah re-login.
      // Hanya sync email jika berubah.
      if (currentUser.email && existing.email !== currentUser.email)
        updates.email = currentUser.email;
      if (Object.keys(updates).length > 0)
        update(userRef, updates);
    }, { onlyOnce: true });
  }, [currentUser?.uid]);

  // Sync data artikel dari Firebase Realtime — filter hanya milik user ini
  useEffect(() => {
    if (!currentUser?.uid) return;
    const uid   = currentUser.uid;
    const name  = currentUser.displayName;
    const email = currentUser.email;

    const articlesRef = ref(db, "articles");
    const unsubscribe = onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        const mine = list.filter(a =>
          a.authorUid === uid ||
          (a.authorEmail && email && a.authorEmail === email) ||
          (!a.authorUid && !a.authorEmail && name && a.author === name)
        );
        setMyArticles(mine);
      } else {
        setMyArticles([]);
      }
    });
    return () => unsubscribe();
  }, [currentUser?.uid]);

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

  const handleSubmitSuccess = (_articleData) => {
    // Artikel sudah disimpan langsung di CreateArticleView — cukup navigasi
    setActiveNav("my-articles");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7f5", fontFamily: "sans-serif" }}>
      <Sidebar activeNav={activeNav} setActiveNav={handleSetActiveNav} currentUser={currentUser} myArticles={myArticles} displayName={profileName} />

      <div style={{ flex: 1, marginLeft: 220, display: "flex", flexDirection: "column", height: "100vh", minWidth: 0, overflowX: "hidden" }}>
        <Topbar activeNav={activeNav} />

        <div style={{ flex: 1, padding: "32px 40px", boxSizing: "border-box", width: "100%", overflowX: "hidden", overflowY: "auto" }}>
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
              currentUser={currentUser}
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
            <SettingsView currentUser={currentUser} onNameChange={setProfileName} />
          )}
        </div>
      </div>
    </div>
  );
}