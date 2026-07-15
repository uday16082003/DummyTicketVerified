"use client";

import { useMemo } from "react";
import {
  BOOKING_BASE_PRICES,
  calculateBookingTotal,
  formatMoney,
} from "@/constants/booking-form";
import { formatDisplayDate, getFlightSegmentsFromDraft, getHotelStaysFromDraft, type BookingDraft } from "@/lib/booking-draft";
import type { BookingMode } from "@/types/order";

type OrderSummaryPanelProps = {
  draft: BookingDraft;
  passengerCount: number;
};

const MODE_LABELS: Record<BookingMode, string> = {
  flight: "Flight",
  hotel: "Hotel",
  "flight-hotel": "Flight + Hotel",
};

export default function OrderSummaryPanel({ draft, passengerCount }: OrderSummaryPanelProps) {
  const showFlight = draft.bookingMode === "flight" || draft.bookingMode === "flight-hotel";
  const showHotel = draft.bookingMode === "hotel" || draft.bookingMode === "flight-hotel";
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

  const pricing = useMemo(
    () => calculateBookingTotal(draft.bookingMode, passengerCount, false),
    [draft.bookingMode, passengerCount]
  );

  const basePrice = BOOKING_BASE_PRICES[draft.bookingMode];

  return (
    <aside className="order-summary-sidebar" aria-label="Order summary">
      <div className="order-summary-sidebar__header">Order Summary</div>

      <div className="order-summary-sidebar__body">
        {showFlight && hasFlightRoute ? (
          <div className="order-summary-sidebar__card">
            <span className="order-summary-sidebar__card-label">
              {MODE_LABELS[draft.bookingMode]}
            </span>
            {draft.tripType === "multi-trip" ? (
              flightSegments.map((segment, index) => (
                <div key={`summary-flight-${index}`} className="order-summary-sidebar__segment">
                  <p className="order-summary-sidebar__route">
                    <strong>{segment.from}</strong>
                    <span className="order-summary-sidebar__arrow" aria-hidden="true">
                      →
                    </span>
                    <strong>{segment.to}</strong>
                  </p>
                  {segment.departure && (
                    <p className="order-summary-sidebar__date">
                      {formatDisplayDate(segment.departure)}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <>
                <p className="order-summary-sidebar__route">
                  <strong>{draft.from}</strong>
                  <span className="order-summary-sidebar__arrow" aria-hidden="true">
                    →
                  </span>
                  <strong>{draft.to}</strong>
                </p>
                {draft.departure && (
                  <p className="order-summary-sidebar__date">
                    {formatDisplayDate(draft.departure)}
                    {draft.returnDate && draft.tripType === "round-trip"
                      ? ` — ${formatDisplayDate(draft.returnDate)}`
                      : ""}
                  </p>
                )}
              </>
            )}
          </div>
        ) : null}

        {showHotel && hasHotelRoute ? (
          <div className="order-summary-sidebar__card">
            <span className="order-summary-sidebar__card-label">Hotel</span>
            {hotelStays.map((stay, index) => (
              <div key={`summary-hotel-${index}`} className="order-summary-sidebar__segment">
                <p className="order-summary-sidebar__route">
                  <strong>{stay.city}</strong>
                </p>
                {stay.checkIn && stay.checkOut && (
                  <p className="order-summary-sidebar__date">
                    {formatDisplayDate(stay.checkIn)} — {formatDisplayDate(stay.checkOut)}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : null}

        <dl className="order-summary-sidebar__pricing">
          <div className="order-summary-sidebar__row">
            <dt>Per person</dt>
            <dd>{formatMoney(pricing.perPersonInr, pricing.perPersonUsd)}</dd>
          </div>
          <div className="order-summary-sidebar__row">
            <dt>Passengers</dt>
            <dd>× {passengerCount}</dd>
          </div>
          <div className="order-summary-sidebar__row order-summary-sidebar__row--total">
            <dt>Estimated total</dt>
            <dd>₹{pricing.inr}</dd>
          </div>
        </dl>

        <p className="order-summary-sidebar__note">{basePrice.description}</p>
        <p className="order-summary-sidebar__note">
          USD equivalent {formatMoney(pricing.inr, pricing.usd)}
        </p>
      </div>
    </aside>
  );
}
