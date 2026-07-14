"use client";

import PurposeIcon from "@/components/PurposeIcon";
import { getTicketPurpose, type TicketPurposeId } from "@/constants/ticket-purposes";

type PurposeBannerProps = {
  purposeId: TicketPurposeId;
  onChange: () => void;
};

export default function PurposeBanner({ purposeId, onChange }: PurposeBannerProps) {
  const purpose = getTicketPurpose(purposeId);
  if (!purpose) return null;

  return (
    <div className="purpose-banner" role="status" aria-live="polite">
      <div className="purpose-banner__shine" aria-hidden="true" />
      <span className="purpose-banner__icon" aria-hidden="true">
        <PurposeIcon purposeId={purposeId} />
      </span>
      <div className="purpose-banner__copy">
        <span className="purpose-banner__label">Booking purpose</span>
        <span className="purpose-banner__value">{purpose.label}</span>
      </div>
      <button type="button" className="purpose-banner__change" onClick={onChange}>
        Change
      </button>
    </div>
  );
}
