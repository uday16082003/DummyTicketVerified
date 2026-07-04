"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  formatAirportLabel,
  searchAirports,
  type Airport,
} from "@/constants/airports";

type AirportAutocompleteProps = {
  id?: string;
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function FieldIcon({ children }: { children: ReactNode }) {
  return <span className="booking-form__input-icon">{children}</span>;
}

export default function AirportAutocomplete({
  id,
  label,
  value,
  placeholder = "City or airport",
  required,
  onChange,
}: AirportAutocompleteProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const results = searchAirports(value);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function selectAirport(airport: Airport) {
    onChange(formatAirportLabel(airport));
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectAirport(results[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="booking-form__field booking-form__field--full booking-form__autocomplete" ref={rootRef}>
      <label className="booking-form__label" htmlFor={id}>
        {label}
      </label>
      <span className="booking-form__input-wrap">
        <FieldIcon>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </FieldIcon>
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => value.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </span>

      {open && results.length > 0 && (
        <ul className="booking-form__suggestions" id={listId} role="listbox">
          {results.map((airport, index) => (
            <li key={`${airport.iata}-${airport.airport}`} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`booking-form__suggestion${index === activeIndex ? " is-active" : ""}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectAirport(airport)}
              >
                <span className="booking-form__suggestion-main">
                  <strong>
                    {airport.city}, {airport.country}
                  </strong>
                  <span>{airport.airport}</span>
                </span>
                <span className="booking-form__suggestion-code">{airport.iata}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
