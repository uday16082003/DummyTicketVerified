import { PRICING_PLANS } from "@/constants/pricing-plans";

export default function Pricing() {
  return (
    <section className="pricing" id="pricing" aria-labelledby="pricing-heading">
      <div className="pricing__glow pricing__glow--left" aria-hidden="true" />
      <div className="pricing__glow pricing__glow--right" aria-hidden="true" />

      <div className="container">
        <header className="pricing__header reveal">
          <h2 id="pricing-heading" className="pricing__title">
            Our Pricing{" "}
            <span className="pricing__title-accent">(Verified &amp; Genuine)</span>
          </h2>
          <p className="pricing__subtitle">
            No hidden fees. One-time payment. Instant delivery.
          </p>
        </header>

        <div className="pricing__grid reveal-stagger">
          {PRICING_PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`pricing-card reveal-stagger__item${plan.featured ? " pricing-card--featured" : ""}`}
            >
              {plan.featured && plan.badge && (
                <div className="pricing-card__badge">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {plan.badge}
                </div>
              )}

              <div className="pricing-card__inner">
                <div className="pricing-card__icon">{plan.icon}</div>

                <h3 className="pricing-card__title">{plan.title}</h3>

                <div className="pricing-card__price-row">
                  <span className="pricing-card__price">{plan.priceUsd}</span>
                  <span className="pricing-card__price-alt">/ {plan.priceInr}</span>
                </div>
                <p className="pricing-card__price-note">One-time payment</p>

                <ul className="pricing-card__features">
                  {plan.features.map((feature) => (
                    <li key={feature} className="pricing-card__feature">
                      <span className="pricing-card__check" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a href="#order" className="pricing-card__cta">
                  Get Started
                  <span className="pricing-card__cta-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
