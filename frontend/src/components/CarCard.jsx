import { Link } from "react-router-dom";

function formatPrice(value) {
  if (value == null) return "-";
  return `${new Intl.NumberFormat("bg-BG").format(value)} лв`;
}

function formatNumber(value, suffix = "") {
  if (value == null) return "-";
  const formatted = new Intl.NumberFormat("bg-BG").format(value);
  return suffix ? `${formatted} ${suffix}` : formatted;
}

function getStatusLabel(status) {
  if (status === "наличен") return { label: "Наличен", cls: "status-ok" };
  if (status === "резервиран") return { label: "Резервиран", cls: "status-warn" };
  return { label: "Продаден", cls: "status-off" };
}

export default function CarCard({ car }) {
  const title = `${car.brand ?? ""} ${car.model ?? ""}`.trim();
  const status = getStatusLabel(car.status);

  return (
    <article className="car-card">
      <div className="car-media">
        <img src={car.imageUrl} alt={title || "Автомобил"} loading="lazy" />
        <div className="car-gradient" />
        <div style={{ position: "absolute", right: 10, top: 10 }}>
          <span className={`badge ${status.cls}`}>{status.label}</span>
        </div>
        <div className="car-top">
          <div className="car-year">{car.year || "-"}</div>
          <h3 className="car-title">{title || "Автомобил"}</h3>
        </div>
      </div>

      <div className="car-body">
        <div className="car-specs">
          <span>Пробег: {formatNumber(car.mileage, "км")}</span>
          <span>Гориво: {car.fuel || "-"}</span>
          <span>Скорости: {car.gearbox || "-"}</span>
          <span>Мощност: {formatNumber(car.powerHp, "к.с.")}</span>
        </div>

        <div className="car-price-row">
          <div>
            <div className="car-price-label">Цена</div>
            <p className="car-price">{formatPrice(car.price)}</p>
          </div>
          <Link to={`/kola/${car.id}`} className="btn btn-brand">
            Детайли
          </Link>
        </div>
      </div>
    </article>
  );
}
