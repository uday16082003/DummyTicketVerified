"use client";

import Link from "next/link";
import Image from "next/image";
import HeroSearchPanel from "@/components/HeroSearchPanel";
import { HERO_TRAVEL_SCENE } from "@/constants/hero-assets";

const HIGHLIGHTS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    label: "Verifiable PNR",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
    label: "Embassy Accepted",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    label: "View samples",
    href: "#samples",
  },
];

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__travel-scene" aria-hidden="true">
        <Image
          src={HERO_TRAVEL_SCENE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero__travel-scene-img"
        />
      </div>

      <div className="hero__orbs" aria-hidden="true">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content reveal">
          <div className="hero__pills">
            <span className="hero__pill hero__pill--status">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Verified PNR Active
            </span>
            <span className="hero__pill-border">
              <span className="hero__pill hero__pill--promo">
                <span className="hero__pill-emoji" aria-hidden="true">🎁</span>
                Get your verified travel itinerary now!
              </span>
            </span>
          </div>

          <h1 className="hero__title">
            Dummy Ticket
            <br />
            <span className="hero__title-accent">for Visa in 2026</span>
          </h1>

          <p className="hero__subtitle">
            The trusted way to submit visa applications. Real PNR, embassy-ready itinerary,
            delivered to your inbox in minutes — not days.
          </p>

          <span className="hero__cta-border">
            <Link href="/order" className="btn btn--white btn--lg hero__cta-main">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              Get Dummy Ticket Now!
            </Link>
          </span>

          <div className="hero__highlights">
            {HIGHLIGHTS.map((item) =>
              item.href ? (
                <a key={item.label} href={item.href} className="hero__highlight">
                  <span className="hero__highlight-icon">{item.icon}</span>
                  {item.label}
                </a>
              ) : (
                <span key={item.label} className="hero__highlight">
                  <span className="hero__highlight-icon">{item.icon}</span>
                  {item.label}
                </span>
              )
            )}
          </div>
        </div>

        <HeroSearchPanel className="reveal reveal--delay-2" />
      </div>
    </section>
  );
}
