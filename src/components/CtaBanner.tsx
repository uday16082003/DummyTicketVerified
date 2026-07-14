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
                <a href="/order" className="cta-banner__cta">
                  Buy Now
                  <span className="cta-banner__cta-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
                <a
                  href={CTA_CONTACT.whatsappUrl}
                  className="cta-banner__whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="cta-banner__whatsapp-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  Enquiry Now on WhatsApp
                </a>
                <p className="cta-banner__secure">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Your data is 100% secure • No spam, ever
                </p>
              </div>
            </div>

            <aside className="cta-banner__aside" aria-label="Contact information">
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
                    <span className="cta-banner__contact-text">{CTA_CONTACT.email}</span>
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
                    <span className="cta-banner__contact-text">{CTA_CONTACT.phoneDisplay}</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
