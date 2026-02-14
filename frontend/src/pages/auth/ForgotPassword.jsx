import { useState } from "react";
import { resetPassword } from "../../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    try {
      setLoading(true);
      await resetPassword(email.trim());
      setMsg("Изпратихме линк за смяна на паролата. Провери пощата си.");
    } catch {
      setErr("Не успяхме да изпратим линк. Провери имейла и опитай пак.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" style={{ paddingTop: 36 }}>
      <div className="site-container" style={{ maxWidth: 560 }}>
        <article className="surface-card" style={{ padding: 24 }}>
          <h1 className="section-title" style={{ fontSize: "42px", marginBottom: 12 }}>
            Смяна на парола
          </h1>

          <form onSubmit={onSubmit} className="form-grid">
            <label>
              Имейл
              <input
                className="field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {err ? <div className="form-error">{err}</div> : null}
            {msg ? <div className="form-success">{msg}</div> : null}

            <button disabled={loading} className="btn btn-brand">
              {loading ? "Изпращане..." : "Изпрати линк"}
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
