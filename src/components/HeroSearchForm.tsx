"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AirportAutocomplete from "@/components/AirportAutocomplete";
import DateInput from "@/components/DateInput";
import { BOOKING_BASE_PRICES, formatMoney } from "@/constants/booking-form";
import {
  createFlightSegment,
  createHotelStay,
  draftToSearchParams,
  type FlightSegment,
  type HotelStay,
} from "@/lib/booking-draft";
import type { BookingMode, TripType } from "@/types/order";

const MAX_PASSENGERS = 9;
const MAX_FLIGHT_SEGMENTS = 4;
const MAX_HOTEL_STAYS = 3;

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
  { value: "multi-trip", label: "Multi-City" },
];

export default function HeroSearchForm({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [bookingMode, setBookingMode] = useState<BookingMode>("flight");
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [passengerCount, setPassengerCount] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flightSegments, setFlightSegments] = useState<FlightSegment[]>([
    createFlightSegment(),
    createFlightSegment(),
  ]);
  const [hotelStays, setHotelStays] = useState<HotelStay[]>([createHotelStay()]);

  const showFlight = bookingMode === "flight" || bookingMode === "flight-hotel";
  const showHotel = bookingMode === "hotel" || bookingMode === "flight-hotel";
  const basePrice = BOOKING_BASE_PRICES[bookingMode];

  function handleTripTypeChange(nextTripType: TripType) {
    setTripType(nextTripType);
    if (nextTripType === "multi-trip" && flightSegments.length < 2) {
      setFlightSegments([createFlightSegment(), createFlightSegment()]);
    }
  }

  function updateFlightSegment(index: number, patch: Partial<FlightSegment>) {
    setFlightSegments((current) =>
      current.map((segment, i) => (i === index ? { ...segment, ...patch } : segment))
    );
  }

  function addFlightSegment() {
    if (flightSegments.length >= MAX_FLIGHT_SEGMENTS) return;
    setFlightSegments((current) => [...current, createFlightSegment()]);
  }

  function removeFlightSegment(index: number) {
    if (flightSegments.length <= 2) return;
    setFlightSegments((current) => current.filter((_, i) => i !== index));
  }

  function updateHotelStay(index: number, patch: Partial<HotelStay>) {
    setHotelStays((current) =>
      current.map((stay, i) => (i === index ? { ...stay, ...patch } : stay))
    );
  }

  function addHotelStay() {
    if (hotelStays.length >= MAX_HOTEL_STAYS) return;
    setHotelStays((current) => [...current, createHotelStay()]);
  }

  function removeHotelStay(index: number) {
    if (hotelStays.length <= 1) return;
    setHotelStays((current) => current.filter((_, i) => i !== index));
  }

  function addPassenger() {
    if (passengerCount >= MAX_PASSENGERS) return;
    setPassengerCount((current) => current + 1);
  }

  function removePassenger() {
    if (passengerCount <= 1) return;
    setPassengerCount((current) => current - 1);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = draftToSearchParams({
      bookingMode,
      tripType,
      passengerCount,
      from: showFlight && tripType !== "multi-trip" ? from.trim() : undefined,
      to: showFlight && tripType !== "multi-trip" ? to.trim() : undefined,
      departure: showFlight && tripType !== "multi-trip" ? departure : undefined,
      returnDate:
        showFlight && tripType === "round-trip" ? returnDate : undefined,
      flightSegments:
        showFlight && tripType === "multi-trip"
          ? flightSegments.map((segment) => ({
              from: segment.from.trim(),
              to: segment.to.trim(),
              departure: segment.departure,
            }))
          : undefined,
      city: showHotel && hotelStays.length === 1 ? hotelStays[0].city.trim() : undefined,
      checkIn: showHotel && hotelStays.length === 1 ? hotelStays[0].checkIn : undefined,
      checkOut: showHotel && hotelStays.length === 1 ? hotelStays[0].checkOut : undefined,
      hotelStays:
        showHotel && hotelStays.length > 1
          ? hotelStays.map((stay) => ({
              city: stay.city.trim(),
              checkIn: stay.checkIn,
              checkOut: stay.checkOut,
            }))
          : undefined,
    });

    router.push(`/order?${params.toString()}`);
  }

  return (
    <form className={`booking-form${className ? ` ${className}` : ""}`} onSubmit={handleSubmit}>
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
                  onChange={() => handleTripTypeChange(type.value)}
                />
                <span>{type.label}</span>
              </label>
            ))}
          </fieldset>
        </div>
      )}

      {showFlight && tripType !== "multi-trip" && (
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
              <label
                className={`booking-form__field${tripType !== "round-trip" ? " booking-form__field--full" : ""}`}
              >
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

      {showFlight && tripType === "multi-trip" && (
        <div className="booking-form__section">
          <h3 className="booking-form__section-title">Multi-City Flights</h3>
          <div className="booking-form__segments">
            {flightSegments.map((segment, index) => (
              <div key={`flight-segment-${index}`} className="booking-form__segment-card">
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
                    placeholder="From (city or airport)"
                    required
                  />
                  <AirportAutocomplete
                    label="To"
                    value={segment.to}
                    onChange={(value) => updateFlightSegment(index, { to: value })}
                    placeholder="To (city or airport)"
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
          </div>
          {flightSegments.length < MAX_FLIGHT_SEGMENTS && (
            <button type="button" className="booking-form__add-segment" onClick={addFlightSegment}>
              <span aria-hidden="true">+</span>
              Add Another Flight
            </button>
          )}
        </div>
      )}

      {showHotel && (
        <div className="booking-form__section">
          <h3 className="booking-form__section-title">
            {hotelStays.length > 1 ? "Hotels" : "Hotel"}
          </h3>
          <div className="booking-form__segments">
            {hotelStays.map((stay, index) => (
              <div key={`hotel-stay-${index}`} className="booking-form__segment-card">
                <div className="booking-form__segment-card-head">
                  <p className="booking-form__segment-card-title">
                    {hotelStays.length > 1 ? `Hotel ${index + 1}` : "Stay details"}
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
                        required={bookingMode === "hotel"}
                      />
                    </span>
                  </label>
                  <div className="booking-form__row">
                    <label className="booking-form__field">
                      <span className="booking-form__label">Check-in</span>
                      <DateInput
                        value={stay.checkIn}
                        onChange={(value) => updateHotelStay(index, { checkIn: value })}
                        required={bookingMode === "hotel"}
                      />
                    </label>
                    <label className="booking-form__field">
                      <span className="booking-form__label">Check-out</span>
                      <DateInput
                        value={stay.checkOut}
                        onChange={(value) => updateHotelStay(index, { checkOut: value })}
                        required={bookingMode === "hotel"}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hotelStays.length < MAX_HOTEL_STAYS && (
            <button type="button" className="booking-form__add-segment" onClick={addHotelStay}>
              <span aria-hidden="true">+</span>
              Add Another Hotel
            </button>
          )}
        </div>
      )}

      <div className="booking-form__section">
        <div className="booking-form__section-header">
          <h3 className="booking-form__section-title">Passengers ({passengerCount})</h3>
          {passengerCount > 1 && (
            <button type="button" className="booking-form__inline-action" onClick={removePassenger}>
              Remove passenger
            </button>
          )}
        </div>
        {passengerCount < MAX_PASSENGERS && (
          <button type="button" className="booking-form__add-passenger" onClick={addPassenger}>
            <span aria-hidden="true">+</span>
            Add Another Passenger ({formatMoney(basePrice.inr, basePrice.usd)} per person)
          </button>
        )}
      </div>

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
