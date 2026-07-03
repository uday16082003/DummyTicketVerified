import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderConfirmation from "@/components/OrderConfirmation";
import "./confirmation.css";

export const metadata: Metadata = {
  title: "Booking Received — Dummy Ticket Verified",
  description:
    "Your dummy ticket order has been received. Save your order ID to track your booking and get support.",
};

export default function OrderConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="confirmation-page">
        <div className="confirmation-page__ambient" aria-hidden="true">
          <div className="confirmation-page__grid" />
          <div className="confirmation-page__orb confirmation-page__orb--1" />
          <div className="confirmation-page__orb confirmation-page__orb--2" />
        </div>

        <div className="container confirmation-page__inner">
          <Suspense fallback={null}>
            <OrderConfirmation />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
