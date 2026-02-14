import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth";

export default function Register() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!username.trim()) return setErr("Въведете потребителско име.");
    if (!email.trim()) return setErr("Въведете имейл.");
    if (pass.length < 6) return setErr("Паролата трябва да е поне 6 символа.");
    if (pass !== pass2) return setErr("Паролите не съвпадат.");

    try {
      setLoading(true);
      await register(email.trim(), pass, username.trim());
      setMsg("Регистрацията е успешна. Изпратихме имейл за потвърждение.");
      setTimeout(() => nav("/vhod"), 1200);
    } catch {
      setErr("Неуспешна регистрация. Проверете данните и опитайте пак.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" style={{ paddingTop: 36 }}>
      <div className="site-container" style={{ maxWidth: 560 }}>
        <article className="surface-card" style={{ padding: 24 }}>
          <h1 className="section-title" style={{ fontSize: "46px", marginBottom: 12 }}>
            Регистрация
          </h1>

          <form onSubmit={onSubmit} className="form-grid">
            <label>
              Потребителско име
              <input
                className="field"
                placeholder="Въведете потребителско име"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

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
                placeholder="Минимум 6 символа"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="new-password"
              />
            </label>

            <label>
              Повтори парола
              <input
                className="field"
                placeholder="Повтори паролата"
                type="password"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                autoComplete="new-password"
              />
            </label>

            {err ? <div style={{ color: "#b42318", fontWeight: 700 }}>{err}</div> : null}
            {msg ? <div style={{ color: "#067647", fontWeight: 700 }}>{msg}</div> : null}

            <button disabled={loading} className="btn btn-brand">
              {loading ? "Създаване..." : "Създай профил"}
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
