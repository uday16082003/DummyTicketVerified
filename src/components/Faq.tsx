"use client";

import { useMemo, useState } from "react";
import { FAQ_ITEMS } from "@/constants/faq-items";

function FaqEntry({
  id,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={`faq-item${isOpen ? " faq-item--open" : ""}`}>
      <button
        type="button"
        className="faq-item__trigger"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${id}`}
        id={`faq-trigger-${id}`}
        onClick={onToggle}
      >
        <span className="faq-item__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <span className="faq-item__question">{question}</span>
        <span className="faq-item__chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      <div
        id={`faq-panel-${id}`}
        role="region"
        aria-labelledby={`faq-trigger-${id}`}
        className="faq-item__panel"
        hidden={!isOpen}
      >
        <p className="faq-item__answer">{answer}</p>
      </div>
    </article>
  );
}

export default function Faq() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const [leftColumn, rightColumn] = useMemo(() => {
    const mid = Math.ceil(FAQ_ITEMS.length / 2);
    return [FAQ_ITEMS.slice(0, mid), FAQ_ITEMS.slice(mid)];
  }, []);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="faq" id="faq" aria-labelledby="faq-heading">
      <div className="container">
        <header className="faq__header reveal">
          <h2 id="faq-heading" className="faq__title">
            Dummy Ticket{" "}
            <span className="faq__title-accent">FAQs</span>
          </h2>
          <p className="faq__subtitle">
            Check our FAQs for quick answers to frequently asked questions we receive.
          </p>
        </header>

        <div className="faq__grid reveal-stagger">
          <div className="faq__column reveal-stagger__item">
            {leftColumn.map((item) => (
              <FaqEntry
                key={item.id}
                id={item.id}
                question={item.question}
                answer={item.answer}
                isOpen={openIds.has(item.id)}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
          <div className="faq__column reveal-stagger__item">
            {rightColumn.map((item) => (
              <FaqEntry
                key={item.id}
                id={item.id}
                question={item.question}
                answer={item.answer}
                isOpen={openIds.has(item.id)}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
