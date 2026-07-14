import type { BookingMode, TripType } from "@/types/order";

export type BookingDraft = {
  bookingMode: BookingMode;
  tripType: TripType;
  from?: string;
  to?: string;
  departure?: string;
  returnDate?: string;
  city?: string;
  checkIn?: string;
  checkOut?: string;
};

export function draftToSearchParams(draft: BookingDraft): URLSearchParams {
  const params = new URLSearchParams();
  params.set("mode", draft.bookingMode);
  if (draft.tripType) params.set("trip", draft.tripType);
  if (draft.from) params.set("from", draft.from);
  if (draft.to) params.set("to", draft.to);
  if (draft.departure) params.set("departure", draft.departure);
  if (draft.returnDate) params.set("return", draft.returnDate);
  if (draft.city) params.set("city", draft.city);
  if (draft.checkIn) params.set("checkIn", draft.checkIn);
  if (draft.checkOut) params.set("checkOut", draft.checkOut);
  return params;
}

export function parseBookingDraft(params: URLSearchParams): BookingDraft | null {
  const mode = params.get("mode");
  if (mode !== "flight" && mode !== "hotel" && mode !== "flight-hotel") {
    return null;
  }

  const trip = params.get("trip");
  const tripType: TripType =
    trip === "round-trip" || trip === "multi-trip" ? trip : "one-way";

  return {
    bookingMode: mode,
    tripType,
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
    departure: params.get("departure") ?? undefined,
    returnDate: params.get("return") ?? undefined,
    city: params.get("city") ?? undefined,
    checkIn: params.get("checkIn") ?? undefined,
    checkOut: params.get("checkOut") ?? undefined,
  };
}

export function isRouteStepComplete(draft: BookingDraft): boolean {
  const showFlight = draft.bookingMode === "flight" || draft.bookingMode === "flight-hotel";
  const showHotel = draft.bookingMode === "hotel" || draft.bookingMode === "flight-hotel";

  if (showFlight) {
    if (!draft.from?.trim() || !draft.to?.trim() || !draft.departure) return false;
    if (draft.tripType === "round-trip" && !draft.returnDate) return false;
  }

  if (showHotel) {
    if (!draft.city?.trim() || !draft.checkIn || !draft.checkOut) return false;
  }

  return showFlight || showHotel;
}

export function formatDisplayDate(value?: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
