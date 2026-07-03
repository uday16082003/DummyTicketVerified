import { CTA_CONTACT } from "@/constants/cta-assets";

export default function CtaBanner() {
  return (
    <section className="cta-banner" aria-labelledby="cta-heading">
      <div className="container">
        <div className="cta-banner__card reveal">
          <div className="cta-banner__backdrop" aria-hidden="true">
            <div className="cta-banner__orb cta-banner__orb--1" />
            <div className="cta-banner__orb cta-banner__orb--2" />
            <div className="cta-banner__grid" />
            <svg className="cta-banner__wave" viewBox="0 0 400 120" preserveAspectRatio="none">
              <path
                d="M0 60 C80 20 120 100 200 60 S320 20 400 60 L400 120 L0 120 Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="cta-banner__body">
            <div className="cta-banner__content">
              <p className="cta-banner__eyebrow">
                <span className="cta-banner__eyebrow-dot" aria-hidden="true" />
                Instant delivery · Verifiable PNR
              </p>

              <h2 id="cta-heading" className="cta-banner__title">
                Get Your{" "}
                <span className="cta-banner__title-accent">Flight Reservation</span>{" "}
                Today
              </h2>

              <p className="cta-banner__subtitle">
                Embassy-ready dummy tickets and hotel reservations — delivered to your inbox
                in minutes.
              </p>

              <div className="cta-banner__actions">
                <a href="#order" className="cta-banner__cta">
                  Buy Now
                  <span className="cta-banner__cta-arrow" aria-hidden="true">
                    →
                  </span>
                </a>

                <div className="cta-banner__contact">
                  <span className="cta-banner__contact-label">Get in touch</span>
                  <div className="cta-banner__contact-links">
                    <a
                      href={`mailto:${CTA_CONTACT.email}`}
                      className="cta-banner__contact-item"
                    >
                      <span className="cta-banner__contact-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <path d="M22 6l-10 7L2 6" />
                        </svg>
                      </span>
                      {CTA_CONTACT.email}
                    </a>
                    <a
                      href={`tel:${CTA_CONTACT.phone}`}
                      className="cta-banner__contact-item"
                    >
                      <span className="cta-banner__contact-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                        </svg>
                      </span>
                      {CTA_CONTACT.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
