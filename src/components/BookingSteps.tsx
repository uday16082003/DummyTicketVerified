import { BOOKING_STEPS } from "@/constants/booking-steps";

export default function BookingSteps() {
  return (
    <section className="booking-steps" id="booking-process" aria-labelledby="booking-steps-heading">
      <div className="container">
        <header className="booking-steps__header reveal">
          <h2 id="booking-steps-heading" className="booking-steps__title">
            Booking{" "}
            <span className="booking-steps__title-accent">Process</span>
          </h2>
          <p className="booking-steps__subtitle">
            Three clear steps from request to a document you can submit to embassies or show at
            check-in.
          </p>
        </header>

        <div className="booking-steps__track reveal-stagger">
          <div className="booking-steps__line" aria-hidden="true" />

          {BOOKING_STEPS.map((item) => (
            <article key={item.id} className="booking-steps__card reveal-stagger__item">
              <div className="booking-steps__icon-wrap">
                <div className="booking-steps__icon">{item.icon}</div>
              </div>
              <p className="booking-steps__step">Step {item.step}</p>
              <h3 className="booking-steps__card-title">{item.title}</h3>
              <p className="booking-steps__card-desc">{item.description}</p>
            </article>
          ))}
        </div>

        <footer className="booking-steps__footer reveal reveal--delay-2">
          <a href="#order" className="btn btn--booking booking-steps__cta">
            Start your booking
            <span className="booking-steps__cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <p className="booking-steps__footer-note">
            Confirmed dummy flight ticket in your inbox, ready for visa use.
          </p>
        </footer>
      </div>
    </section>
  );
}
