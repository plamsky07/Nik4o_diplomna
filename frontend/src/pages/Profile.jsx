import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { logout, updateCurrentUserProfile } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

function formatTimeNoSeconds(date) {
  return new Intl.DateTimeFormat("bg-BG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default function Profile() {
  const { user, loading, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);

  const nowLabel = useMemo(() => `${formatTimeNoSeconds(new Date())} ч.`, []);

  useEffect(() => {
    setUsername(user?.displayName || "");
  }, [user?.displayName]);

  if (loading) {
    return (
      <section className="section">
        <div className="site-container muted">Зареждане...</div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <div className="site-container">
          <article className="surface-card" style={{ padding: 24 }}>
            <h1 className="section-title" style={{ fontSize: "48px", marginBottom: 10 }}>
              Профил
            </h1>
            <p className="muted">Моля, влезте в профила си.</p>
          </article>
        </div>
      </section>
    );
  }

  async function onSaveProfile(e) {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Потребителското име е задължително.");
      return;
    }

    try {
      setSaving(true);
      await updateCurrentUserProfile({ username });
      refreshUser();
      toast.success("Профилът е обновен.");
    } catch {
      toast.error("Грешка при запис на профила.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="section" style={{ paddingTop: 36 }}>
      <div className="site-container">
        <header className="admin-head">
          <h1 style={{ margin: 0, fontSize: "54px" }}>Профил</h1>
          <p style={{ margin: "8px 0 0", color: "#a9c1e5", fontSize: 24 }}>Вашият акаунт в TateAuto</p>
        </header>

        <div className="grid-3" style={{ gridTemplateColumns: "1.8fr 1fr 1fr" }}>
          <article className="surface-card" style={{ padding: 22 }}>
            <h3 style={{ marginTop: 0, fontSize: 34 }}>Потребителска информация</h3>
            <p style={{ margin: 0, fontSize: 22 }}>
              <b>Имейл:</b> {user.email}
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 22 }}>
              <b>Статус:</b>{" "}
              {user.emailVerified ? (
                <span style={{ color: "#067647", fontWeight: 700 }}>Потвърден имейл</span>
              ) : (
                <span style={{ color: "#b54708", fontWeight: 700 }}>Непотвърден имейл</span>
              )}
            </p>

            <form onSubmit={onSaveProfile} className="form-grid" style={{ marginTop: 14 }}>
              <label>
                Потребителско име
                <input
                  className="field"
                  placeholder="Въведете потребителско име"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <button type="submit" className="btn btn-brand" disabled={saving} style={{ width: "fit-content" }}>
                {saving ? "Запис..." : "Запази данните"}
              </button>
            </form>
          </article>

          <article className="surface-card" style={{ padding: 22 }}>
            <h3 style={{ marginTop: 0, fontSize: 30 }}>Последна сесия</h3>
            <p style={{ fontSize: 34, margin: "8px 0 0" }}>{nowLabel}</p>
          </article>

          <article className="surface-card" style={{ padding: 22 }}>
            <h3 style={{ marginTop: 0, fontSize: 30 }}>Акаунт</h3>
            <button type="button" className="btn btn-light" style={{ width: "100%" }} onClick={logout}>
              Изход
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}
