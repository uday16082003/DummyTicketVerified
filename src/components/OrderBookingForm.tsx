"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import AirportAutocomplete from "@/components/AirportAutocomplete";
import DateInput from "@/components/DateInput";
import {
  BOOKING_BASE_PRICES,
  NATIONALITIES,
  PASSENGER_TITLES,
  PHONE_COUNTRY_CODES,
  formatMoney,
} from "@/constants/booking-form";
import type { BookingDraft } from "@/lib/booking-draft";
import {
  createFlightSegment,
  createHotelStay,
  formatDisplayDate,
  getFlightSegmentsFromDraft,
  getHotelStaysFromDraft,
  type FlightSegment,
  type HotelStay,
} from "@/lib/booking-draft";
import type { BookingMode, OrderApiResponse, PassengerTitle, TripType } from "@/types/order";
import type { TicketPurposeId } from "@/constants/ticket-purposes";

const STEPS = [
  { id: 1, label: "Route Details" },
  { id: 2, label: "Passenger Details" },
  { id: 3, label: "Additional Details" },
] as const;

const BOOKING_MODES: { value: BookingMode; label: string; icon: ReactNode }[] = [
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

function createPassengers(count: number): PassengerFormState[] {
  return Array.from({ length: Math.max(1, count) }, () => createPassenger());
}

type OrderBookingFormProps = {
  initialDraft: BookingDraft;
  initialStep?: 1 | 2 | 3;
  purpose: TicketPurposeId | null;
  onDraftChange: (draft: BookingDraft) => void;
  passengerCount: number;
  onPassengerCountChange: (count: number) => void;
};

export default function OrderBookingForm({
  initialDraft,
  initialStep = 1,
  purpose,
  onDraftChange,
  passengerCount,
  onPassengerCountChange,
}: OrderBookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [passengers, setPassengers] = useState<PassengerFormState[]>(() =>
    createPassengers(passengerCount)
  );
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const showFlight = draft.bookingMode === "flight" || draft.bookingMode === "flight-hotel";
  const showHotel = draft.bookingMode === "hotel" || draft.bookingMode === "flight-hotel";
  const basePrice = BOOKING_BASE_PRICES[draft.bookingMode];
  const completedSteps = step - 1;
  const flightSegments = getFlightSegmentsFromDraft(draft);
  const hotelStays = getHotelStaysFromDraft(draft);
  const hasFlightRoute =
    draft.tripType === "multi-trip"
      ? flightSegments.length >= 2 &&
        flightSegments.every(
          (segment) => segment.from.trim() && segment.to.trim() && segment.departure
        )
      : Boolean(draft.from?.trim() && draft.to?.trim() && draft.departure);
  const hasHotelRoute = hotelStays.every(
    (stay) => stay.city.trim() && stay.checkIn && stay.checkOut
  );

  function updateDraft(patch: Partial<BookingDraft>) {
    setDraft((current) => {
      const next = { ...current, ...patch };
      onDraftChange(next);
      return next;
    });
  }

  function setFlightSegments(segments: FlightSegment[]) {
    const first = segments[0];
    const last = segments[segments.length - 1];
    updateDraft({
      flightSegments: segments,
      from: first?.from,
      to: last?.to,
      departure: first?.departure,
    });
  }

  function updateFlightSegment(index: number, patch: Partial<FlightSegment>) {
    const nextSegments = flightSegments.map((segment, i) =>
      i === index ? { ...segment, ...patch } : segment
    );
    setFlightSegments(nextSegments);
  }

  function addFlightSegment() {
    if (flightSegments.length >= 4) return;
    setFlightSegments([...flightSegments, createFlightSegment()]);
  }

  function removeFlightSegment(index: number) {
    if (flightSegments.length <= 2) return;
    setFlightSegments(flightSegments.filter((_, i) => i !== index));
  }

  function setHotelStaysList(stays: HotelStay[]) {
    const first = stays[0];
    updateDraft({
      hotelStays: stays.length > 1 ? stays : undefined,
      city: first?.city,
      checkIn: first?.checkIn,
      checkOut: first?.checkOut,
    });
  }

  function updateHotelStay(index: number, patch: Partial<HotelStay>) {
    const nextStays = hotelStays.map((stay, i) => (i === index ? { ...stay, ...patch } : stay));
    setHotelStaysList(nextStays);
  }

  function addHotelStay() {
    if (hotelStays.length >= 3) return;
    setHotelStaysList([...hotelStays, createHotelStay()]);
  }

  function removeHotelStay(index: number) {
    if (hotelStays.length <= 1) return;
    setHotelStaysList(hotelStays.filter((_, i) => i !== index));
  }

  function handleTripTypeChange(nextTripType: TripType) {
    if (nextTripType === "multi-trip") {
      const segments =
        draft.tripType === "multi-trip"
          ? flightSegments
          : [
              {
                from: draft.from ?? "",
                to: draft.to ?? "",
                departure: draft.departure ?? "",
              },
              createFlightSegment(),
            ];
      setFlightSegments(segments.length >= 2 ? segments : [segments[0], createFlightSegment()]);
    }
    updateDraft({ tripType: nextTripType });
  }

  function updatePassenger(index: number, patch: Partial<PassengerFormState>) {
    setPassengers((current) =>
      current.map((passenger, i) => (i === index ? { ...passenger, ...patch } : passenger))
    );
  }

  function addPassenger() {
    setPassengers((current) => [...current, createPassenger()]);
    onPassengerCountChange(passengerCount + 1);
  }

  function removePassenger(index: number) {
    if (passengers.length <= 1) return;
    setPassengers((current) => current.filter((_, i) => i !== index));
    onPassengerCountChange(passengerCount - 1);
  }

  function validateCurrentStep(): boolean {
    const panel = document.querySelector(
      `.booking-form__step-panel[data-step="${step}"]`
    );
    if (!panel) return true;
    const fields = panel.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
      "input, select"
    );
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    if (step < 3) setStep((current) => (current + 1) as 1 | 2 | 3);
  }

  function goBack() {
    if (step > 1) setStep((current) => (current - 1) as 1 | 2 | 3);
  }

  function goToStep(target: 1 | 2 | 3) {
    if (target < step) setStep(target);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step !== 3) {
      goNext();
      return;
    }
    if (!validateCurrentStep()) return;
    if (!purpose) {
      setFeedback("Please select your booking purpose to continue.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setFeedback("");

    const payload = {
      email: email.trim(),
      phone: phone.trim(),
      phoneCountryCode,
      passengers,
      purpose,
      bookingMode: draft.bookingMode,
      tripType: showFlight ? draft.tripType : undefined,
      from: showFlight ? draft.from?.trim() : undefined,
      to: showFlight ? draft.to?.trim() : undefined,
      departure: showFlight ? draft.departure : undefined,
      returnDate:
        showFlight && draft.tripType === "round-trip" ? draft.returnDate : undefined,
      city: showHotel ? draft.city?.trim() : undefined,
      checkIn: showHotel ? draft.checkIn : undefined,
      checkOut: showHotel ? draft.checkOut : undefined,
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
    } finally {
      setStatus("idle");
    }
  }

  return (
    <form
      id="order"
      className={`booking-form booking-form--wizard${!purpose ? " booking-form--locked" : ""}`}
      onSubmit={handleSubmit}
      aria-hidden={!purpose}
    >
      <nav className="booking-form__stepper" aria-label="Booking progress">
        {STEPS.map((item) => {
          const isComplete = item.id <= completedSteps;
          const isCurrent = item.id === step;
          return (
            <button
              key={item.id}
              type="button"
              className={`booking-form__step${isComplete ? " is-complete" : ""}${isCurrent ? " is-current" : ""}`}
              onClick={() => goToStep(item.id as 1 | 2 | 3)}
              disabled={item.id > step}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span className="booking-form__step-number">{item.id}</span>
              <span className="booking-form__step-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {step === 1 && (
        <div className="booking-form__step-panel" data-step="1">
          <h3 className="booking-form__section-title">Route Details</h3>

          <fieldset className="booking-form__modes">
            <legend className="sr-only">Booking type</legend>
            {BOOKING_MODES.map((mode) => (
              <label key={mode.value} className="booking-form__mode">
                <input
                  type="radio"
                  name="orderBookingMode"
                  value={mode.value}
                  checked={draft.bookingMode === mode.value}
                  onChange={() => updateDraft({ bookingMode: mode.value })}
                />
                <span>
                  <span className="booking-form__mode-icon">{mode.icon}</span>
                  <span className="booking-form__mode-label">{mode.label}</span>
                </span>
              </label>
            ))}
          </fieldset>

          {showFlight && (
            <>
              <fieldset className="booking-form__trip">
                <legend className="sr-only">Trip type</legend>
                {TRIP_TYPES.map((type) => (
                  <label key={type.value} className="booking-form__trip-option">
                    <input
                      type="radio"
                      name="orderTripType"
                      checked={draft.tripType === type.value}
                      onChange={() => handleTripTypeChange(type.value)}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </fieldset>

              {draft.tripType === "multi-trip" ? (
                <div className="booking-form__segments">
                  {flightSegments.map((segment, index) => (
                    <div key={`order-flight-${index}`} className="booking-form__segment-card">
                      <div className="booking-form__segment-card-head">
                        <p className="booking-form__segment-card-title">Flight {index + 1}</p>
                        {index > 1 && (
                          <button
                            type="button"
                            className="booking-form__segment-remove"
                            onClick={() => removeFlightSegment(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="booking-form__fields">
                        <AirportAutocomplete
                          label="From"
                          value={segment.from}
                          onChange={(value) => updateFlightSegment(index, { from: value })}
                          required
                        />
                        <AirportAutocomplete
                          label="To"
                          value={segment.to}
                          onChange={(value) => updateFlightSegment(index, { to: value })}
                          required
                        />
                        <label className="booking-form__field booking-form__field--full">
                          <span className="booking-form__label">Departure</span>
                          <DateInput
                            value={segment.departure}
                            onChange={(value) => updateFlightSegment(index, { departure: value })}
                            required
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                  {flightSegments.length < 4 && (
                    <button
                      type="button"
                      className="booking-form__add-segment"
                      onClick={addFlightSegment}
                    >
                      <span aria-hidden="true">+</span>
                      Add Another Flight
                    </button>
                  )}
                </div>
              ) : (
                <div className="booking-form__fields">
                  <AirportAutocomplete
                    label="From"
                    value={draft.from ?? ""}
                    onChange={(value) => updateDraft({ from: value })}
                    required
                  />
                  <AirportAutocomplete
                    label="To"
                    value={draft.to ?? ""}
                    onChange={(value) => updateDraft({ to: value })}
                    required
                  />
                  <div className="booking-form__row">
                    <label
                      className={`booking-form__field${draft.tripType !== "round-trip" ? " booking-form__field--full" : ""}`}
                    >
                      <span className="booking-form__label">Departure</span>
                      <DateInput
                        value={draft.departure ?? ""}
                        onChange={(value) => updateDraft({ departure: value })}
                        required
                      />
                    </label>
                    {draft.tripType === "round-trip" && (
                      <label className="booking-form__field">
                        <span className="booking-form__label">Return</span>
                        <DateInput
                          value={draft.returnDate ?? ""}
                          onChange={(value) => updateDraft({ returnDate: value })}
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {showHotel && (
            <div className="booking-form__segments">
              {hotelStays.map((stay, index) => (
                <div key={`order-hotel-${index}`} className="booking-form__segment-card">
                  <div className="booking-form__segment-card-head">
                    <p className="booking-form__segment-card-title">
                      {hotelStays.length > 1 ? `Hotel ${index + 1}` : "Hotel"}
                    </p>
                    {index > 0 && (
                      <button
                        type="button"
                        className="booking-form__segment-remove"
                        onClick={() => removeHotelStay(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="booking-form__fields">
                    <label className="booking-form__field booking-form__field--full">
                      <span className="booking-form__label">City</span>
                      <span className="booking-form__input-wrap">
                        <input
                          type="text"
                          value={stay.city}
                          onChange={(event) => updateHotelStay(index, { city: event.target.value })}
                          placeholder="City (e.g. Dubai, UAE)"
                          required={draft.bookingMode === "hotel"}
                        />
                      </span>
                    </label>
                    <div className="booking-form__row">
                      <label className="booking-form__field">
                        <span className="booking-form__label">Check-in</span>
                        <DateInput
                          value={stay.checkIn}
                          onChange={(value) => updateHotelStay(index, { checkIn: value })}
                          required={draft.bookingMode === "hotel"}
                        />
                      </label>
                      <label className="booking-form__field">
                        <span className="booking-form__label">Check-out</span>
                        <DateInput
                          value={stay.checkOut}
                          onChange={(value) => updateHotelStay(index, { checkOut: value })}
                          required={draft.bookingMode === "hotel"}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              {hotelStays.length < 3 && (
                <button type="button" className="booking-form__add-segment" onClick={addHotelStay}>
                  <span aria-hidden="true">+</span>
                  Add Another Hotel
                </button>
              )}
            </div>
          )}

          <button type="button" className="booking-form__submit" onClick={goNext}>
            <span className="booking-form__submit-text">
              Next
              <span className="booking-form__submit-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="booking-form__step-panel" data-step="2">
          {(hasFlightRoute || hasHotelRoute) && (
            <div className="booking-form__route-recap" aria-label="Selected route">
              {hasFlightRoute &&
                (draft.tripType === "multi-trip" ? (
                  flightSegments.map((segment, index) => (
                    <p key={`recap-flight-${index}`}>
                      <strong>
                        {segment.from} → {segment.to}
                      </strong>
                      <span className="booking-form__route-recap-date">
                        {" "}
                        · Departure {formatDisplayDate(segment.departure)}
                      </span>
                    </p>
                  ))
                ) : (
                  <p>
                    <strong>
                      {draft.from} → {draft.to}
                    </strong>
                    <span className="booking-form__route-recap-date">
                      {" "}
                      · Departure {formatDisplayDate(draft.departure)}
                      {draft.tripType === "round-trip" && draft.returnDate
                        ? ` · Return ${formatDisplayDate(draft.returnDate)}`
                        : ""}
                    </span>
                  </p>
                ))}
              {hasHotelRoute &&
                hotelStays.map((stay, index) => (
                  <p key={`recap-hotel-${index}`}>
                    <strong>{stay.city}</strong>
                    <span className="booking-form__route-recap-date">
                      {" "}
                      · {formatDisplayDate(stay.checkIn)} – {formatDisplayDate(stay.checkOut)}
                    </span>
                  </p>
                ))}
            </div>
          )}

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
                      <input
                        type="text"
                        value={passenger.firstName}
                        onChange={(event) =>
                          updatePassenger(index, { firstName: event.target.value })
                        }
                        placeholder="First Name"
                        required
                      />
                    </span>
                  </label>
                  <label className="booking-form__field">
                    <span className="booking-form__label">Last Name</span>
                    <span className="booking-form__input-wrap">
                      <input
                        type="text"
                        value={passenger.lastName}
                        onChange={(event) =>
                          updatePassenger(index, { lastName: event.target.value })
                        }
                        placeholder="Last Name"
                        required
                      />
                    </span>
                  </label>
                </div>

                <label className="booking-form__field booking-form__field--full">
                  <span className="booking-form__label">Nationality</span>
                  <span className="booking-form__input-wrap">
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

          <div className="booking-form__step-actions">
            <button type="button" className="booking-form__back" onClick={goBack}>
              Go Back
            </button>
            <button type="button" className="booking-form__submit" onClick={goNext}>
              <span className="booking-form__submit-text">
                Next
                <span className="booking-form__submit-arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="booking-form__step-panel" data-step="3">
          <h3 className="booking-form__section-title">Contact Details</h3>
          <div className="booking-form__fields">
            <label className="booking-form__field booking-form__field--full">
              <span className="booking-form__label">Email Address</span>
              <span className="booking-form__input-wrap">
                <input
                  type="email"
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
                  <input
                    type="tel"
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

          {feedback && (
            <p className="booking-form__status booking-form__status--error" role="status">
              {feedback}
            </p>
          )}

          <div className="booking-form__step-actions">
            <button type="button" className="booking-form__back" onClick={goBack}>
              Go Back
            </button>
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
                    Complete Booking
                    <span className="booking-form__submit-arrow" aria-hidden="true">
                      →
                    </span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
