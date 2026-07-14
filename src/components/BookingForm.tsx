"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  BOOKING_BASE_PRICES,
  NATIONALITIES,
  PASSENGER_TITLES,
  PHONE_COUNTRY_CODES,
  calculateBookingTotal,
  formatMoney,
} from "@/constants/booking-form";
import type {
  BookingMode,
  OrderApiResponse,
  PassengerTitle,
  TripType,
} from "@/types/order";

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
  { value: "multi-trip", label: "Multi-City" },
];

type PassengerFormState = {
  title: PassengerTitle;
  firstName: string;
  lastName: string;
  nationality: string;
};

function createPassenger(): PassengerFormState {
  return { title: "Mr", firstName: "", lastName: "", nationality: "" };
}

function FieldIcon({ children }: { children: ReactNode }) {
  return <span className="booking-form__input-icon">{children}</span>;
}

export default function BookingForm() {
  const router = useRouter();
  const [bookingMode, setBookingMode] = useState<BookingMode>("flight");
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [passengers, setPassengers] = useState<PassengerFormState[]>([createPassenger()]);
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [includeHotel, setIncludeHotel] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const showFlightFields = bookingMode === "flight" || bookingMode === "flight-hotel";
  const showHotelFields =
    bookingMode === "hotel" ||
    bookingMode === "flight-hotel" ||
    (bookingMode === "flight" && includeHotel);
  const showHotelToggle = bookingMode === "flight";

  const pricing = useMemo(
    () => calculateBookingTotal(bookingMode, passengers.length, includeHotel),
    [bookingMode, passengers.length, includeHotel]
  );

  const basePrice = BOOKING_BASE_PRICES[bookingMode];

  function updatePassenger(index: number, patch: Partial<PassengerFormState>) {
    setPassengers((current) =>
      current.map((passenger, i) => (i === index ? { ...passenger, ...patch } : passenger))
    );
  }

  function addPassenger() {
    setPassengers((current) => [...current, createPassenger()]);
  }

  function removePassenger(index: number) {
    if (passengers.length <= 1) return;
    setPassengers((current) => current.filter((_, i) => i !== index));
  }

  function handleBookingModeChange(mode: BookingMode) {
    setBookingMode(mode);
    if (mode !== "flight") {
      setIncludeHotel(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      email: email.trim(),
      phone: phone.trim(),
      phoneCountryCode,
      passengers,
      bookingMode,
      tripType: showFlightFields ? tripType : undefined,
      includeHotel: bookingMode === "flight" ? includeHotel : undefined,
      from: showFlightFields ? String(formData.get("from") ?? "").trim() : undefined,
      to: showFlightFields ? String(formData.get("to") ?? "").trim() : undefined,
      departure: showFlightFields ? String(formData.get("departure") ?? "") : undefined,
      returnDate:
        showFlightFields && tripType === "round-trip"
          ? String(formData.get("return") ?? "")
          : undefined,
      city: showHotelFields ? String(formData.get("city") ?? "").trim() : undefined,
      checkIn: showHotelFields ? String(formData.get("checkIn") ?? "") : undefined,
      checkOut: showHotelFields ? String(formData.get("checkOut") ?? "") : undefined,
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as OrderApiResponse;

      if (!response.ok || !result.ok || !result.orderId) {
        throw new Error(result.message ?? "Unable to submit order");
      }

      form.reset();
      setBookingMode("flight");
      setTripType("one-way");
      setPassengers([createPassenger()]);
      setEmail("");
      setPhoneCountryCode("+91");
      setPhone("");
      setIncludeHotel(false);

      const params = new URLSearchParams({
        orderId: result.orderId,
        email: payload.email,
      });
      if (result.emailSent === false) {
        params.set("emailSent", "0");
      }
      router.push(`/order/confirmation?${params.toString()}`);
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

      <form id="order" className="booking-form" onSubmit={handleSubmit}>
        <fieldset className="booking-form__modes">
          <legend className="sr-only">Booking type</legend>
          {BOOKING_MODES.map((mode) => (
            <label key={mode.value} className="booking-form__mode">
              <input
                type="radio"
                name="bookingMode"
                value={mode.value}
                checked={bookingMode === mode.value}
                onChange={() => handleBookingModeChange(mode.value)}
              />
              <span>
                <span className="booking-form__mode-icon">{mode.icon}</span>
                <span className="booking-form__mode-label">{mode.label}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {showFlightFields && (
          <div className="booking-form__section">
            <h3 className="booking-form__section-title">Trip Type</h3>
            <fieldset className="booking-form__trip">
              <legend className="sr-only">Trip type</legend>
              {TRIP_TYPES.map((type) => (
                <label key={type.value} className="booking-form__trip-option">
                  <input
                    type="radio"
                    name="tripTypeUi"
                    value={type.value}
                    checked={tripType === type.value}
                    onChange={() => setTripType(type.value)}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </fieldset>
          </div>
        )}

        <div className="booking-form__section">
          <div className="booking-form__section-header">
            <h3 className="booking-form__section-title">
              Passengers ({passengers.length})
            </h3>
            <button
              type="button"
              className="booking-form__section-action"
              onClick={addPassenger}
            >
              + Add Passenger
            </button>
          </div>

          <div className="booking-form__passengers">
            {passengers.map((passenger, index) => (
              <div key={`passenger-${index}`} className="booking-form__passenger-card">
                <div className="booking-form__passenger-card-head">
                  <p className="booking-form__passenger-card-title">
                    {index === 0 ? "Primary Passenger" : `Passenger ${index + 1}`}
                  </p>
                  {index > 0 && (
                    <button
                      type="button"
                      className="booking-form__passenger-remove"
                      onClick={() => removePassenger(index)}
                      aria-label={`Remove passenger ${index + 1}`}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="booking-form__field">
                  <span className="booking-form__label">Title</span>
                  <div className="booking-form__titles" role="group" aria-label="Passenger title">
                    {PASSENGER_TITLES.map((title) => (
                      <label key={title} className="booking-form__title-option">
                        <input
                          type="radio"
                          name={`passenger-title-${index}`}
                          value={title}
                          checked={passenger.title === title}
                          onChange={() => updatePassenger(index, { title })}
                        />
                        <span>{title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="booking-form__row">
                  <label className="booking-form__field">
                    <span className="booking-form__label">First Name</span>
                    <span className="booking-form__input-wrap">
                      <FieldIcon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </FieldIcon>
                      <input
                        type="text"
                        value={passenger.firstName}
                        onChange={(event) =>
                          updatePassenger(index, { firstName: event.target.value })
                        }
                        placeholder="First Name"
                        autoComplete={index === 0 ? "given-name" : "off"}
                        required
                      />
                    </span>
                  </label>

                  <label className="booking-form__field">
                    <span className="booking-form__label">Last Name</span>
                    <span className="booking-form__input-wrap">
                      <FieldIcon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </FieldIcon>
                      <input
                        type="text"
                        value={passenger.lastName}
                        onChange={(event) =>
                          updatePassenger(index, { lastName: event.target.value })
                        }
                        placeholder="Last Name"
                        autoComplete={index === 0 ? "family-name" : "off"}
                        required
                      />
                    </span>
                  </label>
                </div>

                <label className="booking-form__field booking-form__field--full">
                  <span className="booking-form__label">Nationality</span>
                  <span className="booking-form__input-wrap">
                    <FieldIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" />
                      </svg>
                    </FieldIcon>
                    <select
                      value={passenger.nationality}
                      onChange={(event) =>
                        updatePassenger(index, { nationality: event.target.value })
                      }
                      required
                    >
                      <option value="">Nationality (as on passport)</option>
                      {NATIONALITIES.map((nationality) => (
                        <option key={nationality} value={nationality}>
                          {nationality}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
              </div>
            ))}

            <button type="button" className="booking-form__add-passenger" onClick={addPassenger}>
              <span aria-hidden="true">+</span>
              Add Another Passenger ({formatMoney(basePrice.inr, basePrice.usd)} per person)
            </button>
          </div>
        </div>

        <div className="booking-form__section">
          <h3 className="booking-form__section-title">Contact Details</h3>
          <div className="booking-form__fields">
            <label className="booking-form__field booking-form__field--full">
              <span className="booking-form__label">Email Address</span>
              <span className="booking-form__input-wrap">
                <FieldIcon>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </FieldIcon>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email Address"
                  autoComplete="email"
                  required
                />
              </span>
            </label>

            <div className="booking-form__field booking-form__field--full">
              <span className="booking-form__label">WhatsApp / Phone</span>
              <div className="booking-form__phone-row">
                <label className="booking-form__country-select-wrap">
                  <span className="sr-only">Country code</span>
                  <select
                    value={phoneCountryCode}
                    onChange={(event) => setPhoneCountryCode(event.target.value)}
                    className="booking-form__country-select"
                  >
                    {PHONE_COUNTRY_CODES.map((entry) => (
                      <option key={`${entry.label}-${entry.code}`} value={entry.code}>
                        {entry.label} {entry.code}
                      </option>
                    ))}
                  </select>
                </label>
                <span className="booking-form__input-wrap booking-form__input-wrap--phone">
                  <FieldIcon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </FieldIcon>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="WhatsApp / phone number"
                    autoComplete="tel-national"
                    required
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        {showFlightFields && (
          <div className="booking-form__section">
            <div className="booking-form__section-header">
              <h3 className="booking-form__section-title">Flight Details</h3>
              {showHotelToggle && (
                <button
                  type="button"
                  className={`booking-form__inline-action${includeHotel ? " booking-form__inline-action--active" : ""}`}
                  onClick={() => setIncludeHotel((current) => !current)}
                  aria-pressed={includeHotel}
                >
                  {includeHotel ? "Remove Hotel" : "Add Hotel"}
                </button>
              )}
            </div>

            <div className="booking-form__fields">
              <div className="booking-form__row">
                <label className="booking-form__field">
                  <span className="booking-form__label">From</span>
                  <span className="booking-form__input-wrap">
                    <FieldIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </FieldIcon>
                    <input
                      type="text"
                      name="from"
                      placeholder="From (City)"
                      autoComplete="off"
                      required
                    />
                  </span>
                </label>

                <label className="booking-form__field">
                  <span className="booking-form__label">To</span>
                  <span className="booking-form__input-wrap">
                    <FieldIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </FieldIcon>
                    <input
                      type="text"
                      name="to"
                      placeholder="To (City)"
                      autoComplete="off"
                      required
                    />
                  </span>
                </label>
              </div>

              <div className="booking-form__row">
                <label
                  className={`booking-form__field${tripType !== "round-trip" ? " booking-form__field--full" : ""}`}
                >
                  <span className="booking-form__label">Departure</span>
                  <span className="booking-form__input-wrap">
                    <FieldIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </FieldIcon>
                    <input type="date" name="departure" required />
                  </span>
                </label>

                {tripType === "round-trip" && (
                  <label className="booking-form__field">
                    <span className="booking-form__label">Return</span>
                    <span className="booking-form__input-wrap">
                      <FieldIcon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </FieldIcon>
                      <input type="date" name="return" required />
                    </span>
                  </label>
                )}
              </div>

              {tripType === "multi-trip" && (
                <p className="booking-form__note">
                  Add up to 2 flights — our team will confirm routes after you submit.
                </p>
              )}
            </div>
          </div>
        )}

        {showHotelFields && (
          <div className="booking-form__section">
            <h3 className="booking-form__section-title">Hotel Details</h3>
            <div className="booking-form__fields">
              <label className="booking-form__field booking-form__field--full">
                <span className="booking-form__label">City</span>
                <span className="booking-form__input-wrap">
                  <FieldIcon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </FieldIcon>
                  <input
                    type="text"
                    name="city"
                    placeholder="City (e.g. Dubai, UAE)"
                    autoComplete="off"
                    required
                  />
                </span>
              </label>

              <div className="booking-form__row">
                <label className="booking-form__field">
                  <span className="booking-form__label">Check-in</span>
                  <span className="booking-form__input-wrap">
                    <FieldIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </FieldIcon>
                    <input type="date" name="checkIn" required />
                  </span>
                </label>

                <label className="booking-form__field">
                  <span className="booking-form__label">Check-out</span>
                  <span className="booking-form__input-wrap">
                    <FieldIcon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </FieldIcon>
                    <input type="date" name="checkOut" required />
                  </span>
                </label>
              </div>

              {bookingMode === "flight-hotel" && (
                <p className="booking-form__note">
                  Hotel dates can match your flight itinerary — we&apos;ll align both on your confirmation.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="booking-form__summary" aria-live="polite">
          <div className="booking-form__summary-col">
            <span className="booking-form__summary-label">Per person</span>
            <strong className="booking-form__summary-price">
              {formatMoney(pricing.perPersonInr, pricing.perPersonUsd)}
            </strong>
            <span className="booking-form__summary-note">{basePrice.description}</span>
          </div>
          <div className="booking-form__summary-col booking-form__summary-col--total">
            <span className="booking-form__summary-label">Estimated total (INR)</span>
            <strong className="booking-form__summary-total">
              ₹{pricing.inr}
              {passengers.length > 1 && (
                <span className="booking-form__summary-multiplier"> × {passengers.length} pax</span>
              )}
            </strong>
            <span className="booking-form__summary-note">
              USD equivalent shown as {formatMoney(pricing.inr, pricing.usd)}
            </span>
          </div>
        </div>

        {feedback && (
          <p className="booking-form__status booking-form__status--error" role="status">
            {feedback}
          </p>
        )}

        <button type="submit" className="booking-form__submit" disabled={status === "loading"}>
          <span className="booking-form__submit-text">
            {status === "loading" ? (
              "Sending order..."
            ) : (
              <>
                {basePrice.label}
                <span className="booking-form__submit-sep" aria-hidden="true">
                  {" "}
                  ·{" "}
                </span>
                {formatMoney(pricing.inr, pricing.usd)}
                <span className="booking-form__submit-arrow" aria-hidden="true">
                  →
                </span>
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
