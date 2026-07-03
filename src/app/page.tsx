import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import BookingSteps from "@/components/BookingSteps";
import Pricing from "@/components/Pricing";
import DummyTicketGuide from "@/components/DummyTicketGuide";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import ScrollRevealInit from "@/components/ScrollRevealInit";

export default function Home() {
  return (
    <>
      <Navbar />
      <ScrollRevealInit />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <BookingSteps />
        <Pricing />
        <DummyTicketGuide />
        <Reviews />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
