import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderSidebar from "@/components/OrderSidebar";
import OrderBookingPage from "@/components/OrderBookingPage";
import OrderPurposeSection from "@/components/OrderPurposeSection";
import ScrollRevealInit from "@/components/ScrollRevealInit";

export const metadata: Metadata = {
  title: "Order Dummy Flight Ticket — Verifiable PNR for Visa",
  description:
    "Order a verifiable dummy flight ticket with live PNR for Schengen, UK, US, and other visa applications. Instant PDF by email and WhatsApp.",
};

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <ScrollRevealInit />
      <main className="order-page">
        <div className="order-page__ambient" aria-hidden="true">
          <div className="order-page__grid" />
          <div className="order-page__orb order-page__orb--1" />
          <div className="order-page__orb order-page__orb--2" />
        </div>

        <div className="container order-page__inner">
          <Suspense
            fallback={<p className="order-page__loading">Loading booking form…</p>}
          >
            <OrderBookingPage />
          </Suspense>

          <section className="order-page__promo" aria-label="Why book with us">
            <OrderSidebar layout="promo" />
          </section>

          <div className="order-page__details">
            <OrderPurposeSection />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
