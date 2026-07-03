export type SampleTicket = {
  id: string;
  name: string;
  logo: string;
  accent: string;
  /** Sprite cell position — used when planeImage is not set */
  bgPosition: string;
  /** Dedicated plane photo when the shared sprite has no matching airline */
  planeImage?: string;
  pdfHref?: string;
};

/** Sprite sheet: 3 columns × 2 rows — one plane per cell */
export const SAMPLE_TICKETS: SampleTicket[] = [
  {
    id: "air-india",
    name: "Air India",
    logo: "/logos/Air_India_Logo.svg.png",
    accent: "#e31837",
    bgPosition: "0% 0%",
    pdfHref: "/samples/airindiadummy.pdf",
  },
  {
    id: "british-airways",
    name: "British Airways",
    logo: "/logos/British_Airways_Logo.svg.png",
    accent: "#2e5c99",
    bgPosition: "50% 0%",
    pdfHref: "/samples/airbritishdummy.pdf",
  },
  {
    id: "emirates",
    name: "Emirates",
    logo: "/logos/Emirates_logo.svg.png",
    accent: "#d71921",
    bgPosition: "100% 0%",
    pdfHref: "/samples/emirates.pdf",
  },
  {
    id: "qatar-airways",
    name: "Qatar Airways",
    logo: "/logos/634084-QR-Logo-Full-Colour-Horizontal-bd9477-original-1765966477.jpg",
    accent: "#5c0632",
    bgPosition: "0% 100%",
    pdfHref: "/samples/qatar-airways.pdf",
  },
  {
    id: "air-canada",
    name: "Air Canada",
    logo: "/logos/Air_Canada-Logo.wine.svg",
    accent: "#d82f2e",
    bgPosition: "50% 100%",
    pdfHref: "/samples/air-canada.pdf",
  },
  {
    id: "klm",
    name: "KLM",
    logo: "/logos/KLM_logo.svg.png",
    accent: "#00a1de",
    bgPosition: "100% 100%",
    pdfHref: "/samples/klm.pdf",
  },
  {
    id: "egyptair",
    name: "EgyptAir",
    logo: "/logos/egyptair-logo-png_seeklogo-46182.png",
    accent: "#002f87",
    bgPosition: "0% 0%",
    planeImage: "/planes/egyptair.jpg",
  },
  {
    id: "thai-airways",
    name: "Thai Airways",
    logo: "/logos/Thai_Airways_logo.svg.png",
    accent: "#4b2d7f",
    bgPosition: "50% 0%",
    planeImage: "/planes/thai-airways.jpg",
    pdfHref: "/samples/thai-airways.pdf",
  },
  {
    id: "garuda-indonesia",
    name: "Garuda Indonesia",
    logo: "/logos/images.png",
    accent: "#0066b3",
    bgPosition: "100% 0%",
    planeImage: "/planes/garuda-indonesia.jpg",
    pdfHref: "/samples/garuda-indonesia.pdf",
  },
];
