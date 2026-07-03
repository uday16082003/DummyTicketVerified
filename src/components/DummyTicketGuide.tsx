import Image from "next/image";
import GuideScene from "@/components/GuideScene";
import GuideToc from "@/components/GuideToc";
import { GUIDE_ICONS, type GuideIconType } from "@/constants/guide-icons";

type GuideSection = {
  id: string;
  num: string;
  variant: "blue" | "green" | "gold" | "cyan";
  icon: GuideIconType;
  title: string;
  paragraphs?: string[];
  intro?: string;
  listLabel?: string;
  list?: string[];
  outro?: string;
  reasons?: { title: string; description: string }[];
};

const SECTIONS: GuideSection[] = [
  {
    id: "what-is-dummy-ticket",
    num: "01",
    variant: "blue",
    icon: "plane",
    title: "What Is a Dummy Ticket?",
    intro:
      "A dummy ticket is a temporary flight reservation used as proof of intended travel during the visa application process. It contains details similar to an actual airline booking, including:",
    list: [
      "Passenger name",
      "Flight numbers",
      "Departure and arrival airports",
      "Travel dates",
      "Airline information",
      "Reservation reference or PNR",
    ],
    outro:
      "A dummy ticket is commonly submitted as supporting documentation when embassies require proof of travel arrangements before issuing a visa.",
  },
  {
    id: "dummy-ticket-meaning",
    num: "02",
    variant: "green",
    icon: "theory",
    title: "Dummy Ticket Meaning Explained",
    paragraphs: [
      "The term \"dummy ticket\" can be confusing because it does not always mean a fake ticket.",
      "In the travel industry, a dummy ticket usually refers to a flight reservation or travel itinerary that demonstrates your planned journey without requiring you to purchase a fully paid airline ticket in advance.",
      "For visa purposes, embassies generally want evidence of your intended travel plans rather than proof that you have already spent thousands on non-refundable flights.",
    ],
  },
  {
    id: "flight-reservation",
    num: "03",
    variant: "gold",
    icon: "reservation",
    title: "What Is a Flight Reservation for Visa Applications?",
    intro:
      "A flight reservation for a visa application is a document showing your intended travel route and booking details.",
    listLabel: "It may include:",
    list: [
      "Outbound flight details",
      "Return flight details",
      "Reservation reference number",
      "Airline information",
      "Travel itinerary",
    ],
    outro:
      "Many embassies use flight reservations to verify that applicants have realistic travel plans and intend to leave the destination country within the permitted period.",
  },
  {
    id: "real-pnr",
    num: "04",
    variant: "cyan",
    icon: "ticket",
    title: "What Is a Real PNR?",
    paragraphs: [
      "PNR stands for Passenger Name Record.",
      "A real PNR is a reservation reference generated within an airline or Global Distribution System (GDS). It allows travel agents and airlines to store booking information related to a passenger's itinerary.",
    ],
    listLabel: "A typical PNR contains:",
    list: [
      "Passenger details",
      "Flight segments",
      "Reservation status",
      "Travel dates",
      "Booking references",
    ],
    outro:
      "Many travelers specifically search for \"dummy ticket with real PNR\" because some embassies and visa consultants prefer reservations that can be verified within reservation systems.",
  },
  {
    id: "embassy-rules",
    num: "05",
    variant: "blue",
    icon: "visa",
    title: "Why Do Embassies Ask for Flight Reservations?",
    paragraphs: ["Embassies often request proof of travel arrangements to assess:"],
    reasons: [
      {
        title: "Travel Intentions",
        description:
          "A flight reservation demonstrates your planned arrival and departure dates.",
      },
      {
        title: "Compliance With Visa Rules",
        description:
          "Travel documentation helps officials determine whether you intend to leave before your visa expires.",
      },
      {
        title: "Consistency of Travel Plans",
        description:
          "Your itinerary should match the purpose, duration, and destination stated in your visa application.",
      },
    ],
  },
];

const TOC_ITEMS = SECTIONS.map(({ id, title, num, variant }) => ({
  id,
  title,
  num,
  variant,
}));

function GuideIcon({ type, size = 36 }: { type: GuideIconType; size?: number }) {
  return (
    <Image
      src={GUIDE_ICONS[type]}
      alt=""
      width={size}
      height={size}
      unoptimized
      className="guide__icon-img"
    />
  );
}

export default function DummyTicketGuide() {
  return (
    <section
      className="guide"
      id="dummy-ticket-guide"
      aria-labelledby="guide-heading"
    >
      <GuideScene />

      <div className="container guide__container">
        <header className="guide__header reveal">
          <h2 id="guide-heading" className="guide__title">
            What Is a Dummy Ticket{" "}
            <span className="guide__title-accent">for Visa in 2026?</span>
          </h2>
          <p className="guide__subtitle">
            Real PNR, Meaning &amp; Embassy Rules Explained
          </p>
        </header>

        <div className="guide__shell">
          <aside className="guide__sidebar">
            <GuideToc items={TOC_ITEMS} />
          </aside>

          <div className="guide__main">
            <div className="guide__lead reveal">
              <p>
                Applying for a visa often requires proof of travel, but purchasing expensive
                flight tickets before approval can be risky. This is where a dummy ticket,
                flight reservation, or visa travel itinerary becomes useful.
              </p>
              <p>
                In this guide, you&apos;ll learn what a dummy ticket is, how it works,
                whether embassies accept it, what a real PNR means, and when you need a
                flight reservation for your visa application.
              </p>
            </div>

            <div className="guide__layout reveal-stagger">
              {SECTIONS.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  className={`guide__block guide__block--${section.variant} reveal-stagger__item`}
                >
                  <div className="guide__block-head">
                    <div className="guide__block-icon">
                      <GuideIcon type={section.icon} />
                    </div>
                    <div className="guide__block-meta">
                      <span className="guide__block-num" aria-hidden="true">
                        {section.num}
                      </span>
                      <h3 className="guide__heading">{section.title}</h3>
                    </div>
                  </div>

                  <div className="guide__block-body">
                    {section.intro && <p>{section.intro}</p>}

                    {section.paragraphs?.map((text, index) => (
                      <p key={index}>{text}</p>
                    ))}

                    {section.list && (
                      <>
                        {section.listLabel && (
                          <p className="guide__list-label">{section.listLabel}</p>
                        )}
                        <ul className="guide__list">
                          {section.list.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {section.outro && <p>{section.outro}</p>}

                    {section.reasons && (
                      <div className="guide__reasons">
                        {section.reasons.map((reason, index) => (
                          <div key={reason.title} className="guide__reason">
                            <span className="guide__reason-num" aria-hidden="true">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <h4 className="guide__reason-title">{reason.title}</h4>
                            <p className="guide__reason-desc">{reason.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
