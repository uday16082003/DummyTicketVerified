import type { TicketPurposeId } from "@/constants/ticket-purposes";

export type BookingMode = "flight" | "hotel" | "flight-hotel";
export type TripType = "one-way" | "round-trip" | "multi-trip";
export type PassengerTitle = "Mr" | "Mrs" | "Ms" | "Miss" | "Dr" | "Mx";

export type Passenger = {
  title: PassengerTitle;
  firstName: string;
  lastName: string;
  nationality: string;
};

export type OrderPayload = {
  email: string;
  phone: string;
  phoneCountryCode: string;
  passengers: Passenger[];
  bookingMode: BookingMode;
  purpose: TicketPurposeId;
  tripType?: TripType;
  includeHotel?: boolean;
  from?: string;
  to?: string;
  departure?: string;
  returnDate?: string;
  city?: string;
  checkIn?: string;
  checkOut?: string;
};

export type OrderApiResponse = {
  ok: boolean;
  message?: string;
  orderId?: string;
  emailSent?: boolean;
};

export function passengerFullName(passenger: Passenger): string {
  return `${passenger.title} ${passenger.firstName} ${passenger.lastName}`.trim();
}

export function orderPrimaryName(order: OrderPayload): string {
  const primary = order.passengers[0];
  return primary ? passengerFullName(primary) : "Customer";
}
