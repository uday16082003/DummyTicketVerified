export type FaqCategory = "all" | "ordering" | "delivery" | "visa" | "pricing";

export type FaqItem = {
  id: string;
  category: Exclude<FaqCategory, "all">;
  question: string;
  answer: string;
};

export const FAQ_CATEGORIES: { id: FaqCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ordering", label: "How to Order" },
  { id: "delivery", label: "Delivery & PNR" },
  { id: "visa", label: "Visa Use" },
  { id: "pricing", label: "Pricing" },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-order",
    category: "ordering",
    question: "How do I order a dummy ticket on this website?",
    answer:
      "Enter your route and travel dates on the home page, then click Buy Dummy Ticket. You will land on the order page to add passenger details and contact info. Complete booking and your PDF is sent to your email and WhatsApp — usually within 10–20 minutes.",
  },
  {
    id: "services",
    category: "ordering",
    question: "What can I book on Dummy Ticket Verified?",
    answer:
      "Flight ticket only, hotel booking only, or a combined flight + hotel package. Choose one-way, round-trip, or multi-city for flights. Add extra passengers at checkout. Preview watermarked samples for major airlines in our Samples section before you order.",
  },
  {
    id: "delivery-time",
    category: "delivery",
    question: "How fast will I receive my dummy ticket?",
    answer:
      "Most orders are delivered within 10–20 minutes after you complete booking. We send the PDF to your email and WhatsApp so you can upload it to your visa portal or print it for your embassy appointment right away.",
  },
  {
    id: "format",
    category: "delivery",
    question: "What format will I receive?",
    answer:
      "A PDF itinerary that looks like a standard airline e-ticket confirmation — passenger name, flight numbers, route, dates, and PNR included. Your delivered ticket has the preview watermark removed; only the samples on our site are watermarked.",
  },
  {
    id: "pnr-verify",
    category: "delivery",
    question: "Can the PNR be verified on the airline website?",
    answer:
      "Yes. We issue reservations with a live PNR that can be checked on the airline's official website for a limited period. This is the same verification embassies and immigration officers use when reviewing travel proof.",
  },
  {
    id: "schengen-visa",
    category: "visa",
    question: "Can I use this for Schengen, UK, or US visa applications?",
    answer:
      "Yes. Embassies commonly accept verifiable flight reservations as proof of travel plans. You do not need to purchase a fully paid ticket before your visa is approved — a genuine reservation with a live PNR is sufficient for most applications.",
  },
  {
    id: "legal",
    category: "visa",
    question: "Is a dummy flight ticket legal for visa purposes?",
    answer:
      "Yes, when used as a temporary reservation for visa or immigration documentation. It is not a confirmed paid ticket and must not be used to board a flight without purchasing a real ticket afterward.",
  },
  {
    id: "dummy-vs-confirmed",
    category: "visa",
    question: "What is the difference between a dummy ticket and a confirmed ticket?",
    answer:
      "A dummy ticket is a temporary reservation with a live PNR for visa paperwork. A confirmed ticket is fully paid and ticketed for travel. For embassy applications, a verifiable reservation is typically all you need until your visa is granted.",
  },
  {
    id: "prices",
    category: "pricing",
    question: "What are your prices?",
    answer:
      "Flight ticket: ₹500 / $6 per person. Hotel booking: ₹300 / $4 per person. Flight + hotel package: ₹700 / $8 per person. One-time payment with no hidden fees — instant delivery after you order.",
  },
  {
    id: "airlines",
    category: "ordering",
    question: "Which airlines do you provide tickets for?",
    answer:
      "Major carriers including Air India, British Airways, Emirates, Qatar Airways, Air Canada, KLM, EgyptAir, Thai Airways, and Garuda Indonesia. Your delivered ticket is prepared for your requested route on a suitable airline.",
  },
];
