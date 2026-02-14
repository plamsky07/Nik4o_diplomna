import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createCar, deleteCar, getCars, updateCar } from "../../api/cars";
import { getAllInquiries } from "../../api/inquiries";
import { uploadCarImage } from "../../api/storage";
import { getAnalyticsSummary, trackEvent } from "../../utils/analytics";

function formatDate(ts) {
  try {
    if (!ts) return "-";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("bg-BG");
  } catch {
    return "-";
  }
}

function formatPrice(value) {
  if (value == null) return "-";
  return `${new Intl.NumberFormat("bg-BG").format(value)} лв`;
}

function toNumberOrNull(v) {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function mapToEditForm(car) {
  return {
    id: car.id,
    brand: car.brand || "",
    model: car.model || "",
    year: car.year ?? "",
    price: car.price ?? "",
    mileage: car.mileage ?? "",
    fuel: car.fuel || "",
    gearbox: car.gearbox || "",
    powerHp: car.powerHp ?? "",
    status: car.status || "наличен",
  };
}

const initialCreateForm = {
  brand: "",
  model: "",
  year: "",
  price: "",
  mileage: "",
  fuel: "бензин",
  gearbox: "автомат",
  powerHp: "",
  status: "наличен",
};

export default function CarsAdmin() {
  const [cars, setCars] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(initialCreateForm);
  const [createFile, setCreateFile] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [carsData, inqData] = await Promise.all([getCars(), getAllInquiries()]);
        setCars(Array.isArray(carsData) ? carsData : []);
        setInquiries(Array.isArray(inqData) ? inqData : []);
      } catch (err) {
        console.error(err);
        toast.error("Грешка при зареждане на данните.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const analytics = getAnalyticsSummary();

  const filtered = useMemo(() => {
    const txt = search.trim().toLowerCase();
    if (!txt) return cars;
    return cars.filter((car) => `${car.brand || ""} ${car.model || ""}`.toLowerCase().includes(txt));
  }, [cars, search]);

  const stats = useMemo(() => {
    const available = cars.filter((x) => x.status === "наличен").length;
    const reserved = cars.filter((x) => x.status === "резервиран").length;
    const sold = cars.filter((x) => x.status === "продаден").length;
    const freshInq = inquiries.filter((x) => x.isNew === true).length;
    const avgPrice =
      cars.length > 0
        ? Math.round(
            cars.reduce((sum, c) => sum + (Number.isFinite(Number(c.price)) ? Number(c.price) : 0), 0) /
              cars.length
          )
        : 0;

    return {
      totalCars: cars.length,
      available,
      reserved,
      sold,
      avgPrice,
      newInquiries: freshInq,
      totalInquiries: inquiries.length,
    };
  }, [cars, inquiries]);

  const statusBars = useMemo(() => {
    const total = Math.max(stats.totalCars, 1);
    return [
      { label: "Налични", value: stats.available, pct: (stats.available / total) * 100 },
      { label: "Резервирани", value: stats.reserved, pct: (stats.reserved / total) * 100 },
      { label: "Продадени", value: stats.sold, pct: (stats.sold / total) * 100 },
    ];
  }, [stats]);

  const trafficBars = useMemo(() => {
    const max = Math.max(
      analytics.viewsToday || 0,
      analytics.totalViews || 0,
      analytics.sessions || 0,
      analytics.inquirySubmits || 0,
      1
    );
    return [
      { label: "Днес", value: analytics.viewsToday, pct: (analytics.viewsToday / max) * 100 },
      { label: "Общо views", value: analytics.totalViews, pct: (analytics.totalViews / max) * 100 },
      { label: "Сесии", value: analytics.sessions, pct: (analytics.sessions / max) * 100 },
      { label: "Запитвания", value: analytics.inquirySubmits, pct: (analytics.inquirySubmits / max) * 100 },
    ];
  }, [analytics]);

  function onEditStart(car) {
    setEditForm(mapToEditForm(car));
  }

  function onEditChange(key, value) {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  }

  function onCreateChange(key, value) {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onEditSave(e) {
    e.preventDefault();
    if (!editForm) return;

    if (!editForm.brand.trim() || !editForm.model.trim()) {
      toast.error("Марка и модел са задължителни.");
      return;
    }

    try {
      setSaving(true);
      await updateCar(editForm.id, {
        brand: editForm.brand.trim(),
        model: editForm.model.trim(),
        year: toNumberOrNull(editForm.year),
        price: toNumberOrNull(editForm.price),
        mileage: toNumberOrNull(editForm.mileage),
        fuel: editForm.fuel.trim() || null,
        gearbox: editForm.gearbox.trim() || null,
        powerHp: toNumberOrNull(editForm.powerHp),
        status: editForm.status,
      });

      setCars((prev) =>
        prev.map((car) =>
          car.id === editForm.id
            ? {
                ...car,
                brand: editForm.brand.trim(),
                model: editForm.model.trim(),
                year: toNumberOrNull(editForm.year),
                price: toNumberOrNull(editForm.price),
                mileage: toNumberOrNull(editForm.mileage),
                fuel: editForm.fuel.trim() || null,
                gearbox: editForm.gearbox.trim() || null,
                powerHp: toNumberOrNull(editForm.powerHp),
                status: editForm.status,
              }
            : car
        )
      );

      trackEvent("admin_car_edit");
      toast.success("Автомобилът е обновен.");
      setEditForm(null);
    } catch (err) {
      console.error(err);
      toast.error("Грешка при обновяване.");
    } finally {
      setSaving(false);
    }
  }

  async function onCreateSubmit(e) {
    e.preventDefault();
    if (!createForm.brand.trim() || !createForm.model.trim()) {
      toast.error("Марка и модел са задължителни.");
      return;
    }

    try {
      setCreating(true);
      let imageUrl = "";
      if (createFile) imageUrl = await uploadCarImage(createFile);
      if (!imageUrl) {
        toast.error("Добавете снимка.");
        return;
      }

      const payload = {
        brand: createForm.brand.trim(),
        model: createForm.model.trim(),
        year: toNumberOrNull(createForm.year),
        price: toNumberOrNull(createForm.price),
        mileage: toNumberOrNull(createForm.mileage),
        fuel: createForm.fuel.trim() || null,
        gearbox: createForm.gearbox.trim() || null,
        powerHp: toNumberOrNull(createForm.powerHp),
        status: createForm.status,
        imageUrl,
      };

      const id = await createCar(payload);
      setCars((prev) => [{ id, ...payload, createdAt: new Date() }, ...prev]);
      trackEvent("admin_car_create");
      toast.success("Автомобилът е добавен.");
      setCreateForm(initialCreateForm);
      setCreateFile(null);
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      toast.error("Грешка при добавяне на автомобил.");
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(car) {
    if (!window.confirm(`Сигурни ли сте, че искате да изтриете ${car.brand || ""} ${car.model || ""}?`)) return;
    try {
      await deleteCar(car.id);
      setCars((prev) => prev.filter((x) => x.id !== car.id));
      if (editForm?.id === car.id) setEditForm(null);
      trackEvent("admin_car_delete");
      toast.success("Автомобилът е изтрит.");
    } catch (err) {
      console.error(err);
      toast.error("Грешка при изтриване.");
    }
  }

  return (
    <section className="admin-page">
      <div className="site-container">
        <header className="admin-head">
          <h1 style={{ margin: 0, fontSize: 38 }}>Административен панел</h1>
          <p style={{ margin: "6px 0 0", color: "#a9c1e5", fontSize: 14 }}>Управление на автокъща TateAuto</p>
        </header>

        <h2 style={{ margin: "4px 0 10px", fontSize: 32 }}>Статистика</h2>
        <div className="admin-kpis">
          <article className="surface-card admin-kpi"><h4>{stats.totalCars}</h4><p>Общо автомобили</p></article>
          <article className="surface-card admin-kpi"><h4>{stats.available}</h4><p>Налични</p></article>
          <article className="surface-card admin-kpi"><h4>{stats.reserved}</h4><p>Резервирани</p></article>
          <article className="surface-card admin-kpi"><h4>{stats.sold}</h4><p>Продадени</p></article>
          <article className="surface-card admin-kpi"><h4>{stats.newInquiries}</h4><p>Нови запитвания</p></article>
          <article className="surface-card admin-kpi"><h4>{stats.totalInquiries}</h4><p>Всички запитвания</p></article>
          <article className="surface-card admin-kpi"><h4>{formatPrice(stats.avgPrice)}</h4><p>Средна цена</p></article>
          <article className="surface-card admin-kpi"><h4>{analytics.viewsToday}</h4><p>Посещения днес</p></article>
          <article className="surface-card admin-kpi"><h4>{analytics.totalViews}</h4><p>Page views общо</p></article>
          <article className="surface-card admin-kpi"><h4>{analytics.sessions}</h4><p>Уникални сесии</p></article>
          <article className="surface-card admin-kpi"><h4>{analytics.avgPagesPerSession.toFixed(2)}</h4><p>Стр./сесия</p></article>
          <article className="surface-card admin-kpi"><h4>{analytics.conversionRate.toFixed(1)}%</h4><p>Конверсия запитвания</p></article>
        </div>

        <article className="surface-card" style={{ padding: 16, marginBottom: 12 }}>
          <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 20 }}>Диаграми</h3>
          <div className="chart-grid">
            <div className="surface-card chart-card">
              <h4 className="chart-title">Статус на автомобили</h4>
              <div className="bars">
                {statusBars.map((row) => (
                  <div className="bar-row" key={row.label}>
                    <span className="bar-label">{row.label}</span>
                    <span className="bar-track">
                      <span className="bar-fill" style={{ width: `${row.pct}%` }} />
                    </span>
                    <span className="bar-value">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card chart-card">
              <h4 className="chart-title">Трафик и конверсия</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "center" }}>
                <div className="donut-wrap">
                  <div className="donut" style={{ "--p": `${Math.min(100, Math.max(0, analytics.conversionRate))}` }}>
                    <div className="donut-center">
                      <strong>{analytics.conversionRate.toFixed(1)}%</strong>
                      <span>Конверсия</span>
                    </div>
                  </div>
                </div>
                <div className="bars">
                  {trafficBars.map((row) => (
                    <div className="bar-row" key={row.label}>
                      <span className="bar-label">{row.label}</span>
                      <span className="bar-track">
                        <span className="bar-fill" style={{ width: `${row.pct}%` }} />
                      </span>
                      <span className="bar-value">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>

        {showCreate ? (
          <article className="surface-card" style={{ padding: 16, marginBottom: 12 }}>
            <h3 style={{ marginTop: 0, fontSize: 18 }}>Добавяне на автомобил</h3>
            <form onSubmit={onCreateSubmit} className="filter-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
              <input className="field" placeholder="Марка" value={createForm.brand} onChange={(e) => onCreateChange("brand", e.target.value)} />
              <input className="field" placeholder="Модел" value={createForm.model} onChange={(e) => onCreateChange("model", e.target.value)} />
              <input className="field" placeholder="Година" inputMode="numeric" value={createForm.year} onChange={(e) => onCreateChange("year", e.target.value)} />
              <input className="field" placeholder="Цена" inputMode="numeric" value={createForm.price} onChange={(e) => onCreateChange("price", e.target.value)} />
              <input className="field" placeholder="Пробег" inputMode="numeric" value={createForm.mileage} onChange={(e) => onCreateChange("mileage", e.target.value)} />
              <input className="field" placeholder="Гориво" value={createForm.fuel} onChange={(e) => onCreateChange("fuel", e.target.value)} />
              <input className="field" placeholder="Скорости" value={createForm.gearbox} onChange={(e) => onCreateChange("gearbox", e.target.value)} />
              <input className="field" placeholder="Мощност (к.с.)" inputMode="numeric" value={createForm.powerHp} onChange={(e) => onCreateChange("powerHp", e.target.value)} />
              <select className="field" value={createForm.status} onChange={(e) => onCreateChange("status", e.target.value)}>
                <option value="наличен">Наличен</option>
                <option value="резервиран">Резервиран</option>
                <option value="продаден">Продаден</option>
              </select>
              <div className="upload-field">
                <label htmlFor="create-car-image" className="upload-btn">
                  Качи снимка
                </label>
                <input
                  id="create-car-image"
                  className="upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCreateFile(e.target.files?.[0] ?? null)}
                />
                <span className="upload-name">{createFile?.name || "Няма избран файл"}</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button type="submit" className="btn btn-brand" disabled={creating}>{creating ? "Добавяне..." : "Добави"}</button>
                <button type="button" className="btn btn-light" onClick={() => { setShowCreate(false); setCreateForm(initialCreateForm); setCreateFile(null); }}>Отказ</button>
              </div>
            </form>
          </article>
        ) : null}

        {editForm ? (
          <article className="surface-card" style={{ padding: 16, marginBottom: 12 }}>
            <h3 style={{ marginTop: 0, fontSize: 18 }}>Редакция на автомобил</h3>
            <form onSubmit={onEditSave} className="filter-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
              <input className="field" placeholder="Марка" value={editForm.brand} onChange={(e) => onEditChange("brand", e.target.value)} />
              <input className="field" placeholder="Модел" value={editForm.model} onChange={(e) => onEditChange("model", e.target.value)} />
              <input className="field" placeholder="Година" inputMode="numeric" value={editForm.year} onChange={(e) => onEditChange("year", e.target.value)} />
              <input className="field" placeholder="Цена" inputMode="numeric" value={editForm.price} onChange={(e) => onEditChange("price", e.target.value)} />
              <input className="field" placeholder="Пробег" inputMode="numeric" value={editForm.mileage} onChange={(e) => onEditChange("mileage", e.target.value)} />
              <input className="field" placeholder="Гориво" value={editForm.fuel} onChange={(e) => onEditChange("fuel", e.target.value)} />
              <input className="field" placeholder="Скорости" value={editForm.gearbox} onChange={(e) => onEditChange("gearbox", e.target.value)} />
              <input className="field" placeholder="Мощност (к.с.)" inputMode="numeric" value={editForm.powerHp} onChange={(e) => onEditChange("powerHp", e.target.value)} />
              <select className="field" value={editForm.status} onChange={(e) => onEditChange("status", e.target.value)}>
                <option value="наличен">Наличен</option>
                <option value="резервиран">Резервиран</option>
                <option value="продаден">Продаден</option>
              </select>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button type="submit" className="btn btn-brand" disabled={saving}>{saving ? "Запис..." : "Запази"}</button>
                <button type="button" className="btn btn-light" onClick={() => setEditForm(null)}>Отказ</button>
              </div>
            </form>
          </article>
        ) : null}

        <article className="surface-card" style={{ padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <input
              className="field"
              style={{ maxWidth: 420 }}
              placeholder="Търсене на автомобили..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button" className="btn btn-brand" onClick={() => setShowCreate((v) => !v)}>
              {showCreate ? "Скрий формата" : "+ Добави автомобил"}
            </button>
          </div>

          {loading ? <p className="muted">Зареждане...</p> : null}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Автомобил</th>
                  <th>Година</th>
                  <th>Цена</th>
                  <th>Статус</th>
                  <th>Дата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((car) => (
                  <tr key={car.id}>
                    <td>
                      <div className="car-mini">
                        <img src={car.imageUrl} alt={`${car.brand || ""} ${car.model || ""}`} />
                        <div>
                          <div style={{ fontWeight: 800 }}>{`${car.brand || ""} ${car.model || ""}`}</div>
                          <div className="muted">{`${car.fuel || "-"} | ${car.gearbox || "-"}`}</div>
                        </div>
                      </div>
                    </td>
                    <td>{car.year || "-"}</td>
                    <td>{formatPrice(car.price)}</td>
                    <td>
                      <span className={`badge ${car.status === "наличен" ? "status-ok" : car.status === "резервиран" ? "status-warn" : "status-off"}`}>
                        {car.status || "-"}
                      </span>
                    </td>
                    <td>{formatDate(car.createdAt)}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button type="button" className="btn btn-light" style={{ marginRight: 6 }} onClick={() => onEditStart(car)}>Редакция</button>
                      <button type="button" className="btn btn-light" style={{ color: "#c81e1e" }} onClick={() => onDelete(car)}>Изтрий</button>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="muted" style={{ padding: 16 }}>
                      Няма намерени автомобили.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
