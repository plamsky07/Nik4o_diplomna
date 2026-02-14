import { useState } from "react";
import { Link } from "react-router-dom";
import { createInquiry } from "../api/inquiries";
import { useAuth } from "../contexts/AuthContext";
import { trackEvent } from "../utils/analytics";

const initial = { name: "", email: "", phone: "", message: "" };

export default function InquiryForm({ carId = null, carTitle = null, source = "site" }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const { user } = useAuth();

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      setErr("Попълнете всички задължителни полета.");
      return;
    }

    try {
      setLoading(true);
      await createInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        carId,
        carTitle,
        source,
      });

      trackEvent("inquiry_submit");
      setOk("Запитването е изпратено успешно.");
      setForm(initial);
    } catch {
      setErr("Грешка при изпращане. Опитайте отново.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <article className="surface-card inquiry-form inquiry-form-modern">
        <div className="inquiry-head">
          <h3>Изпратете запитване</h3>
          <p className="muted">За да изпратите запитване, първо влезте в профила си.</p>
        </div>
        <div style={{ marginTop: 12 }}>
          <Link to="/vhod" className="btn btn-brand">
            Вход
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="surface-card inquiry-form inquiry-form-modern">
      <div className="inquiry-head">
        <h3>{carTitle ? `Запитване за ${carTitle}` : "Изпратете запитване"}</h3>
        <p className="muted">Ще се свържем с вас възможно най-скоро.</p>
      </div>

      <form className="form-grid form-modern" onSubmit={onSubmit}>
        <label>
          Вашето име *
          <input
            className="field"
            placeholder="Иван Иванов"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
          />
        </label>

        <div className="form-grid two">
          <label>
            Телефон *
            <input
              className="field"
              placeholder="+359 88 888 8888"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
          </label>

          <label>
            Имейл *
            <input
              className="field"
              placeholder="ivan@example.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </label>
        </div>

        <label>
          Съобщение *
          <textarea
            className="field"
            placeholder="Вашето съобщение..."
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
          />
        </label>

        {err ? <div className="form-error">{err}</div> : null}
        {ok ? <div className="form-success">{ok}</div> : null}

        <button type="submit" disabled={loading} className="btn btn-brand inquiry-submit">
          {loading ? "Изпращане..." : "Изпрати съобщение"}
        </button>
      </form>
    </article>
  );
}
