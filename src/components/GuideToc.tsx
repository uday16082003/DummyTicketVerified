"use client";

import { useEffect, useState } from "react";

export type GuideTocItem = {
  id: string;
  title: string;
  num: string;
  variant: "blue" | "green" | "gold" | "cyan";
};

type GuideTocProps = {
  items: GuideTocItem[];
};

export default function GuideToc({ items }: GuideTocProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -58% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="guide__toc" aria-label="Table of contents">
      <p className="guide__toc-label">Contents</p>

      <ol className="guide__toc-list">
        {items.map((item) => (
          <li
            key={item.id}
            className={`guide__toc-item guide__toc-item--${item.variant}${
              activeId === item.id ? " is-active" : ""
            }`}
          >
            <a href={`#${item.id}`} className="guide__toc-link">
              <span className="guide__toc-num" aria-hidden="true">
                {item.num}
              </span>
              <span className="guide__toc-text">{item.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
