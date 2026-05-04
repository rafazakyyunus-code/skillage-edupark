import { useState, useEffect } from "react";
import "./createArticle.css";
import {
  LayoutDashboard,
  PenSquare,
  FileText,
  BarChart3,
  ImagePlus,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
} from "lucide-react";

export default function CreateArticle() {
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState(["FutureOfEd", "AI"]);
  const [inputTag, setInputTag] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [lastSaved, setLastSaved] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  /* ================= LOAD ================= */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("draft")) || {};

    if (saved.image) setImage(saved.image);
    if (saved.tags) setTags(saved.tags);
    if (saved.title) setTitle(saved.title);
    if (saved.content) setContent(saved.content);
    if (saved.visibility) setVisibility(saved.visibility);
  }, []);

  /* ================= IMAGE ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ================= TAG ================= */
  const addTag = () => {
    const trimmed = inputTag.trim();
    if (!trimmed || tags.includes(trimmed)) return;

    setTags([...tags, trimmed]);
    setInputTag("");
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  /* ================= SAVE ================= */
  const handleSaveDraft = () => {
    const now = new Date();
    setLastSaved(now);

    localStorage.setItem(
      "draft",
      JSON.stringify({
        title,
        content,
        tags,
        visibility,
        image,
      })
    );
  };

  const formatTime = (date) => {
    if (!date) return "Not saved yet";
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="ca-root">

      {/* SIDEBAR */}
      <aside className="ca-sidebar">
        <div className="ca-top">
          <div className="ca-logo">Edupark</div>

          <nav className="ca-menu">
            <div className="ca-menu-item">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>

            <div className="ca-menu-item active">
              <PenSquare size={18} />
              <span>Create Article</span>
            </div>

            <div className="ca-menu-item">
              <FileText size={18} />
              <span>My Articles</span>
            </div>

            <div className="ca-menu-item">
              <BarChart3 size={18} />
              <span>Analytics</span>
            </div>
          </nav>
        </div>

        <div className="ca-bottom">
          <div className="ca-user">
            <div className="avatar">A</div>
            <div>
              <p>Alex Thompson</p>
              <span>Senior Editor</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ca-main">

        {/* HEADER */}
        <div className="ca-header">
          <div>
            <h2>Dashboard › Create Article</h2>
            <p className="save-status">
              Last saved: {formatTime(lastSaved)}
            </p>
          </div>

          <div className="ca-actions">
            <button type="button" className="btn-draft" onClick={handleSaveDraft}>
              Save Draft
            </button>
            <button type="button" className="btn-submit">
              Submit for Review 
            </button>
          </div>
        </div>

        <div className="ca-content">

          {/* LEFT */}
          <div className="ca-left">
            <input
              className="ca-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your catchy title..."
            />

            <div className="ca-editor">
              <div className="toolbar">
                <button type="button"><b>B</b></button>
                <button type="button"><i>I</i></button>
                <button type="button"><u>U</u></button>
                <button type="button"><List size={16} /></button>
                <button type="button"><ListOrdered size={16} /></button>
                <button type="button"><Quote size={16} /></button>
                <button type="button"><Link size={16} /></button>
                <button type="button"><Code size={16} /></button>
                <button type="button"><ImagePlus size={16} /></button>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your masterpiece..."
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="ca-right">

            {/* IMAGE */}
            <div className="box">
              <h4>Featured Image</h4>

              <label className="upload-box">
                {image ? (
                  <img src={image} alt="preview" />
                ) : (
                  <>
                    <ImagePlus size={28} />
                    <p>Click to upload</p>
                    <span>PNG, JPG or WEBP (Max 2MB)</span>
                  </>
                )}
                <input type="file" hidden onChange={handleImage} />
              </label>
            </div>

            {/* CATEGORY */}
            <div className="box">
              <h4>Category</h4>
              <select>
                <option>Education Technology</option>
                <option>AI</option>
                <option>Business</option>
              </select>
            </div>

            {/* TAG */}
            <div className="box">
              <h4>Tags</h4>

              <div className="tags">
                {tags.map((t, i) => (
                  <div key={i} className="tag">
                    <span>{t}</span>
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeTag(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <input
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onKeyDown={handleTagEnter}
                placeholder="Add a tag..."
              />
            </div>

            {/* VISIBILITY */}
            <div className="box visibility">
              <h4>Visibility</h4>

              <div className="radio-group">
                <label className="radio-item">
                  <input
                    type="radio"
                    checked={visibility === "public"}
                    onChange={() => setVisibility("public")}
                  />
                  <span>Public</span>
                </label>

                <label className="radio-item">
                  <input
                    type="radio"
                    checked={visibility === "private"}
                    onChange={() => setVisibility("private")}
                  />
                  <span>Members Only</span>
                </label>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}