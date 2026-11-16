import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function SharedNote() {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { axios.get(`/api/notes/shared/${token}`).then(r => setNote(r.data)).catch(e => setError(e.response?.data?.message || "This share link is invalid or expired.")); }, [token]);
  return <main className="shared-page"><div className="shared-brand"><span className="brand-mark">n</span><b>notely.</b><span>Shared note</span></div>{note ? <article className="shared-card"><span className="eyebrow">{note.category || "GENERAL"} · READ ONLY</span><h1>{note.title}</h1><div className="shared-content">{note.description}</div><div className="shared-meta">Updated {new Date(note.updatedAt).toLocaleString()} {note.tags?.length ? "· " + note.tags.map(t => "#" + t).join(" ") : ""}</div></article> : <div className="empty-state">{error || "Loading shared note…"}</div>}<Link to="/login" className="shared-cta">Create your own notes with Notely →</Link></main>;
}
