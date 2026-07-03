const FEATURES = [
  {
    id: "delivery",
    variant: "cyan",
    stat: "10-20",
    statUnit: "minutes",
    title: "Quick Delivery",
    description: "Get your verified dummy ticket by email and WhatsApp within minutes.",
    backDetail: "Average delivery in 12 minutes. Sent instantly after payment — no waiting.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    id: "ratings",
    variant: "green",
    stat: "4.9",
    statUnit: "★ rating",
    title: "Top Rated",
    description: "Trusted by 500+ travelers on Trustpilot for visa-ready reservations.",
    backDetail: "500+ verified reviews. Embassy-friendly format accepted across Schengen, UK, and US visas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "pnr",
    variant: "purple",
    stat: "Live",
    statUnit: "PNR",
    title: "Verifiable PNR",
    description: "Check your reservation on the official airline website anytime.",
    backDetail: "Real airline PNR on official GDS. Check it live on the airline website for up to 7 days.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M9 15l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "support",
    variant: "pink",
    stat: "24/7",
    statUnit: "support",
    title: "Always Available",
    description: "WhatsApp and email help from real humans, day or night.",
    backDetail: "Human support on WhatsApp — replies in under 5 minutes. No bots, no waiting queues.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section className="features" id="features" aria-labelledby="features-heading">
      <div className="container">
        <header className="features__header reveal">
          <h2 id="features-heading" className="features__title">
            Why choose{" "}
            <span className="features__title-accent">Dummy Ticket Verified?</span>
          </h2>
          <p className="features__subtitle">
            Professional, embassy-friendly reservations built for real visa paperwork.
          </p>
        </header>

        <div className="features__grid reveal-stagger">
          {FEATURES.map((feature) => (
            <article
              key={feature.id}
              className={`feature-flip feature-flip--${feature.variant} reveal-stagger__item`}
            >
              <div className="feature-flip__content">
                <div className="feature-flip__face feature-flip__face--front">
                  <div className="feature-flip__icon">{feature.icon}</div>
                  <p className="feature-flip__stat">
                    {feature.stat}
                    <span className="feature-flip__stat-unit">{feature.statUnit}</span>
                  </p>
                  <h3 className="feature-flip__title">{feature.title}</h3>
                  <p className="feature-flip__desc">{feature.description}</p>
                </div>

                <div className="feature-flip__face feature-flip__face--back">
                  <div className="feature-flip__back-inner">
                    <div className="feature-flip__back-icon">{feature.icon}</div>
                    <p className="feature-flip__back-stat">
                      {feature.stat}{" "}
                      <span className="feature-flip__stat-unit">{feature.statUnit}</span>
                    </p>
                    <p className="feature-flip__back-detail">{feature.backDetail}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
