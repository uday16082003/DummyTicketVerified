import HeroSearchForm from "@/components/HeroSearchForm";
import PreviewWindowChrome from "@/components/PreviewWindowChrome";

type HeroSearchPanelProps = {
  className?: string;
};

export default function HeroSearchPanel({ className = "" }: HeroSearchPanelProps) {
  return (
    <div className={`hero__visual${className ? ` ${className}` : ""}`}>
      <div className="hero__visual-glow" aria-hidden="true" />
      <div className="glow-border">
        <div className="glow-border__inner">
          <div className="preview-window">
            <PreviewWindowChrome path="/" />
            <HeroSearchForm />
          </div>
        </div>
      </div>
    </div>
  );
}
