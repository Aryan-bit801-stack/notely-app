import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await axios.post("/api/users/login", { email, password });
      localStorage.setItem("token", data.token); setUser(data); navigate("/");
    } catch (err) { setError(err.response?.data?.message || "Unable to sign in. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      <div className="auth-decoration"><div className="auth-orb orb-one" /><div className="auth-orb orb-two" /><div className="auth-quote"><span>✦</span><h2>Make room for<br/>what matters.</h2><p>Ideas are the beginning of everything.</p></div></div>
      <section className="auth-panel"><div className="auth-form-wrap"><span className="eyebrow">WELCOME BACK</span><h1>Sign in to your<br/>little corner.</h1><p className="auth-subtitle">Pick up right where your thoughts left off.</p>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form"><label className="field-label">EMAIL ADDRESS<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></label><label className="field-label">PASSWORD<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required /></label><button className="primary-button auth-submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"} <span>→</span></button></form>
        <p className="auth-switch">New to Notely? <Link to="/register">Create an account</Link></p><p className="auth-legal">By continuing, you're making space for better ideas.</p>
      </div></section>
    </main>
  );
}
