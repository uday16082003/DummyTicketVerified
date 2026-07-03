import { NextResponse } from "next/server";
import { PASSENGER_TITLES, getBookingFieldVisibility } from "@/constants/booking-form";
import { sendOrderEmails } from "@/lib/mail/send-order-emails";
import { generateOrderId } from "@/lib/order-id";
import type {
  BookingMode,
  OrderPayload,
  Passenger,
  PassengerTitle,
  TripType,
} from "@/types/order";

const BOOKING_MODES: BookingMode[] = ["flight", "hotel", "flight-hotel"];
const TRIP_TYPES: TripType[] = ["one-way", "round-trip", "multi-trip"];

function asOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function asRequiredString(value: unknown, field: string): string {
  const result = asOptionalString(value);
  if (!result) {
    throw new Error(`${field} is required`);
  }
  return result;
}

function parsePassengers(value: unknown): Passenger[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("At least one passenger is required");
  }

  return value.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
      throw new Error(`Passenger ${index + 1} is invalid`);
    }

    const data = entry as Record<string, unknown>;
    const title = data.title as PassengerTitle;

    if (!PASSENGER_TITLES.includes(title)) {
      throw new Error(`Passenger ${index + 1}: invalid title`);
    }

    const firstName = asRequiredString(data.firstName, `Passenger ${index + 1} first name`);
    const lastName = asRequiredString(data.lastName, `Passenger ${index + 1} last name`);
    const nationality = asRequiredString(
      data.nationality,
      `Passenger ${index + 1} nationality`
    );

    return { title, firstName, lastName, nationality };
  });
}

function parseOrderPayload(body: unknown): OrderPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body");
  }

  const data = body as Record<string, unknown>;
  const bookingMode = data.bookingMode as BookingMode;

  if (!BOOKING_MODES.includes(bookingMode)) {
    throw new Error("Invalid booking mode");
  }

  const phoneCountryCode = asRequiredString(data.phoneCountryCode, "Country code");
  const phoneNumber = asRequiredString(data.phone, "Phone number");

  const order: OrderPayload = {
    email: asRequiredString(data.email, "Email"),
    phone: phoneNumber,
    phoneCountryCode,
    passengers: parsePassengers(data.passengers),
    bookingMode,
    includeHotel: data.includeHotel === true,
    from: asOptionalString(data.from),
    to: asOptionalString(data.to),
    departure: asOptionalString(data.departure),
    returnDate: asOptionalString(data.returnDate),
    city: asOptionalString(data.city),
    checkIn: asOptionalString(data.checkIn),
    checkOut: asOptionalString(data.checkOut),
  };

  if (data.tripType) {
    const tripType = data.tripType as TripType;
    if (!TRIP_TYPES.includes(tripType)) {
      throw new Error("Invalid trip type");
    }
    order.tripType = tripType;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(order.email)) {
    throw new Error("Invalid email address");
  }

  const { showFlightFields, showHotelFields } = getBookingFieldVisibility(
    bookingMode,
    order.includeHotel ?? false
  );

  if (showFlightFields) {
    if (!order.tripType) {
      throw new Error("Trip type is required for flight bookings");
    }
    if (!order.from || !order.to || !order.departure) {
      throw new Error("From, To, and Departure are required for flight bookings");
    }
    if (order.tripType === "round-trip" && !order.returnDate) {
      throw new Error("Return date is required for round-trip bookings");
    }
  }

  if (showHotelFields) {
    if (!order.checkIn || !order.checkOut) {
      throw new Error("Check-in and Check-out are required for hotel bookings");
    }
    const needsCity =
      bookingMode === "hotel" ||
      bookingMode === "flight-hotel" ||
      order.includeHotel === true;
    if (needsCity && !order.city) {
      throw new Error("City is required for hotel bookings");
    }
  }

  return order;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = parseOrderPayload(body);
    const orderId = generateOrderId();
    await sendOrderEmails(order, orderId);

    return NextResponse.json({
      ok: true,
      orderId,
      message: "Order submitted successfully. Check your email for confirmation.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit order";
    const isClientError =
      message.includes("required") ||
      message.includes("Invalid") ||
      message.includes("invalid") ||
      message === "Invalid request body";

    console.error("[api/order]", error);

    return NextResponse.json(
      {
        ok: false,
        message: isClientError ? message : "Something went wrong. Please try again or contact us on WhatsApp.",
      },
      { status: isClientError ? 400 : 500 }
    );
  }
}
