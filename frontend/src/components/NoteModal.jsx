import { useEffect, useRef, useState } from "react";
import axios from "axios";

const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export default function NoteModal({ isOpen, onClose, note, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const editor = useRef(null);

  useEffect(() => {
    setTitle(note?.title || "");
    setDescription(note?.description || "");
    setCategory(note?.category || "General");
    setTags((note?.tags || []).join(", "));
    setError("");
  }, [note, isOpen]);

  if (!isOpen) return null;

  const formatSelection = (prefix, suffix = prefix) => {
    const el = editor.current;
    const start = el.selectionStart, end = el.selectionEnd;
    const selected = description.slice(start, end) || "text";
    const next = description.slice(0, start) + prefix + selected + suffix + description.slice(end);
    setDescription(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length); });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      if (!localStorage.getItem("token")) throw new Error("Please log in again.");
      const payload = { title: title.trim(), description: description.trim(), category, tags: tags.split(",").map(t => t.trim()).filter(Boolean) };
      const { data } = note
        ? await axios.put(`/api/notes/${note._id}`, payload, auth())
        : await axios.post("/api/notes", payload, auth());
      onSave(data); onClose();
    } catch (err) { setError(err.response?.data?.message || err.message || "Unable to save note."); }
    finally { setSaving(false); }
  };

  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="note-modal note-modal-wide">
      <div className="modal-heading"><div><span className="eyebrow">NOTELY EDITOR</span><h2>{note ? "Edit your note" : "Create a note"}</h2><p>Organize your ideas and keep everything searchable.</p></div><button className="modal-close" onClick={onClose}>×</button></div>
      {error && <div className="error-banner">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="field-label">NOTE TITLE<input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your note a title..." maxLength={120} required /></label>
        <div className="editor-toolbar" aria-label="Text formatting">
          <button type="button" onClick={() => formatSelection("**")} title="Bold"><b>B</b></button>
          <button type="button" onClick={() => formatSelection("*")} title="Italic"><i>I</i></button>
          <button type="button" onClick={() => formatSelection("## ", "")} title="Heading">H</button>
          <button type="button" onClick={() => formatSelection("- ", "")} title="Bullet list">☷ List</button>
          <button type="button" onClick={() => formatSelection("`")} title="Inline code">{"</>"}</button>
          <span>Markdown formatting supported</span>
        </div>
        <label className="field-label">YOUR CONTENT<textarea ref={editor} className="editor-area" value={description} onChange={e => setDescription(e.target.value)} placeholder="Start writing… Use the toolbar to format your notes." rows={9} required /></label>
        <div className="metadata-grid">
          <label className="field-label">CATEGORY<input value={category} onChange={e => setCategory(e.target.value)} list="note-categories" placeholder="e.g. College" /><datalist id="note-categories"><option>College</option><option>Assignments</option><option>Projects</option><option>Personal</option><option>Ideas</option><option>General</option></datalist></label>
          <label className="field-label">TAGS <input value={tags} onChange={e => setTags(e.target.value)} placeholder="exam, dsa, semester (comma separated)" /></label>
        </div>
        <div className="modal-footer"><span>✦ Your ideas, neatly organized.</span><div><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : note ? "Save changes" : "Create note"}</button></div></div>
      </form>
    </section>
  </div>;
}
