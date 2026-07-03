const DELIVERABLES = [
  {
    id: "pdf",
    title: "Embassy-ready PDF",
    text: "Passenger name, flight numbers, route, and dates in a clean itinerary you can print or upload.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    id: "pnr",
    title: "Live PNR code",
    text: "A real booking reference you can verify on the airline’s Manage Booking page before you file.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "delivery",
    title: "Email & WhatsApp",
    text: "Your ticket lands in both inboxes—usually within 10 to 20 minutes after payment.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },
];

const CHECKLIST = [
  "Enter your name exactly as printed on your passport.",
  "Set travel dates that match your visa form, hotel stay, and cover letter.",
  "Pick a logical route—entry city, exit city, and return if the embassy asks for it.",
  "Submit your application soon after ordering so the PNR is still active when reviewed.",
];

export default function OrderPurposeSection() {
  return (
    <section className="order-info" aria-labelledby="order-info-heading">
      <header className="order-info__header reveal">
        <p className="order-info__eyebrow">Order details</p>
        <h2 id="order-info-heading" className="order-info__title">
          What you get with this{" "}
          <span className="order-info__title-accent">flight reservation</span>
        </h2>
        <p className="order-info__lead">
          This page is for completing your booking—not browsing. Use the form above, then
          expect a verifiable dummy ticket with PNR, built for visa and immigration files.
        </p>
      </header>

      <div className="order-info__cards reveal-stagger">
        {DELIVERABLES.map((item) => (
          <article key={item.id} className="order-info__card reveal-stagger__item">
            <span className="order-info__card-icon">{item.icon}</span>
            <h3 className="order-info__card-title">{item.title}</h3>
            <p className="order-info__card-text">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="order-info__panel reveal reveal--delay-2">
        <h3 className="order-info__panel-title">Before you submit the form</h3>
        <ul className="order-info__list">
          {CHECKLIST.map((item) => (
            <li key={item}>
              <span className="order-info__check" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="order-info__note">
          Consulates check that your PNR resolves on the airline website—name, dates, and
          status should line up with the rest of your visa documents.
        </p>
      </div>
    </section>
  );
}
