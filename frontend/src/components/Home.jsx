import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import NoteModal from "./NoteModal";

const palette = ["lavender", "mint", "peach", "blue", "rose", "sand"];
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export default function Home({ user }) {
  const [notes, setNotes] = useState([]);
  const [binNotes, setBinNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState("grid");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const location = useLocation();
  const [busy, setBusy] = useState("");

  const fetchNotes = async () => {
    try {
      const [{ data }, bin] = await Promise.all([
        axios.get("/api/notes", auth()),
        axios.get("/api/notes?bin=true", auth())
      ]);
      setNotes(data); setBinNotes(bin.data); setError("");
    } catch { setError("We couldn't load your notes. Please refresh and try again."); }
  };
  useEffect(() => { fetchNotes(); }, []);
  const search = new URLSearchParams(location.search).get("search") || "";
  const categories = useMemo(() => ["All categories", ...new Set(notes.map(n => n.category || "General"))], [notes]);
  const filteredNotes = useMemo(() => {
    let result = [...notes];
    if (activeFilter === "Favorites") result = result.filter(n => n.isFavorite && !n.isArchived);
    else if (activeFilter !== "Archived") result = result.filter(n => !n.isArchived);
    if (activeFilter === "Recently updated") result.sort((a,b) => new Date(b.updatedAt)-new Date(a.updatedAt));
    if (categoryFilter !== "All categories") result = result.filter(n => (n.category || "General") === categoryFilter);
    if (search.trim()) result = result.filter(n => `${n.title} ${n.description} ${(n.tags||[]).join(" ")}`.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [notes, search, activeFilter, categoryFilter]);
  const handleSaveNote = saved => { setNotes(current => editNote ? current.map(n => n._id === saved._id ? saved : n) : [saved, ...current]); setEditNote(null); setIsModalOpen(false); };
  const updateNote = async (id, patch) => {
    setBusy(id);
    try { const { data } = await axios.put(`/api/notes/${id}`, patch, auth()); setNotes(current => current.map(n => n._id === id ? data : n)); }
    catch { setError("Unable to update note. Please try again."); }
    finally { setBusy(""); }
  };
  const moveToBin = async id => {
    if (!window.confirm("Move this note to the recycle bin? You can restore it later.")) return;
    try { await axios.delete(`/api/notes/${id}`, auth()); setNotes(current => current.filter(n => n._id !== id)); setBinNotes(current => [{ ...notes.find(n => n._id === id), deletedAt: new Date() }, ...current]); }
    catch { setError("Unable to move this note."); }
  };
  const restore = async id => { try { await axios.post(`/api/notes/${id}/restore`, {}, auth()); await fetchNotes(); } catch { setError("Unable to restore note."); } };
  const permanentlyDelete = async id => { if (!window.confirm("Permanently delete this note? This cannot be undone.")) return; try { await axios.delete(`/api/notes/${id}/permanent`, auth()); setBinNotes(c => c.filter(n => n._id !== id)); } catch { setError("Unable to delete note."); } };
  const share = async note => {
    try { const { data } = await axios.post(`/api/notes/${note._id}/share`, {}, auth()); const url = `${window.location.origin}/shared/${data.shareToken}`; await navigator.clipboard.writeText(url); alert("Read-only share link copied to clipboard!"); }
    catch { setError("Could not create or copy the share link."); }
  };
  const disableShare = async note => { try { await axios.delete(`/api/notes/${note._id}/share`, auth()); alert("Sharing disabled."); } catch { setError("Unable to disable sharing."); } };
  const exportPDF = note => {
    const popup = window.open("", "_blank", "width=850,height=700");
    if (!popup) return setError("Allow pop-ups to export a PDF.");
    const escape = s => String(s || "").replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
    popup.document.write(`<!doctype html><html><head><title>${escape(note.title)}</title><style>body{font:16px/1.7 Arial,sans-serif;max-width:760px;margin:55px auto;color:#222}h1{font-size:30px}small{color:#777}.content{white-space:pre-wrap;margin-top:30px}@media print{body{margin:20mm}}</style></head><body><small>NOTELY · ${escape(note.category || "General")}</small><h1>${escape(note.title)}</h1><small>Exported ${new Date().toLocaleDateString()}</small><div class="content">${escape(note.description)}</div></body></html>`);
    popup.document.close(); popup.focus(); setTimeout(() => popup.print(), 300);
  };
  const openCreate = () => { setEditNote(null); setIsModalOpen(true); };
  const greetingName = user?.username?.split(" ")[0] || "there";
  const activeNotes = notes.filter(n => !n.isArchived);
  const words = activeNotes.reduce((sum,n)=>(sum+(n.description||"").trim().split(/\s+/).filter(Boolean).length),0);
  const todayCount = activeNotes.filter(n=>new Date(n.updatedAt).toDateString()===new Date().toDateString()).length;
  const week = Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return {label:d.toLocaleDateString(undefined,{weekday:"short"}),count:activeNotes.filter(n=>new Date(n.updatedAt).toDateString()===d.toDateString()).length};});
  const heading = activeFilter === "Recycle bin" ? "Recycle bin" : activeFilter === "Favorites" ? "Favorite notes" : activeFilter === "Archived" ? "Archived notes" : activeFilter === "Recently updated" ? "Recently updated" : search ? "Search results" : "Your notes";
  const displayNotes = activeFilter === "Recycle bin" ? binNotes : activeFilter === "Archived" ? filteredNotes.filter(n=>n.isArchived) : filteredNotes;

  return <main className="workspace">
    <aside className="sidebar">
      <div className="workspace-label">WORKSPACE</div>
      {[["All","▦",activeNotes.length],["Recently updated","◷",""],["Favorites","♡",notes.filter(n=>n.isFavorite && !n.isArchived).length],["Archived","⌑",notes.filter(n=>n.isArchived).length],["Recycle bin","♲",binNotes.length]].map(([name,icon,count])=><button key={name} className={`side-link ${activeFilter===name?"active":""}`} onClick={()=>{setActiveFilter(name);setCategoryFilter("All categories");}}><span>{icon}</span>{name}{count!==""&&<b>{count}</b>}</button>)}
      <div className="sidebar-divider"/><div className="workspace-label">CATEGORIES</div>
      {categories.slice(1).map(c=><button key={c} className={`side-link ${categoryFilter===c?"active":""}`} onClick={()=>{setActiveFilter("All");setCategoryFilter(c);}}><span>◈</span>{c}</button>)}
      <div className="sidebar-tip"><span className="tip-icon">✦</span><strong>A little space to think.</strong><p>Your ideas, assignments and everyday thoughts in one place.</p></div>
      <div className="sidebar-foot"><span className="status-dot"/> Your workspace is up to date</div>
    </aside>
    <section className="main-content">
      <div className="welcome-row"><div><div className="eyebrow">YOUR PERSONAL WORKSPACE</div><h1>Good to see you, {greetingName} <span className="wave">✦</span></h1><p className="subheading">A clear mind starts with getting things down.</p></div><button className="primary-button" onClick={openCreate}><span>＋</span> New note</button></div>
      <div className="stats-row">
        <div className="stat-card"><span className="stat-icon purple">▤</span><div><strong>{activeNotes.length}</strong><span>Active notes</span></div></div>
        <div className="stat-card"><span className="stat-icon green">◷</span><div><strong>{todayCount}</strong><span>Updated today</span></div></div>
        <div className="stat-card"><span className="stat-icon orange">✧</span><div><strong>{words.toLocaleString()}</strong><span>Words captured</span></div></div>
      </div>
      <section className="analytics-panel"><div><div><h3>Weekly activity</h3><p>Your note updates over the last seven days</p></div><strong>{week.reduce((s,d)=>s+d.count,0)} <small>updates</small></strong></div><div className="activity-bars">{week.map(d=><div key={d.label} className="activity-day"><span>{d.count || ""}</span><i style={{height:`${Math.max(5,Math.min(100,d.count*25))}%`}}/><small>{d.label}</small></div>)}</div></section>
      <div className="notes-heading"><div><h2>{heading}</h2><p>{search?`Showing matches for “${search}”`:activeFilter==="Recycle bin"?"Restore notes or permanently remove them.":"Your ideas, gathered together."}</p></div><div className="heading-tools">{activeFilter!=="Recycle bin"&&<select className="category-select" value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select>}<div className="view-switch"><button className={view==="grid"?"selected":""} onClick={()=>setView("grid")} aria-label="Grid view">▦</button><button className={view==="list"?"selected":""} onClick={()=>setView("list")} aria-label="List view">☷</button></div></div></div>
      {error&&<div className="error-banner">{error}</div>}
      {displayNotes.length ? <div className={`notes-grid ${view==="list"?"list-view":""}`}>
        {displayNotes.map((note,index)=><article className={`note-card ${palette[index%palette.length]}`} key={note._id}>
          <div className="note-card-top"><span className="note-label"><i/>{note.category||"GENERAL"} {note.isFavorite?"· ★":""}</span>{activeFilter==="Recycle bin"?<button className="more-button" onClick={()=>permanentlyDelete(note._id)}>•••</button>:<button className="more-button" onClick={()=>{setEditNote(note);setIsModalOpen(true);}}>•••</button>}</div>
          <h3>{note.title}</h3><p className="note-description">{note.description}</p>
          {note.tags?.length>0&&<div className="note-tags">{note.tags.map(t=><span key={t}>#{t}</span>)}</div>}
          <div className="note-card-bottom"><span>{activeFilter==="Recycle bin"?"Deleted":new Date(note.updatedAt||note.createdAt).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</span>
            <div>{activeFilter==="Recycle bin"?<><button onClick={()=>restore(note._id)}>Restore</button><button className="delete-action" onClick={()=>permanentlyDelete(note._id)}>Delete forever</button></>:<>
              <button title="Toggle favorite" onClick={()=>updateNote(note._id,{isFavorite:!note.isFavorite})}>{note.isFavorite?"★":"☆"}</button>
              <button title="Export PDF" onClick={()=>exportPDF(note)}>PDF</button>
              <button title="Share read-only link" onClick={()=>share(note)}>Share</button>
              {note.shareEnabled&&<button title="Disable sharing" onClick={()=>disableShare(note)}>Unshare</button>}
              <button onClick={()=>{setEditNote(note);setIsModalOpen(true);}}>Edit</button>
              <button onClick={()=>updateNote(note._id,{isArchived:!note.isArchived})}>{note.isArchived?"Unarchive":"Archive"}</button>
              <button className="delete-action" onClick={()=>moveToBin(note._id)}>Delete</button>
            </>}</div>
          </div>
        </article>)}
      </div>:<div className="empty-state"><div className="empty-illustration"><span>✎</span><i>✦</i><b>✧</b></div><h3>{activeFilter==="Recycle bin"?"Your recycle bin is empty":search?"No notes found":"Nothing here yet"}</h3><p>{activeFilter==="Recycle bin"?"Deleted notes will appear here so you can restore them.":"Start capturing your ideas. Your first note is just a click away."}</p>{activeFilter==="All"&&!search&&<button className="primary-button" onClick={openCreate}>＋ Create your first note</button>}</div>}
    </section>
    <NoteModal isOpen={isModalOpen} onClose={()=>{setIsModalOpen(false);setEditNote(null);}} note={editNote} onSave={handleSaveNote}/>
  </main>;
}
