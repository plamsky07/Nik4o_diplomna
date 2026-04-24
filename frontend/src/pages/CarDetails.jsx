import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCarById } from "../api/cars";
import InquiryForm from "../components/InquiryForm";
import { trackEvent } from "../utils/analytics";
import { getCarImagesForDisplay, handleCarImageError } from "../utils/carImages";

function formatPrice(value) {
  if (value == null) return "-";
  return `${new Intl.NumberFormat("bg-BG").format(value)} лв`;
}

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const data = await getCarById(id);
        if (alive) {
          setCar(data);
          setActiveImageIndex(0);
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

  const images = useMemo(() => getCarImagesForDisplay(car), [car]);
  const activeImage = images[activeImageIndex] || images[0] || "";

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

  function showPrevImage() {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  function showNextImage() {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  }

  return (
    <section className="section" style={{ paddingTop: 36 }}>
      <div className="site-container contact-grid">
        <article className="surface-card" style={{ padding: 24 }}>
          <h1 className="section-title" style={{ fontSize: "58px" }}>{title}</h1>
          <p className="section-subtitle">Подробна информация за автомобила</p>

          {activeImage ? (
            <div style={{ marginTop: 16 }}>
              <div style={{ position: "relative" }}>
                <img
                  src={activeImage}
                  alt={title}
                  onError={handleCarImageError}
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    maxHeight: 380,
                    objectFit: "cover",
                    border: "1px solid var(--line)",
                  }}
                />
                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-light"
                      aria-label="Предишна снимка"
                      onClick={showPrevImage}
                      style={{ position: "absolute", left: 10, top: 10, padding: "8px 12px" }}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      aria-label="Следваща снимка"
                      onClick={showNextImage}
                      style={{ position: "absolute", right: 10, top: 10, padding: "8px 12px" }}
                    >
                      →
                    </button>
                    <span
                      className="badge"
                      style={{
                        position: "absolute",
                        right: 10,
                        bottom: 10,
                        background: "rgba(16,34,72,0.8)",
                        color: "#fff",
                      }}
                    >
                      {activeImageIndex + 1}/{images.length}
                    </span>
                  </>
                ) : null}
              </div>

              {images.length > 1 ? (
                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))",
                    gap: 8,
                  }}
                >
                  {images.map((url, index) => (
                    <button
                      key={`${url}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Снимка ${index + 1}`}
                      style={{
                        padding: 0,
                        borderRadius: 10,
                        overflow: "hidden",
                        border: index === activeImageIndex ? "2px solid #2457d6" : "1px solid var(--line)",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={url}
                        alt={`${title} ${index + 1}`}
                        onError={handleCarImageError}
                        style={{ width: "100%", height: 70, objectFit: "cover", display: "block" }}
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
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
