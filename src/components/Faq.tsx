"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CTA_CONTACT } from "@/constants/cta-assets";
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  type FaqCategory,
} from "@/constants/faq-items";

const CATEGORY_LABELS: Record<Exclude<FaqCategory, "all">, string> = {
  ordering: "How to Order",
  delivery: "Delivery & PNR",
  visa: "Visa Use",
  pricing: "Pricing",
};

function FlightAnimation() {
  return (
    <div className="faq-flight" aria-hidden="true">
      <div className="faq-flight__ticket">
        <span className="faq-flight__perforation" />
        <div className="faq-flight__route">
          <span className="faq-flight__airport faq-flight__airport--from">FROM</span>
          <span className="faq-flight__track">
            <span className="faq-flight__dash" />
            <span className="faq-flight__plane">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </span>
          </span>
          <span className="faq-flight__airport faq-flight__airport--to">TO</span>
        </div>
        <span className="faq-flight__stamp">CONFIRMED</span>
      </div>
    </div>
  );
}

function FaqAccordionItem({
  id,
  category,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  id: string;
  category: Exclude<FaqCategory, "all">;
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
        <span className="faq-item__tag">{CATEGORY_LABELS[category]}</span>
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
        <div className="faq-item__panel-inner">
          {isOpen ? <FlightAnimation /> : null}
          <p className="faq-item__answer">{answer}</p>
        </div>
      </div>
    </article>
  );
}

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const [leftColumn, rightColumn] = useMemo(() => {
    const mid = Math.ceil(filteredItems.length / 2);
    return [filteredItems.slice(0, mid), filteredItems.slice(mid)];
  }, [filteredItems]);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const handleCategoryChange = (category: FaqCategory) => {
    setActiveCategory(category);
    setOpenId(null);
  };

  const renderColumn = (items: typeof filteredItems) =>
    items.map((item) => (
      <FaqAccordionItem
        key={item.id}
        id={item.id}
        category={item.category}
        question={item.question}
        answer={item.answer}
        isOpen={openId === item.id}
        onToggle={() => toggle(item.id)}
      />
    ));

  return (
    <section className="faq" id="faq" aria-labelledby="faq-heading">
      <div className="container">
        <header className="faq__header reveal">
          <p className="faq__eyebrow">Support</p>
          <h2 id="faq-heading" className="faq__title">
            Questions{" "}
            <span className="faq__title-accent">Answered</span>
          </h2>
          <p className="faq__subtitle">
            Tap any question to reveal the answer — with a quick booking preview animation.
          </p>
        </header>

        <div className="faq__filters reveal" role="tablist" aria-label="FAQ categories">
          {FAQ_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === category.id}
              className={`faq__filter${activeCategory === category.id ? " faq__filter--active" : ""}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="faq__grid reveal-stagger">
          <div className="faq__column reveal-stagger__item">{renderColumn(leftColumn)}</div>
          <div className="faq__column reveal-stagger__item">{renderColumn(rightColumn)}</div>
        </div>

        <aside className="faq__help reveal">
          <div className="faq__help-copy">
            <h3 className="faq__help-title">Still need help?</h3>
            <p className="faq__help-text">
              Our team replies on WhatsApp in minutes — real humans, 24/7.
            </p>
          </div>
          <div className="faq__help-actions">
            <a
              href={CTA_CONTACT.whatsappUrl}
              className="btn btn--ghost btn--sm faq__help-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </a>
            <Link href="/order" className="btn btn--nav-cta btn--sm faq__help-btn">
              Order Now
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
