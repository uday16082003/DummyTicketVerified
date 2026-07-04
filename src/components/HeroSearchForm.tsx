"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import AirportAutocomplete from "@/components/AirportAutocomplete";
import DateInput from "@/components/DateInput";
import { draftToSearchParams } from "@/lib/booking-draft";
import type { BookingMode, TripType } from "@/types/order";

const BOOKING_MODES: { value: BookingMode; label: string; icon: ReactNode }[] = [
  {
    value: "flight",
    label: "Flight",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    ),
  },
  {
    value: "hotel",
    label: "Hotel",
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
    label: "Both",
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

export default function HeroSearchForm() {
  const router = useRouter();
  const [bookingMode, setBookingMode] = useState<BookingMode>("flight");
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const showFlight = bookingMode === "flight" || bookingMode === "flight-hotel";
  const showHotel = bookingMode === "hotel" || bookingMode === "flight-hotel";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = draftToSearchParams({
      bookingMode,
      tripType,
      from: showFlight ? from.trim() : undefined,
      to: showFlight ? to.trim() : undefined,
      departure: showFlight ? departure : undefined,
      returnDate: showFlight && tripType === "round-trip" ? returnDate : undefined,
      city: showHotel ? city.trim() : undefined,
      checkIn: showHotel ? checkIn : undefined,
      checkOut: showHotel ? checkOut : undefined,
    });
    router.push(`/order?${params.toString()}`);
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <fieldset className="booking-form__modes">
        <legend className="sr-only">Booking type</legend>
        {BOOKING_MODES.map((mode) => (
          <label key={mode.value} className="booking-form__mode">
            <input
              type="radio"
              name="heroBookingMode"
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

      {showFlight && (
        <div className="booking-form__section">
          <h3 className="booking-form__section-title">Trip Type</h3>
          <fieldset className="booking-form__trip">
            <legend className="sr-only">Trip type</legend>
            {TRIP_TYPES.map((type) => (
              <label key={type.value} className="booking-form__trip-option">
                <input
                  type="radio"
                  name="heroTripType"
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

      {showFlight && (
        <div className="booking-form__section">
          <h3 className="booking-form__section-title">Route</h3>
          <div className="booking-form__fields">
            <AirportAutocomplete
              label="From"
              value={from}
              onChange={setFrom}
              placeholder="From (city or airport)"
              required
            />
            <AirportAutocomplete
              label="To"
              value={to}
              onChange={setTo}
              placeholder="To (city or airport)"
              required
            />
            <div className="booking-form__row">
              <label className="booking-form__field">
                <span className="booking-form__label">Departure</span>
                <DateInput value={departure} onChange={setDeparture} required />
              </label>
              {tripType === "round-trip" && (
                <label className="booking-form__field">
                  <span className="booking-form__label">Return</span>
                  <DateInput value={returnDate} onChange={setReturnDate} required />
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      {showHotel && (
        <div className="booking-form__section">
          <h3 className="booking-form__section-title">Hotel</h3>
          <div className="booking-form__fields">
            <label className="booking-form__field booking-form__field--full">
              <span className="booking-form__label">City</span>
              <span className="booking-form__input-wrap">
                <input
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="City (e.g. Dubai, UAE)"
                  required={bookingMode === "hotel"}
                />
              </span>
            </label>
            <div className="booking-form__row">
              <label className="booking-form__field">
                <span className="booking-form__label">Check-in</span>
                <DateInput value={checkIn} onChange={setCheckIn} required={bookingMode === "hotel"} />
              </label>
              <label className="booking-form__field">
                <span className="booking-form__label">Check-out</span>
                <DateInput value={checkOut} onChange={setCheckOut} required={bookingMode === "hotel"} />
              </label>
            </div>
          </div>
        </div>
      )}

      <button type="submit" className="booking-form__submit">
        <span className="booking-form__submit-text">
          Buy Dummy Ticket
          <span className="booking-form__submit-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </button>
    </form>
  );
}
