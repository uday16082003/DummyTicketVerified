import HeroSearchForm from "@/components/HeroSearchForm";

type HeroSearchPanelProps = {
  className?: string;
};

export default function HeroSearchPanel({ className = "" }: HeroSearchPanelProps) {
  return (
    <div className={`hero__visual${className ? ` ${className}` : ""}`}>
      <div className="hero-booking-card">
        <div className="hero-booking-card__head">
          <h2 className="hero-booking-card__title">Book your dummy ticket</h2>
          <p className="hero-booking-card__subtitle">Flight, hotel, or both — start your visa application here</p>
        </div>
        <HeroSearchForm className="booking-form--etihad" />
      </div>
    </div>
  );
}
