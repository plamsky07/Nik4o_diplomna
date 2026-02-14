export default function Footer() {
  return (
    <>
      <section className="cta-band">
        <div className="site-container">
          <h2 className="section-title" style={{ fontSize: "34px" }}>
            Имате въпроси?
          </h2>
          <p className="section-subtitle" style={{ color: "#dfeaff", fontSize: 14 }}>
            Свържете се с нас и ще ви помогнем да намерите подходящия автомобил.
          </p>
          <div style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn btn-soft" href="tel:+359888888888">
              +359 88 888 888
            </a>
            <span className="btn btn-soft">гр. Пловдив</span>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-container site-footer-row">
          <div className="brand" style={{ fontSize: "22px" }}>
            <span className="brand-mark">TA</span>
            <span>TateAuto</span>
          </div>
          <div>© 2026 TateAuto. Всички права запазени.</div>
        </div>
      </footer>
    </>
  );
}
