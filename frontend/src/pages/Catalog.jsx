import { useEffect, useMemo, useState } from "react";
import { getCars } from "../api/cars";
import CarCard from "../components/CarCard";
import Filters from "../components/Filters";

const initialFilters = {
  search: "",
  fuel: "",
  gearbox: "",
  status: "",
  priceFrom: "",
  priceTo: "",
  yearFrom: "",
  yearTo: "",
};

export default function Catalog() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

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

  const filtered = useMemo(() => {
    const { search, fuel, gearbox, status, priceFrom, priceTo, yearFrom, yearTo } = filters;

    const searchText = search.trim().toLowerCase();
    const pf = Number(priceFrom) || null;
    const pt = Number(priceTo) || null;
    const yf = Number(yearFrom) || null;
    const yt = Number(yearTo) || null;

    return cars.filter((car) => {
      if (searchText) {
        const txt = `${car.brand || ""} ${car.model || ""}`.toLowerCase();
        if (!txt.includes(searchText)) return false;
      }
      if (fuel && car.fuel !== fuel) return false;
      if (gearbox && car.gearbox !== gearbox) return false;
      if (status && car.status !== status) return false;
      if (pf != null && (car.price == null || Number(car.price) < pf)) return false;
      if (pt != null && (car.price == null || Number(car.price) > pt)) return false;
      if (yf != null && (car.year == null || Number(car.year) < yf)) return false;
      if (yt != null && (car.year == null || Number(car.year) > yt)) return false;
      return true;
    });
  }, [cars, filters]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      <section className="page-hero">
        <div className="site-container" style={{ padding: "42px 0" }}>
          <h1 className="section-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="brand-mark" style={{ width: 38, height: 38 }}>TA</span>
            Каталог
          </h1>
          <p className="section-subtitle">Разгледайте нашите предложения</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="site-container">
          <Filters value={filters} onChange={updateFilter} onClear={() => setFilters(initialFilters)} />

          <p style={{ margin: "18px 0 14px", fontSize: 16, color: "#2d4468" }}>
            Намерени: {filtered.length} автомобила
          </p>

          {loading ? <p className="muted">Зареждане...</p> : null}
          {!loading && filtered.length === 0 ? <p className="muted">Няма автомобили по зададените критерии.</p> : null}

          <div className="cars-grid">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
