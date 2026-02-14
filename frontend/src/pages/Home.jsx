import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getCars } from "../api/cars";
import CarCard from "../components/CarCard";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCars();
        setCars(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const topOffers = useMemo(() => {
    const available = cars.filter((car) => car.status === "наличен").slice(0, 3);
    if (available.length >= 3) return available;

    const used = new Set(available.map((car) => car.id));
    const extra = cars.filter((car) => !used.has(car.id)).slice(0, 3 - available.length);
    const result = [...available, ...extra];
    return result.slice(0, 3);
  }, [cars]);

  return (
    <>
      <section className="hero">
        <div className="site-container">
          <div className="hero-content">
            <span className="hero-kicker">Над 500 доволни клиенти</span>
            <h1 className="hero-title">
              TateAuto
              <br />
              <span className="hero-title-accent">Автокъща</span>
            </h1>
            <p className="hero-lead">
              Надежден партньор при избора на автомобил. Качество, гаранция и професионално обслужване.
            </p>
            <div className="hero-actions">
              <Link to="/katalog" className="btn btn-brand">
                Разгледай автомобили
              </Link>
              <Link to="/kontakti" className="btn btn-light" style={{ color: "#102248" }}>
                Свържи се с нас
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-row">
        <div className="site-container stats-grid">
          <div className="stat-item">
            <p className="stat-value">500+</p>
            <p className="stat-label">Продадени автомобили</p>
          </div>
          <div className="stat-item">
            <p className="stat-value">10+</p>
            <p className="stat-label">Години опит</p>
          </div>
          <div className="stat-item">
            <p className="stat-value">100%</p>
            <p className="stat-label">Гаранция</p>
          </div>
          <div className="stat-item">
            <p className="stat-value">24/7</p>
            <p className="stat-label">Поддръжка</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div className="offers-head">
            <div>
              <h2 className="section-title">Топ оферти</h2>
              <p className="section-subtitle">Актуални предложения, подбрани за вас</p>
            </div>
          </div>

          {loading ? <p className="muted">Зареждане...</p> : null}
          {!loading && topOffers.length === 0 ? <p className="muted">Няма налични автомобили.</p> : null}

          <div className="cars-grid top-offers-grid">
            {topOffers.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div className="section-head">
            <h2 className="section-title">Защо да изберете нас?</h2>
            <p className="section-subtitle">Професионализъм и качество на първо място</p>
          </div>
          <div className="grid-3">
            <article className="feature-card">
              <span className="feature-icon">Q</span>
              <h3 className="feature-title">Гарантирано качество</h3>
              <p className="feature-desc">Всеки автомобил преминава през щателна техническа проверка.</p>
            </article>
            <article className="feature-card">
              <span className="feature-icon">C</span>
              <h3 className="feature-title">Проверена история</h3>
              <p className="feature-desc">Ясна документация и прозрачна информация за всяка оферта.</p>
            </article>
            <article className="feature-card">
              <span className="feature-icon">S</span>
              <h3 className="feature-title">Бързо обслужване</h3>
              <p className="feature-desc">Кратки срокове и пълно съдействие по време на цялата покупка.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
