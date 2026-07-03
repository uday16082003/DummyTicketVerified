import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`,
          }}
        />
      </head>
      <body className={sourceSans.variable}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
