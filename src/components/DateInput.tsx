"use client";

import { useRef } from "react";

type DateInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  min?: string;
};

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default function DateInput({ id, value, onChange, required, min }: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
        return;
      } catch {
        // showPicker can throw if not triggered by user gesture in some browsers
      }
    }

    input.focus();
    input.click();
  }

  return (
    <span className="booking-form__input-wrap booking-form__input-wrap--date">
      <span className="booking-form__input-icon" aria-hidden="true">
        <CalendarIcon />
      </span>
      <input
        ref={inputRef}
        id={id}
        type="date"
        className="booking-form__date-input"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
      <button
        type="button"
        className="booking-form__date-trigger"
        onClick={openPicker}
        aria-label="Choose date"
        tabIndex={-1}
      >
        <CalendarIcon />
      </button>
    </span>
  );
}
