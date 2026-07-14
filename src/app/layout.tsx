import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Jost } from "next/font/google";
import "./globals.css";
import "./etihad-top.css";
import "./etihad-features.css";
import "./etihad-theme.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const fontBody = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
});

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
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
      <body className={`${fontBody.variable} ${fontDisplay.variable} ${fontMono.variable}`}>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
