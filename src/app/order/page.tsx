import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderSidebar from "@/components/OrderSidebar";
import OrderPurposeSection from "@/components/OrderPurposeSection";
import BookingPanel from "@/components/BookingPanel";
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
          <div className="order-page__layout">
            <OrderSidebar />
            <div className="order-page__form-column">
              <BookingPanel />
            </div>
          </div>

          <div className="order-page__details">
            <OrderPurposeSection />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
