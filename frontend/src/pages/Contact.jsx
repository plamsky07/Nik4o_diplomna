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
        <div className="site-container contact-hero-wrap">
          <h1 className="section-title">Свържете се с нас</h1>
          <p className="section-subtitle">Готови сме да отговорим на всички ваши въпроси</p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="site-container contact-grid">
          <div>
            <h2 className="section-title contact-page-title">Информация за контакт</h2>

            <article className="surface-card contact-item">
              <span className="feature-icon">T</span>
              <div>
                <h4>Телефон</h4>
                <p>+359 88 888 8888</p>
              </div>
            </article>

            <article className="surface-card contact-item mt-14">
              <span className="feature-icon">@</span>
              <div>
                <h4>Имейл</h4>
                <p>info@tateauto.bg</p>
              </div>
            </article>

            <article className="surface-card contact-item mt-14">
              <span className="feature-icon">Ч</span>
              <div>
                <h4>Работно време</h4>
                <p>Пон-Съб: 09:00 - 18:00 ч.</p>
              </div>
            </article>

            <div className="surface-card contact-map-wrap">
              <h3 className="contact-map-title">Локация</h3>
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps?q=Auto+Haus+Sofia&output=embed"
                width="100%"
                height="300"
                className="contact-map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <InquiryForm source="contact" />
        </div>

        <div className="surface-card contact-faq-wrap">
          <h3 className="contact-faq-title">Често задавани въпроси</h3>
          <div className="contact-faq-list">
            {faqItems.map((item) => (
              <details key={item.q} className="surface-card contact-faq-item">
                <summary className="contact-faq-question">{item.q}</summary>
                <p className="contact-faq-answer">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
