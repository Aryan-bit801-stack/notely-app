import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser, theme, setTheme }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    if (!user) return;
    const delay = setTimeout(() => {
      const query = search.trim();
      navigate(query ? `/?search=${encodeURIComponent(query)}` : "/", { replace: true });
    }, 350);
    return () => clearTimeout(delay);
  }, [search, navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-mark">n</span>
        <span>notely<span className="brand-dot">.</span></span>
      </Link>
      {user && (
        <>
          <label className="top-search">
            <span className="search-icon">⌕</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your notes..." />
            <kbd>⌘ K</kbd>
          </label>
          <div className="top-actions">
            <button className="icon-button theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme" title="Toggle theme">
              {theme === "light" ? "☾" : "☀"}
            </button>
            <div className="user-chip">
              <span className="avatar">{(user.username || "U").slice(0, 1).toUpperCase()}</span>
              <span className="user-name">{user.username}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>Sign out</button>
          </div>
        </>
      )}
      {!user && <span className="auth-caption">A calmer place for your thoughts</span>}
    </header>
  );
}
