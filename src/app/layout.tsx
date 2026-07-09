import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import "./etihad-top.css";
import "./etihad-features.css";
import "./etihad-theme.css";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dummy Ticket Verified — Verified Dummy Flight Tickets for Visa",
  description:
    "Get verified dummy flight tickets with valid PNR for visa applications. Instant delivery, embassy accepted, starting at ₹300.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={jost.variable}>{children}</body>
    </html>
  );
}
