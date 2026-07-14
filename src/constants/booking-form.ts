import type { BookingMode } from "@/types/order";

export const PASSENGER_TITLES = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Mx"] as const;

export const NATIONALITIES = [
  "Indian",
  "American",
  "British",
  "Canadian",
  "Australian",
  "New Zealander",
  "Irish",
  "German",
  "French",
  "Italian",
  "Spanish",
  "Portuguese",
  "Dutch",
  "Belgian",
  "Swiss",
  "Austrian",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Polish",
  "Czech",
  "Hungarian",
  "Romanian",
  "Greek",
  "Turkish",
  "Russian",
  "Ukrainian",
  "Chinese",
  "Japanese",
  "South Korean",
  "Singaporean",
  "Malaysian",
  "Indonesian",
  "Thai",
  "Filipino",
  "Vietnamese",
  "Emirati",
  "Saudi Arabian",
  "Qatari",
  "Kuwaiti",
  "Bahraini",
  "Omani",
  "Egyptian",
  "South African",
  "Nigerian",
  "Kenyan",
  "Brazilian",
  "Mexican",
  "Argentinian",
  "Other",
] as const;

export const PHONE_COUNTRY_CODES = [
  { label: "India", code: "+91" },
  { label: "United States", code: "+1" },
  { label: "United Kingdom", code: "+44" },
  { label: "Canada", code: "+1" },
  { label: "Australia", code: "+61" },
  { label: "UAE", code: "+971" },
  { label: "Saudi Arabia", code: "+966" },
  { label: "Qatar", code: "+974" },
  { label: "Kuwait", code: "+965" },
  { label: "Oman", code: "+968" },
  { label: "Bahrain", code: "+973" },
  { label: "Singapore", code: "+65" },
  { label: "Malaysia", code: "+60" },
  { label: "Germany", code: "+49" },
  { label: "France", code: "+33" },
  { label: "Italy", code: "+39" },
  { label: "Spain", code: "+34" },
  { label: "Netherlands", code: "+31" },
  { label: "Switzerland", code: "+41" },
  { label: "Ireland", code: "+353" },
  { label: "New Zealand", code: "+64" },
  { label: "South Africa", code: "+27" },
  { label: "Pakistan", code: "+92" },
  { label: "Bangladesh", code: "+880" },
  { label: "Sri Lanka", code: "+94" },
  { label: "Nepal", code: "+977" },
] as const;

export const BOOKING_BASE_PRICES: Record<
  BookingMode,
  { label: string; inr: number; usd: number; description: string }
> = {
  flight: { label: "Book Ticket", inr: 500, usd: 6, description: "Flight ticket only" },
  hotel: { label: "Book Hotel", inr: 300, usd: 4, description: "Hotel booking only" },
  "flight-hotel": {
    label: "Book Package",
    inr: 700,
    usd: 8,
    description: "Flight + hotel package",
  },
};

export const HOTEL_ADDON_PRICE = { inr: 300, usd: 4 };

export function formatMoney(inr: number, usd: number): string {
  return `₹${inr} / $${usd}`;
}

export function getBookingFieldVisibility(
  bookingMode: BookingMode,
  includeHotel: boolean
) {
  const showFlightFields = bookingMode === "flight" || bookingMode === "flight-hotel";
  const showHotelFields =
    bookingMode === "hotel" ||
    bookingMode === "flight-hotel" ||
    (bookingMode === "flight" && includeHotel);

  return {
    showFlightFields,
    showHotelFields,
    showHotelToggle: bookingMode === "flight",
  };
}

export function getBookingPriceDescription(
  bookingMode: BookingMode,
  includeHotel: boolean
): string {
  if (bookingMode === "flight" && includeHotel) {
    return "Flight ticket + hotel add-on";
  }
  return BOOKING_BASE_PRICES[bookingMode].description;
}

export function calculateBookingTotal(
  bookingMode: BookingMode,
  passengerCount: number,
  includeHotelAddon: boolean
): { inr: number; usd: number; perPersonInr: number; perPersonUsd: number } {
  const base = BOOKING_BASE_PRICES[bookingMode];
  let inr = base.inr * passengerCount;
  let usd = base.usd * passengerCount;

  if (bookingMode === "flight" && includeHotelAddon) {
    inr += HOTEL_ADDON_PRICE.inr;
    usd += HOTEL_ADDON_PRICE.usd;
  }

  return {
    inr,
    usd,
    perPersonInr: base.inr,
    perPersonUsd: base.usd,
  };
}
