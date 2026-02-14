import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCarById } from "../api/cars";
import InquiryForm from "../components/InquiryForm";
import { trackEvent } from "../utils/analytics";

function formatPrice(value) {
  if (value == null) return "-";
  return `${new Intl.NumberFormat("bg-BG").format(value)} лв`;
}

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const data = await getCarById(id);
        if (alive) {
          setCar(data);
          if (data) trackEvent("car_details_view");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="section">
        <div className="site-container muted">Зареждане...</div>
      </section>
    );
  }

  if (!car) {
    return (
      <section className="section">
        <div className="site-container">
          <h1 className="section-title" style={{ fontSize: "44px" }}>Няма такъв автомобил</h1>
          <Link className="btn btn-brand" to="/katalog">
            Назад към каталога
          </Link>
        </div>
      </section>
    );
  }

  const title = `${car.brand || ""} ${car.model || ""}`.trim();

  return (
    <section className="section" style={{ paddingTop: 36 }}>
      <div className="site-container contact-grid">
        <article className="surface-card" style={{ padding: 24 }}>
          <h1 className="section-title" style={{ fontSize: "58px" }}>{title}</h1>
          <p className="section-subtitle">Подробна информация за автомобила</p>

          {car.imageUrl ? (
            <img
              src={car.imageUrl}
              alt={title}
              style={{
                width: "100%",
                borderRadius: 14,
                marginTop: 16,
                maxHeight: 380,
                objectFit: "cover",
                border: "1px solid var(--line)",
              }}
            />
          ) : null}

          <div className="grid-3" style={{ marginTop: 18, gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
            <div className="surface-card" style={{ padding: 14 }}>Година: <b>{car.year || "-"}</b></div>
            <div className="surface-card" style={{ padding: 14 }}>Цена: <b>{formatPrice(car.price)}</b></div>
            <div className="surface-card" style={{ padding: 14 }}>Пробег: <b>{car.mileage || "-"} км</b></div>
            <div className="surface-card" style={{ padding: 14 }}>Мощност: <b>{car.powerHp || "-"} к.с.</b></div>
            <div className="surface-card" style={{ padding: 14 }}>Гориво: <b>{car.fuel || "-"}</b></div>
            <div className="surface-card" style={{ padding: 14 }}>Скорости: <b>{car.gearbox || "-"}</b></div>
          </div>
        </article>

        <InquiryForm carId={car.id} carTitle={title} source="car-details" />
      </div>
    </section>
  );
}
