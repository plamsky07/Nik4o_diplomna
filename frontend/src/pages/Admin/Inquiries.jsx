import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { deleteInquiry, getAllInquiries, markInquiryNew, markInquiryRead } from "../../api/inquiries";

function formatDate(ts) {
  try {
    if (!ts) return "-";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString("bg-BG");
  } catch {
    return "-";
  }
}

export default function InquiriesAdmin() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getAllInquiries();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Грешка при зареждане на запитванията.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "new") return items.filter((x) => x.isNew === true);
    if (filter === "read") return items.filter((x) => x.isRead === true);
    return items;
  }, [items, filter]);

  const newCount = useMemo(() => items.filter((x) => x.isNew === true).length, [items]);

  async function onRead(id) {
    try {
      await markInquiryRead(id);
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, isRead: true, isNew: false } : x)));
      toast.success("Маркирано като прочетено.");
    } catch {
      toast.error("Грешка при маркиране.");
    }
  }

  async function onNew(id) {
    try {
      await markInquiryNew(id);
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, isRead: false, isNew: true } : x)));
      toast.success("Върнато като ново.");
    } catch {
      toast.error("Грешка при връщане.");
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Сигурен ли си, че искаш да изтриеш запитването?")) return;
    try {
      await deleteInquiry(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast.success("Запитването е изтрито.");
    } catch {
      toast.error("Грешка при изтриване.");
    }
  }

  return (
    <section className="admin-page">
      <div className="site-container">
        <header className="admin-head" style={{ marginBottom: 14 }}>
          <h1 style={{ margin: 0, fontSize: "54px" }}>Админ: Запитвания</h1>
          <p style={{ margin: "8px 0 0", color: "#a9c1e5", fontSize: 24 }}>Нови: {newCount}</p>
        </header>

        <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          <button type="button" className={`btn ${filter === "all" ? "btn-brand" : "btn-light"}`} onClick={() => setFilter("all")}>
            Всички
          </button>
          <button type="button" className={`btn ${filter === "new" ? "btn-brand" : "btn-light"}`} onClick={() => setFilter("new")}>
            Нови
          </button>
          <button type="button" className={`btn ${filter === "read" ? "btn-brand" : "btn-light"}`} onClick={() => setFilter("read")}>
            Прочетени
          </button>
          <button type="button" className="btn btn-light" onClick={load}>
            Обнови
          </button>
        </div>

        {loading ? <p className="muted">Зареждане...</p> : null}
        {!loading && filtered.length === 0 ? <p className="muted">Няма запитвания по избрания филтър.</p> : null}

        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((q) => {
            const isNew = q.isNew === true;
            return (
              <article key={q.id} className="surface-card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <span className={`badge ${isNew ? "status-ok" : "status-off"}`}>{isNew ? "Ново" : "Прочетено"}</span>
                    <span className="muted" style={{ marginLeft: 10 }}>{formatDate(q.createdAt)}</span>
                    <h3 style={{ margin: "10px 0 4px", fontSize: 30 }}>{q.name || "Без име"} • {q.phone || "Без телефон"}</h3>
                    <div className="muted">Имейл: {q.email || "-"}</div>
                    {q.carTitle ? <div className="muted">Автомобил: {q.carTitle}</div> : null}
                    {q.message ? <p style={{ marginTop: 10, whiteSpace: "pre-wrap", fontSize: 18 }}>{q.message}</p> : null}
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignSelf: "start" }}>
                    {isNew ? (
                      <button type="button" className="btn btn-brand" onClick={() => onRead(q.id)}>
                        Маркирай прочетено
                      </button>
                    ) : (
                      <button type="button" className="btn btn-light" onClick={() => onNew(q.id)}>
                        Върни като ново
                      </button>
                    )}

                    <a
                      className="btn btn-light"
                      href={`mailto:${q.email || ""}?subject=${encodeURIComponent("Отговор на запитване - TateAuto")}`}
                    >
                      Отговори
                    </a>

                    <button type="button" className="btn btn-light" style={{ color: "#b42318" }} onClick={() => onDelete(q.id)}>
                      Изтрий
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
