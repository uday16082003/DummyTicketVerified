"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TESTIMONIALS,
  type Testimonial,
  type TestimonialIcon,
} from "@/constants/testimonials";

const SLIDE_INTERVAL_MS = 3000;
const CARDS_PER_SLIDE = 2;

function CardIcon({ type }: { type: TestimonialIcon }) {
  switch (type) {
    case "visa":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "flight":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      );
    case "support":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      );
    case "combo":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 21h18M6 21V9l6-3 6 3v12" />
          <path d="M10 14h4M12 12v4" />
        </svg>
      );
    case "embassy":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M9 15l2 2 4-4" />
        </svg>
      );
    case "repeat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M17 1l4 4-4 4" />
          <path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4" />
          <path d="M21 13v2a4 4 0 01-4 4H3" />
        </svg>
      );
  }
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="reviews-card__stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.26 5.06 16.7l.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ item }: { item: Testimonial }) {
  return (
    <article className="reviews-card">
      <div className="reviews-card__glow" aria-hidden="true" />
      <div className="reviews-card__watermark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.17 6A5.001 5.001 0 002 11c0 2.05 1.28 3.81 3.08 4.52L4 20h4.5l1.17-4.34A5.09 5.09 0 0012 16a5 5 0 100-10H7.17zM17.17 6A5.001 5.001 0 0012 11c0 2.05 1.28 3.81 3.08 4.52L14 20h4.5l1.17-4.34A5.09 5.09 0 0022 16a5 5 0 100-10h-4.83z" />
        </svg>
      </div>

      <header className="reviews-card__head">
        <div className="reviews-card__icon-badge">
          <CardIcon type={item.icon} />
        </div>
        <div className="reviews-card__head-right">
          <span className="reviews-card__tag">{item.tag}</span>
          <div className="reviews-card__rating-row">
            <StarRow rating={item.rating} />
            <span className="reviews-card__verified">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Verified
            </span>
          </div>
        </div>
      </header>

      <blockquote className="reviews-card__quote">&ldquo;{item.quote}&rdquo;</blockquote>

      <footer className="reviews-card__footer">
        <div className="reviews-card__avatar-ring">
          <div className="reviews-card__avatar" aria-hidden="true">
            {item.name.charAt(0)}
          </div>
        </div>
        <div className="reviews-card__author">
          <cite className="reviews-card__name">{item.name}</cite>
          <span className="reviews-card__location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {item.location}
          </span>
        </div>
      </footer>
    </article>
  );
}

function buildSlides(items: Testimonial[], perSlide: number) {
  const slides: Testimonial[][] = [];
  for (let i = 0; i < items.length; i += perSlide) {
    slides.push(items.slice(i, i + perSlide));
  }
  return slides;
}

export default function Reviews() {
  const slides = useMemo(() => buildSlides(TESTIMONIALS, CARDS_PER_SLIDE), []);
  const loopSlides = useMemo(
    () => (slides.length > 1 ? [...slides, slides[0]] : slides),
    [slides],
  );

  const [trackIndex, setTrackIndex] = useState(0);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);

  const logicalIndex = trackIndex % slides.length;

  const goToSlide = useCallback((index: number) => {
    setInstant(false);
    setTrackIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setInstant(false);
    setTrackIndex((current) => {
      if (current >= slides.length) return current;
      return current + 1;
    });
  }, [slides.length]);

  const handleTransitionEnd = useCallback(() => {
    if (trackIndex !== slides.length) return;

    setInstant(true);
    setTrackIndex(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setInstant(false));
    });
  }, [trackIndex, slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;

    const timer = window.setInterval(goNext, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, slides.length, goNext]);

  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-heading">
      <div className="container">
        <header className="reviews__header reveal">
          <h2 id="reviews-heading" className="reviews__title">
            Words From Our{" "}
            <span className="reviews__title-accent">Customers</span>
          </h2>
          <p className="reviews__subtitle">Real reviews from verified customers.</p>
        </header>

        <div
          className="reviews__carousel reveal"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="reviews__viewport"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Customer reviews, slide ${logicalIndex + 1} of ${slides.length}`}
          >
            <div
              className={`reviews__track${instant ? " reviews__track--instant" : ""}`}
              style={{ transform: `translateX(-${trackIndex * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {loopSlides.map((pair, slideIndex) => (
                <div
                  key={slideIndex === slides.length ? "clone-first" : `slide-${slideIndex}`}
                  className="reviews__slide"
                >
                  {pair.map((item) => (
                    <ReviewCard key={`${item.id}-${slideIndex}`} item={item} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="reviews__dots" role="tablist" aria-label="Review slides">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                className={`reviews__dot${index === logicalIndex ? " reviews__dot--active" : ""}`}
                aria-selected={index === logicalIndex}
                aria-label={`Show reviews ${index * CARDS_PER_SLIDE + 1} to ${Math.min((index + 1) * CARDS_PER_SLIDE, TESTIMONIALS.length)}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
