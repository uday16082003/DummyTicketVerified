export const GUIDE_ICONS = {
  plane:
    "https://res.cloudinary.com/dztbjd12n/image/upload/v1781349231/airplane-ticket_tvpzyz.png",
  reservation:
    "https://res.cloudinary.com/dztbjd12n/image/upload/v1781349594/online-reservation_hxen0p.png",
  theory:
    "https://res.cloudinary.com/dztbjd12n/image/upload/v1781349502/theory_snlyoy.png",
  ticket:
    "https://res.cloudinary.com/dztbjd12n/image/upload/v1781351723/ticket_b6okgo.png",
  visa: "https://res.cloudinary.com/dztbjd12n/image/upload/v1781087906/visa_flqvqp.png",
  verified:
    "https://res.cloudinary.com/dztbjd12n/image/upload/v1781087906/visa_flqvqp.png",
} as const;

export type GuideIconType = keyof typeof GUIDE_ICONS;
