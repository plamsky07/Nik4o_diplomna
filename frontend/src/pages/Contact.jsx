import InquiryForm from "../components/InquiryForm";

const faqItems = [
  {
    q: "Какъв е срокът за отговор?",
    a: "Обикновено отговаряме в рамките на същия работен ден.",
  },
  {
    q: "Мога ли да запазя автомобил?",
    a: "Да, при потвърждение от екипа и оставен депозит.",
  },
  {
    q: "Предлагате ли съдействие за регистрация?",
    a: "Да, можем да съдействаме с документи и регистрация.",
  },
  {
    q: "Имате ли test drive?",
    a: "Да, с предварителна уговорка по телефон или през формата.",
  },
];

export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="site-container" style={{ padding: "52px 0" }}>
          <h1 className="section-title">Свържете се с нас</h1>
          <p className="section-subtitle">Готови сме да отговорим на всички ваши въпроси</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 42 }}>
        <div className="site-container contact-grid">
          <div>
            <h2 className="section-title" style={{ fontSize: "54px", marginBottom: 20 }}>
              Информация за контакт
            </h2>

            <article className="surface-card contact-item">
              <span className="feature-icon">T</span>
              <div>
                <h4>Телефон</h4>
                <p>+359 88 888 8888</p>
              </div>
            </article>

            <article className="surface-card contact-item" style={{ marginTop: 14 }}>
              <span className="feature-icon">@</span>
              <div>
                <h4>Имейл</h4>
                <p>info@tateauto.bg</p>
              </div>
            </article>

            <article className="surface-card contact-item" style={{ marginTop: 14 }}>
              <span className="feature-icon">Ч</span>
              <div>
                <h4>Работно време</h4>
                <p>Пон-Съб: 09:00 - 18:00 ч.</p>
              </div>
            </article>

            <div className="surface-card" style={{ marginTop: 16, padding: 12 }}>
              <h3 style={{ margin: "4px 6px 10px", fontSize: 28 }}>Локация</h3>
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps?q=Auto+Haus+Sofia&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: 12 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <InquiryForm source="contact" />
        </div>

        <div className="surface-card" style={{ marginTop: 26, padding: 22 }}>
          <h3 style={{ marginTop: 0, fontSize: 36 }}>Често задавани въпроси</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {faqItems.map((item) => (
              <details key={item.q} className="surface-card" style={{ padding: 14, boxShadow: "none" }}>
                <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 24 }}>{item.q}</summary>
                <p style={{ margin: "10px 0 0", color: "#4f678a", fontSize: 22 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
