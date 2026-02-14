export default function Filters({ value, onChange, onClear }) {
  return (
    <div className="surface-card filter-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 32 }}>Филтри</h3>
        <button type="button" className="btn btn-light" onClick={onClear}>
          Изчисти филтри
        </button>
      </div>

      <div className="filter-grid">
        <input
          className="field"
          placeholder="Търсене по марка или модел..."
          value={value.search}
          onChange={(e) => onChange("search", e.target.value)}
        />
        <select className="field" value={value.fuel} onChange={(e) => onChange("fuel", e.target.value)}>
          <option value="">Всички горива</option>
          <option value="бензин">Бензин</option>
          <option value="дизел">Дизел</option>
          <option value="хибрид">Хибрид</option>
          <option value="електрически">Електрически</option>
        </select>
        <select className="field" value={value.gearbox} onChange={(e) => onChange("gearbox", e.target.value)}>
          <option value="">Всички скорости</option>
          <option value="ръчна">Ръчна</option>
          <option value="автомат">Автомат</option>
        </select>
        <select className="field" value={value.status} onChange={(e) => onChange("status", e.target.value)}>
          <option value="">Всички статуси</option>
          <option value="наличен">Наличен</option>
          <option value="резервиран">Резервиран</option>
          <option value="продаден">Продаден</option>
        </select>
        <input
          className="field"
          placeholder="Мин. цена"
          inputMode="numeric"
          value={value.priceFrom}
          onChange={(e) => onChange("priceFrom", e.target.value)}
        />
      </div>

      <div className="filter-grid">
        <input
          className="field"
          placeholder="Макс. цена"
          inputMode="numeric"
          value={value.priceTo}
          onChange={(e) => onChange("priceTo", e.target.value)}
        />
        <input
          className="field"
          placeholder="Година от"
          inputMode="numeric"
          value={value.yearFrom}
          onChange={(e) => onChange("yearFrom", e.target.value)}
        />
        <input
          className="field"
          placeholder="Година до"
          inputMode="numeric"
          value={value.yearTo}
          onChange={(e) => onChange("yearTo", e.target.value)}
        />
        <div />
        <div />
      </div>
    </div>
  );
}
