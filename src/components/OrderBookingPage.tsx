"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import OrderBookingForm from "@/components/OrderBookingForm";
import OrderSummaryPanel from "@/components/OrderSummaryPanel";
import PreviewWindowChrome from "@/components/PreviewWindowChrome";
import PurposeBanner from "@/components/PurposeBanner";
import PurposeModal from "@/components/PurposeModal";
import { parseBookingDraft, isRouteStepComplete, type BookingDraft } from "@/lib/booking-draft";
import type { TicketPurposeId } from "@/constants/ticket-purposes";

const DEFAULT_DRAFT: BookingDraft = {
  bookingMode: "flight",
  tripType: "one-way",
};

export default function OrderBookingPage() {
  const searchParams = useSearchParams();
  const initialDraft = useMemo(() => {
    const parsed = parseBookingDraft(searchParams);
    return parsed ?? DEFAULT_DRAFT;
  }, [searchParams]);

  const initialStep = useMemo(() => {
    return isRouteStepComplete(initialDraft) ? 2 : 1;
  }, [initialDraft]);

  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [passengerCount, setPassengerCount] = useState(1);
  const [purpose, setPurpose] = useState<TicketPurposeId | null>(null);
  const [purposeModalOpen, setPurposeModalOpen] = useState(true);
  const [pendingPurpose, setPendingPurpose] = useState<TicketPurposeId | null>(null);

  const isPurposeLocked = purpose === null;

  function openPurposeModal() {
    setPendingPurpose(purpose);
    setPurposeModalOpen(true);
  }

  function confirmPurpose() {
    if (!pendingPurpose) return;
    setPurpose(pendingPurpose);
    setPurposeModalOpen(false);
  }

  return (
    <>
      <PurposeModal
        isOpen={purposeModalOpen}
        selectedId={pendingPurpose}
        canDismiss={purpose !== null}
        onSelect={setPendingPurpose}
        onConfirm={confirmPurpose}
        onDismiss={() => setPurposeModalOpen(false)}
      />

      <div className={`order-checkout${isPurposeLocked ? " order-checkout--locked" : ""}`}>
        <div className="order-checkout__form">
          {purpose && <PurposeBanner purposeId={purpose} onChange={openPurposeModal} />}

          <div className="hero__visual order-checkout__visual">
            <div className="hero__visual-glow" aria-hidden="true" />
            <div className="glow-border">
              <div className="glow-border__inner">
                <div className="preview-window order-checkout__window">
                  <PreviewWindowChrome />
                  <OrderBookingForm
                    initialDraft={initialDraft}
                    initialStep={initialStep}
                    purpose={purpose}
                    onDraftChange={setDraft}
                    passengerCount={passengerCount}
                    onPassengerCountChange={setPassengerCount}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <OrderSummaryPanel draft={draft} passengerCount={passengerCount} />
      </div>
    </>
  );
}
