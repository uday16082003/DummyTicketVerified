import type { TicketPurposeId } from "@/constants/ticket-purposes";

type PurposeIconProps = {
  purposeId: TicketPurposeId;
  className?: string;
};

export default function PurposeIcon({ purposeId, className = "" }: PurposeIconProps) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
    className,
  };

  switch (purposeId) {
    case "visa-application":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </svg>
      );
    case "immigration":
      return (
        <svg {...shared}>
          <path d="M12 3l7 4v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V7l7-4z" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "proof-of-return":
      return (
        <svg {...shared}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h4" strokeLinecap="round" />
        </svg>
      );
    case "passport-renewal":
      return (
        <svg {...shared}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <circle cx="12" cy="10" r="3" />
          <path d="M8 17c.7-1.5 2-2.5 4-2.5s3.3 1 4 2.5" strokeLinecap="round" />
        </svg>
      );
    case "visa-extension":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}
