import type { CSSProperties } from "react";
import Image from "next/image";
import { SAMPLE_TICKETS } from "@/constants/sample-tickets";

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="samples" aria-labelledby="samples-heading">
      <div className="container">
        <header className="how-it-works__header reveal">
          <h2 id="samples-heading" className="how-it-works__title">
            Sample{" "}
            <span className="how-it-works__title-accent">Tickets</span>
          </h2>
          <p className="how-it-works__subtitle">
            Preview real watermarked samples — same layout you get on delivery, with the
            preview watermark removed when you order.
          </p>
        </header>

        <div className="how-it-works__grid reveal-stagger">
          {SAMPLE_TICKETS.map((ticket) => {
            const cardStyle = {
              "--sample-accent": ticket.accent,
              "--sample-bg-position": ticket.bgPosition,
              ...(ticket.planeImage
                ? { "--sample-plane-image": `url("${ticket.planeImage}")` }
                : {}),
            } as CSSProperties;

            const cardClassName = `sample-card sample-card--${ticket.id} reveal-stagger__item${
              ticket.pdfHref ? " sample-card--link" : ""
            }`;

            const cardContent = (
              <>
                <div className="sample-card__header">
                  {ticket.logo.endsWith(".svg") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ticket.logo}
                      alt={`${ticket.name} logo`}
                      className="sample-card__logo"
                    />
                  ) : (
                    <Image
                      src={ticket.logo}
                      alt={`${ticket.name} logo`}
                      width={280}
                      height={120}
                      className="sample-card__logo"
                    />
                  )}
                </div>

                <div className="sample-card__plane">
                  <div
                    className={`sample-card__plane-bg${ticket.planeImage ? " sample-card__plane-bg--custom" : ""}`}
                    aria-hidden="true"
                  />
                  <div className="sample-card__plane-overlay" aria-hidden="true" />
                  {ticket.pdfHref ? (
                    <span className="sample-card__cta" aria-hidden="true">
                      Open PDF
                    </span>
                  ) : (
                    <span
                      className="sample-card__cta sample-card__cta--disabled"
                      aria-hidden="true"
                    >
                      Sample coming soon
                    </span>
                  )}
                </div>
              </>
            );

            if (ticket.pdfHref) {
              return (
                <a
                  key={ticket.id}
                  href={ticket.pdfHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                  style={cardStyle}
                  aria-label={`Open ${ticket.name} sample PDF`}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <article key={ticket.id} className={cardClassName} style={cardStyle}>
                {cardContent}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
