"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { BookingMode, TripType } from "@/types/order";

const BOOKING_MODES: {
  value: BookingMode;
  label: string;
  icon: ReactNode;
}[] = [
  {
    value: "flight",
    label: "Flight Ticket",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    ),
  },
  {
    value: "hotel",
    label: "Hotel Booking",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" strokeLinecap="round" />
        <path d="M4 21V9h16v12" />
      </svg>
    ),
  },
  {
    value: "flight-hotel",
    label: "Flight + Hotel",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
  { value: "multi-trip", label: "Multi Trip" },
];

const SUBMIT_PRICES: Record<
  BookingMode,
  { label: string; inr: string; usd: string }
> = {
  flight: { label: "Book Ticket", inr: "₹500", usd: "$6" },
  hotel: { label: "Book Hotel", inr: "₹300", usd: "$4" },
  "flight-hotel": { label: "Book Package", inr: "₹700", usd: "$8" },
};

export default function BookingForm() {
  const [bookingMode, setBookingMode] = useState<BookingMode>("flight");
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const showFlightFields = bookingMode === "flight" || bookingMode === "flight-hotel";
  const showHotelFields = bookingMode === "hotel" || bookingMode === "flight-hotel";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      bookingMode,
      tripType: showFlightFields ? tripType : undefined,
      from: showFlightFields ? String(formData.get("from") ?? "") : undefined,
      to: showFlightFields ? String(formData.get("to") ?? "") : undefined,
      departure: showFlightFields ? String(formData.get("departure") ?? "") : undefined,
      returnDate:
        showFlightFields && tripType === "round-trip"
          ? String(formData.get("return") ?? "")
          : undefined,
      city: showHotelFields && bookingMode === "hotel" ? String(formData.get("city") ?? "") : undefined,
      checkIn: showHotelFields ? String(formData.get("checkIn") ?? "") : undefined,
      checkOut: showHotelFields ? String(formData.get("checkOut") ?? "") : undefined,
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message ?? "Unable to submit order");
      }

      setStatus("success");
      setFeedback(result.message ?? "Order submitted! Check your email for confirmation.");
      form.reset();
      setBookingMode("flight");
      setTripType("one-way");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="preview-window">
      <div className="preview-window__bar">
        <div className="preview-window__traffic" aria-hidden="true">
          <span className="preview-window__dot preview-window__dot--close" />
          <span className="preview-window__dot preview-window__dot--min" />
          <span className="preview-window__dot preview-window__dot--max" />
        </div>
        <div className="preview-window__url">
          <span className="preview-window__url-lock" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
            </svg>
          </span>
          <span className="preview-window__url-text">
            <span className="preview-window__url-host">booking.dummyticketverified.com</span>
            <span className="preview-window__url-path">/order</span>
          </span>
        </div>
        <span className="preview-window__badge">
          <span className="preview-window__badge-dot" aria-hidden="true" />
          Legal
        </span>
      </div>

      <form
        id="order"
        className="booking-form"
        onSubmit={handleSubmit}
      >
        <fieldset className="booking-form__modes">
          <legend className="sr-only">Booking type</legend>
          {BOOKING_MODES.map((mode) => (
            <label key={mode.value} className="booking-form__mode">
              <input
                type="radio"
                name="bookingMode"
                value={mode.value}
                checked={bookingMode === mode.value}
                onChange={() => setBookingMode(mode.value)}
              />
              <span>
                <span className="booking-form__mode-icon">{mode.icon}</span>
                <span className="booking-form__mode-label">{mode.label}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {showFlightFields && (
          <fieldset className="booking-form__trip">
            <legend className="sr-only">Trip type</legend>
            {TRIP_TYPES.map((type) => (
              <label key={type.value} className="booking-form__trip-option">
                <input
                  type="radio"
                  name="tripType"
                  value={type.value}
                  checked={tripType === type.value}
                  onChange={() => setTripType(type.value)}
                />
                <span>{type.label}</span>
              </label>
            ))}
          </fieldset>
        )}

        <div className="booking-form__fields">
          <div className="booking-form__row">
            <label className="booking-form__field booking-form__field--full">
              <span className="booking-form__label">Full name</span>
              <input
                type="text"
                name="fullName"
                placeholder="As on passport"
                autoComplete="name"
                required
              />
            </label>
          </div>

          <div className="booking-form__row">
            <label className="booking-form__field">
              <span className="booking-form__label">Email</span>
              <input
                type="email"
                name="email"
                placeholder="you@email.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="booking-form__field">
              <span className="booking-form__label">WhatsApp / Phone</span>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                required
              />
            </label>
          </div>

          {showFlightFields && (
            <>
              <div className="booking-form__row">
                <label className="booking-form__field">
                  <span className="booking-form__label">From</span>
                  <input
                    type="text"
                    name="from"
                    placeholder="e.g. New Delhi (DEL)"
                    autoComplete="off"
                    required
                  />
                </label>

                <label className="booking-form__field">
                  <span className="booking-form__label">To</span>
                  <input
                    type="text"
                    name="to"
                    placeholder="e.g. Dubai (DXB)"
                    autoComplete="off"
                    required
                  />
                </label>
              </div>

              <div className="booking-form__row">
                <label
                  className={`booking-form__field${tripType !== "round-trip" ? " booking-form__field--full" : ""}`}
                >
                  <span className="booking-form__label">Departure</span>
                  <input type="date" name="departure" required />
                </label>

                {tripType === "round-trip" && (
                  <label className="booking-form__field">
                    <span className="booking-form__label">Return</span>
                    <input type="date" name="return" required />
                  </label>
                )}
              </div>

              {tripType === "multi-trip" && (
                <p className="booking-form__note">
                  Add up to 2 flights — our team will confirm routes after you submit.
                </p>
              )}
            </>
          )}

          {showHotelFields && (
            <>
              {bookingMode === "hotel" && (
                <label className="booking-form__field booking-form__field--full">
                  <span className="booking-form__label">City</span>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Dubai, UAE"
                    autoComplete="off"
                    required
                  />
                </label>
              )}

              <div className="booking-form__row">
                <label className="booking-form__field">
                  <span className="booking-form__label">Check-in</span>
                  <input type="date" name="checkIn" required />
                </label>

                <label className="booking-form__field">
                  <span className="booking-form__label">Check-out</span>
                  <input type="date" name="checkOut" required />
                </label>
              </div>

              {bookingMode === "flight-hotel" && (
                <p className="booking-form__note">
                  Hotel dates can match your flight itinerary — we&apos;ll align both on your confirmation.
                </p>
              )}
            </>
          )}
        </div>

        {feedback && (
          <p
            className={`booking-form__status booking-form__status--${status === "success" ? "success" : "error"}`}
            role="status"
          >
            {feedback}
          </p>
        )}

        <button type="submit" className="booking-form__submit" disabled={status === "loading"}>
          <span className="booking-form__submit-text">
            {status === "loading"
              ? "Sending order..."
              : (
                <>
                  {SUBMIT_PRICES[bookingMode].label}
                  <span className="booking-form__submit-sep" aria-hidden="true">
                    {" "}
                    ·{" "}
                  </span>
                  {SUBMIT_PRICES[bookingMode].inr} / {SUBMIT_PRICES[bookingMode].usd}
                  <span className="booking-form__submit-arrow" aria-hidden="true">→</span>
                </>
              )}
          </span>
        </button>
      </form>
    </div>
  );
}
