"use client";

import { useEffect, useId, useRef } from "react";
import PurposeIcon from "@/components/PurposeIcon";
import {
  TICKET_PURPOSES,
  type TicketPurposeId,
} from "@/constants/ticket-purposes";

type PurposeModalProps = {
  isOpen: boolean;
  selectedId: TicketPurposeId | null;
  canDismiss: boolean;
  onSelect: (id: TicketPurposeId) => void;
  onConfirm: () => void;
  onDismiss?: () => void;
};

export default function PurposeModal({
  isOpen,
  selectedId,
  canDismiss,
  onSelect,
  onConfirm,
  onDismiss,
}: PurposeModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const continueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && canDismiss) {
        onDismiss?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canDismiss, isOpen, onDismiss]);

  useEffect(() => {
    if (isOpen && selectedId) {
      continueRef.current?.focus();
    }
  }, [isOpen, selectedId]);

  if (!isOpen) return null;

  return (
    <div className="purpose-modal" role="presentation">
      <button
        type="button"
        className="purpose-modal__backdrop"
        aria-label="Close purpose selection"
        onClick={canDismiss ? onDismiss : undefined}
        tabIndex={canDismiss ? 0 : -1}
      />

      <div
        className="purpose-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="purpose-modal__panel">
          {canDismiss && (
            <button
              type="button"
              className="purpose-modal__close"
              aria-label="Close"
              onClick={onDismiss}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}

          <header className="purpose-modal__header">
            <p className="purpose-modal__eyebrow">Purpose of Buying Dummy Ticket</p>
            <h2 id={titleId} className="purpose-modal__title">
              Why do you need this <span className="purpose-modal__title-accent">reservation?</span>
            </h2>
            <p id={descriptionId} className="purpose-modal__lead">
              Choose the reason that best matches your application. We tailor the itinerary
              details to what embassies and immigration offices typically expect.
            </p>
          </header>

          <p className="purpose-modal__label">I need this for</p>

          <div className="purpose-modal__options" role="listbox" aria-label="Ticket purpose">
            {TICKET_PURPOSES.map((purpose, index) => {
              const isActive = selectedId === purpose.id;
              return (
                <button
                  key={purpose.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`purpose-modal__option${isActive ? " is-active" : ""}`}
                  style={{ animationDelay: `${index * 55}ms` }}
                  onClick={() => onSelect(purpose.id)}
                >
                  <span className="purpose-modal__option-icon" aria-hidden="true">
                    <PurposeIcon purposeId={purpose.id} />
                  </span>
                  <span className="purpose-modal__option-copy">
                    <span className="purpose-modal__option-label">{purpose.label}</span>
                    <span className="purpose-modal__option-desc">{purpose.description}</span>
                  </span>
                  <span className="purpose-modal__option-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            ref={continueRef}
            type="button"
            className="purpose-modal__continue"
            disabled={!selectedId}
            onClick={onConfirm}
          >
            <span className="purpose-modal__continue-text">
              Continue to booking
              <span className="purpose-modal__continue-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
