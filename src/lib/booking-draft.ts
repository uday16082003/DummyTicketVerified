import type { BookingMode, TripType } from "@/types/order";

export type FlightSegment = {
  from: string;
  to: string;
  departure: string;
};

export type HotelStay = {
  city: string;
  checkIn: string;
  checkOut: string;
};

export type BookingDraft = {
  bookingMode: BookingMode;
  tripType: TripType;
  passengerCount?: number;
  from?: string;
  to?: string;
  departure?: string;
  returnDate?: string;
  flightSegments?: FlightSegment[];
  city?: string;
  checkIn?: string;
  checkOut?: string;
  hotelStays?: HotelStay[];
};

export function createFlightSegment(): FlightSegment {
  return { from: "", to: "", departure: "" };
}

export function createHotelStay(): HotelStay {
  return { city: "", checkIn: "", checkOut: "" };
}

function serializeSegments(segments: FlightSegment[]): string {
  return segments
    .filter((segment) => segment.from || segment.to || segment.departure)
    .map((segment) =>
      [segment.from, segment.to, segment.departure]
        .map((value) => encodeURIComponent(value))
        .join("~")
    )
    .join(",");
}

function parseSegments(raw: string | null): FlightSegment[] | undefined {
  if (!raw) return undefined;

  const segments = raw
    .split(",")
    .map((part) => {
      const [from = "", to = "", departure = ""] = part.split("~").map(decodeURIComponent);
      return { from, to, departure };
    })
    .filter((segment) => segment.from || segment.to || segment.departure);

  return segments.length > 0 ? segments : undefined;
}

function serializeHotelStays(stays: HotelStay[]): string {
  return stays
    .filter((stay) => stay.city || stay.checkIn || stay.checkOut)
    .map((stay) =>
      [stay.city, stay.checkIn, stay.checkOut]
        .map((value) => encodeURIComponent(value))
        .join("~")
    )
    .join(",");
}

function parseHotelStays(raw: string | null): HotelStay[] | undefined {
  if (!raw) return undefined;

  const stays = raw
    .split(",")
    .map((part) => {
      const [city = "", checkIn = "", checkOut = ""] = part.split("~").map(decodeURIComponent);
      return { city, checkIn, checkOut };
    })
    .filter((stay) => stay.city || stay.checkIn || stay.checkOut);

  return stays.length > 0 ? stays : undefined;
}

function isFlightSegmentComplete(segment: FlightSegment): boolean {
  return Boolean(segment.from.trim() && segment.to.trim() && segment.departure);
}

function isHotelStayComplete(stay: HotelStay): boolean {
  return Boolean(stay.city.trim() && stay.checkIn && stay.checkOut);
}

export function draftToSearchParams(draft: BookingDraft): URLSearchParams {
  const params = new URLSearchParams();
  params.set("mode", draft.bookingMode);
  if (draft.tripType) params.set("trip", draft.tripType);

  const passengerCount = draft.passengerCount ?? 1;
  if (passengerCount > 1) params.set("pax", String(passengerCount));

  if (draft.tripType === "multi-trip" && draft.flightSegments?.length) {
    const serialized = serializeSegments(draft.flightSegments);
    if (serialized) params.set("segments", serialized);
    const first = draft.flightSegments[0];
    const last = draft.flightSegments[draft.flightSegments.length - 1];
    if (first?.from) params.set("from", first.from);
    if (last?.to) params.set("to", last.to);
    if (first?.departure) params.set("departure", first.departure);
  } else {
    if (draft.from) params.set("from", draft.from);
    if (draft.to) params.set("to", draft.to);
    if (draft.departure) params.set("departure", draft.departure);
    if (draft.returnDate) params.set("return", draft.returnDate);
  }

  if (draft.hotelStays && draft.hotelStays.length > 1) {
    const serialized = serializeHotelStays(draft.hotelStays);
    if (serialized) params.set("hotels", serialized);
    const first = draft.hotelStays[0];
    if (first?.city) params.set("city", first.city);
    if (first?.checkIn) params.set("checkIn", first.checkIn);
    if (first?.checkOut) params.set("checkOut", first.checkOut);
  } else {
    if (draft.city) params.set("city", draft.city);
    if (draft.checkIn) params.set("checkIn", draft.checkIn);
    if (draft.checkOut) params.set("checkOut", draft.checkOut);
  }

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

  const pax = Number.parseInt(params.get("pax") ?? "1", 10);
  const passengerCount = Number.isFinite(pax) && pax > 0 ? Math.min(pax, 9) : 1;

  const flightSegments = parseSegments(params.get("segments"));
  const hotelStays = parseHotelStays(params.get("hotels"));

  return {
    bookingMode: mode,
    tripType,
    passengerCount,
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
    departure: params.get("departure") ?? undefined,
    returnDate: params.get("return") ?? undefined,
    flightSegments,
    city: params.get("city") ?? undefined,
    checkIn: params.get("checkIn") ?? undefined,
    checkOut: params.get("checkOut") ?? undefined,
    hotelStays,
  };
}

export function isRouteStepComplete(draft: BookingDraft): boolean {
  const showFlight = draft.bookingMode === "flight" || draft.bookingMode === "flight-hotel";
  const showHotel = draft.bookingMode === "hotel" || draft.bookingMode === "flight-hotel";

  if (showFlight) {
    if (draft.tripType === "multi-trip") {
      const segments =
        draft.flightSegments && draft.flightSegments.length > 0
          ? draft.flightSegments
          : [{ from: draft.from ?? "", to: draft.to ?? "", departure: draft.departure ?? "" }];
      if (segments.length < 2 || !segments.every(isFlightSegmentComplete)) return false;
    } else {
      if (!draft.from?.trim() || !draft.to?.trim() || !draft.departure) return false;
      if (draft.tripType === "round-trip" && !draft.returnDate) return false;
    }
  }

  if (showHotel) {
    const stays =
      draft.hotelStays && draft.hotelStays.length > 0
        ? draft.hotelStays
        : [
            {
              city: draft.city ?? "",
              checkIn: draft.checkIn ?? "",
              checkOut: draft.checkOut ?? "",
            },
          ];
    if (!stays.every(isHotelStayComplete)) return false;
  }

  return showFlight || showHotel;
}

export function getFlightSegmentsFromDraft(draft: BookingDraft): FlightSegment[] {
  if (draft.flightSegments && draft.flightSegments.length > 0) {
    return draft.flightSegments;
  }

  return [
    {
      from: draft.from ?? "",
      to: draft.to ?? "",
      departure: draft.departure ?? "",
    },
  ];
}

export function getHotelStaysFromDraft(draft: BookingDraft): HotelStay[] {
  if (draft.hotelStays && draft.hotelStays.length > 0) {
    return draft.hotelStays;
  }

  return [
    {
      city: draft.city ?? "",
      checkIn: draft.checkIn ?? "",
      checkOut: draft.checkOut ?? "",
    },
  ];
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
