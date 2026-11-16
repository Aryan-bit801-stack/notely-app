import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import SharedNote from "./components/SharedNote";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem("notes-theme") || "light");
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("notes-theme", theme); }, [theme]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) { const { data } = await axios.get("/api/users/me", { headers: { Authorization: `Bearer ${token}` } }); setUser(data); }
      } catch { localStorage.removeItem("token"); }
      finally { setLoading(false); }
    };
    fetchUser();
  }, []);
  if (loading) return <div className="loading-screen"><span className="loading-mark">n</span><p>Getting your workspace ready…</p></div>;
  return <div className="app-shell">
    <Routes>
      <Route path="/shared/:token" element={<SharedNote />} />
      <Route path="*" element={<><Navbar user={user} setUser={setUser} theme={theme} setTheme={setTheme} /><Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register setUser={setUser} />} />
        <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" replace />} />
      </Routes></>} />
    </Routes>
  </div>;
}
export default App;
