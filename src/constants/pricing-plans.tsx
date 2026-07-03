export const PRICING_PLANS = [
  {
    id: "hotel",
    title: "Dummy Hotel Booking",
    priceUsd: "$4",
    priceInr: "₹300",
    featured: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
      </svg>
    ),
    features: [
      "Verified hotel reservation",
      "Up to 2 hotel bookings",
      "Up to 30 days each",
      "Delivery in 10 to 20 min",
      "Verifiable online",
    ],
  },
  {
    id: "flight",
    title: "Dummy Flight Ticket",
    priceUsd: "$6",
    priceInr: "₹500",
    featured: true,
    badge: "Most Popular",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
    features: [
      "Verified flight reservation",
      "Up to 2 flights",
      "48 hrs to 21 days validity",
      "Delivery in 10 to 20 min",
      "Verifiable PNR",
    ],
  },
  {
    id: "hotel-flight",
    title: "Hotel + Flight",
    priceUsd: "$8",
    priceInr: "₹700",
    featured: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21h18" />
        <path d="M6 21V9l6-3 6 3v12" />
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
    features: [
      "Verified hotel & flight reservation",
      "Flight + hotel in one package",
      "Up to 30 days hotel validity",
      "Delivery in 10 to 20 min",
      "Verifiable online & PNR",
    ],
  },
];
