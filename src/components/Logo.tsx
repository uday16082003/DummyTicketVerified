import Image from "next/image";

type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    <span className={`logo${className ? ` ${className}` : ""}`}>
      <Image
        src="/dummy-logo-icon.png"
        alt=""
        width={44}
        height={40}
        priority
        className="logo__icon"
      />

      <span className="logo__text">
        <span className="logo__title">
          <span className="logo__title-primary">Dummy</span>{" "}
          <span className="logo__title-accent">Ticket</span>
        </span>
        <span className="logo__subtitle">
          <span className="logo__subtitle-line" aria-hidden="true" />
          <span className="logo__subtitle-text">Verified</span>
          <span className="logo__subtitle-line" aria-hidden="true" />
        </span>
      </span>
    </span>
  );
}
