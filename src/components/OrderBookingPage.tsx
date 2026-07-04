"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import OrderBookingForm from "@/components/OrderBookingForm";
import OrderSummaryPanel from "@/components/OrderSummaryPanel";
import PreviewWindowChrome from "@/components/PreviewWindowChrome";
import { parseBookingDraft, type BookingDraft } from "@/lib/booking-draft";

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

  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [passengerCount, setPassengerCount] = useState(1);

  return (
    <div className="order-checkout">
      <div className="order-checkout__form">
        <div className="hero__visual order-checkout__visual">
          <div className="hero__visual-glow" aria-hidden="true" />
          <div className="glow-border">
            <div className="glow-border__inner">
              <div className="preview-window order-checkout__window">
                <PreviewWindowChrome />
                <OrderBookingForm
                  initialDraft={initialDraft}
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
  );
}
