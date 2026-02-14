import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../../api/auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !pass) {
      toast.error("Моля, въведи имейл и парола.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), pass);
      toast.success("Успешен вход.");
      nav("/profil");
    } catch {
      toast.error("Грешен имейл или парола.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" style={{ paddingTop: 36 }}>
      <div className="site-container" style={{ maxWidth: 560 }}>
        <article className="surface-card" style={{ padding: 24 }}>
          <h1 className="section-title" style={{ fontSize: "46px", marginBottom: 12 }}>
            Вход
          </h1>

          <form onSubmit={onSubmit} className="form-grid">
            <label>
              Имейл
              <input
                className="field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            <label>
              Парола
              <input
                className="field"
                placeholder="Въведете парола"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
              />
            </label>

            <button disabled={loading} className="btn btn-brand">
              {loading ? "Влизане..." : "Вход"}
            </button>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontWeight: 700 }}>
              <Link style={{ color: "#2d63dc" }} to="/registracia">
                Регистрация
              </Link>
              <Link style={{ color: "#2d63dc" }} to="/zabravena-parola">
                Забравена парола
              </Link>
            </div>
          </form>
        </article>
      </div>
    </section>
  );
}
