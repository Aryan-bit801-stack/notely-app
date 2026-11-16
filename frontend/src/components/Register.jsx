import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register({ setUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await axios.post("/api/users/register", { username, email, password });
      localStorage.setItem("token", data.token); setUser(data); navigate("/");
    } catch (err) { setError(err.response?.data?.message || "Unable to create your account. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      <div className="auth-decoration"><div className="auth-orb orb-one" /><div className="auth-orb orb-two" /><div className="auth-quote"><span>✧</span><h2>Your ideas<br/>belong here.</h2><p>A fresh page. A fresh perspective. A space of your own.</p></div></div>
      <section className="auth-panel"><div className="auth-form-wrap"><span className="eyebrow">GET STARTED FOR FREE</span><h1>Create your<br/>personal space.</h1><p className="auth-subtitle">A home for all the things you don't want to forget.</p>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form"><label className="field-label">YOUR NAME<input value={username} onChange={e => setUsername(e.target.value)} placeholder="How should we call you?" required /></label><label className="field-label">EMAIL ADDRESS<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></label><label className="field-label">PASSWORD<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" minLength={6} required /></label><button className="primary-button auth-submit" disabled={loading}>{loading ? "Creating account…" : "Create account"} <span>→</span></button></form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p><p className="auth-legal">Your thoughts stay yours. Always.</p>
      </div></section>
    </main>
  );
}
