import BookingForm from "@/components/BookingForm";

type BookingPanelProps = {
  className?: string;
};

export default function BookingPanel({ className = "" }: BookingPanelProps) {
  return (
    <div className={`hero__visual${className ? ` ${className}` : ""}`}>
      <div className="hero__visual-glow" aria-hidden="true" />
      <div className="glow-border">
        <div className="glow-border__inner">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
