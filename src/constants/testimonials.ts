export type TestimonialIcon = "visa" | "flight" | "support" | "combo" | "embassy" | "repeat";

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  location: string;
  rating: number;
  tag: string;
  icon: TestimonialIcon;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "rahul",
    quote:
      "Got my dummy ticket in 12 minutes! Checked the PNR on the airline website myself — it worked. Schengen visa approved, no questions at VFS.",
    name: "Rahul S.",
    location: "India",
    rating: 5,
    tag: "Schengen Visa",
    icon: "visa",
  },
  {
    id: "priya",
    quote:
      "Needed proof of onward travel for my Thailand trip. Ordered late night, PDF came on WhatsApp in 15 min. Looked completely genuine at check-in.",
    name: "Priya M.",
    location: "India",
    rating: 5,
    tag: "Onward Travel",
    icon: "flight",
  },
  {
    id: "vikram",
    quote:
      "Best dummy ticket service I've tried. Great value at ₹500 and the WhatsApp support actually replies — fixed my name spelling in 2 minutes.",
    name: "Vikram R.",
    location: "India",
    rating: 5,
    tag: "WhatsApp Support",
    icon: "support",
  },
  {
    id: "ananya",
    quote:
      "Booked hotel + flight combo for UK visa. Both confirmations looked proper. VFS Delhi accepted everything on the first submission.",
    name: "Ananya K.",
    location: "India",
    rating: 5,
    tag: "Hotel + Flight",
    icon: "combo",
  },
  {
    id: "arjun",
    quote:
      "Used this for my US visa interview docs. Itinerary looked exactly like a real airline email. PNR verified on the portal — consular officer didn't ask twice.",
    name: "Arjun P.",
    location: "India",
    rating: 5,
    tag: "US Visa Interview",
    icon: "embassy",
  },
  {
    id: "meera",
    quote:
      "Third time ordering for family visas. Always lands in 10–20 mins. Never had an embassy or airline push back on the reservation once.",
    name: "Meera D.",
    location: "India",
    rating: 5,
    tag: "Repeat Customer",
    icon: "repeat",
  },
];
