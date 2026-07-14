export type TicketPurposeId =
  | "visa-application"
  | "immigration"
  | "proof-of-return"
  | "passport-renewal"
  | "visa-extension";

export type TicketPurpose = {
  id: TicketPurposeId;
  label: string;
  description: string;
};

export const TICKET_PURPOSES: TicketPurpose[] = [
  {
    id: "visa-application",
    label: "Visa Application",
    description: "Embassy or consulate visa filing with verifiable PNR",
  },
  {
    id: "immigration",
    label: "Immigration",
    description: "Immigration office proof of onward or return travel",
  },
  {
    id: "proof-of-return",
    label: "Proof of Return",
    description: "Show intent to leave the destination country on time",
  },
  {
    id: "passport-renewal",
    label: "Passport Renewal",
    description: "Passport authority travel documentation requirement",
  },
  {
    id: "visa-extension",
    label: "Visa Extension",
    description: "Extend stay with supporting flight reservation",
  },
];

export function getTicketPurpose(id: TicketPurposeId): TicketPurpose | undefined {
  return TICKET_PURPOSES.find((purpose) => purpose.id === id);
}

export function getTicketPurposeLabel(id: TicketPurposeId): string {
  return getTicketPurpose(id)?.label ?? id;
}
