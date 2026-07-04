type PreviewWindowChromeProps = {
  path?: string;
};

export default function PreviewWindowChrome({ path = "/order" }: PreviewWindowChromeProps) {
  return (
    <div className="preview-window__bar">
      <div className="preview-window__traffic" aria-hidden="true">
        <span className="preview-window__dot preview-window__dot--close" />
        <span className="preview-window__dot preview-window__dot--min" />
        <span className="preview-window__dot preview-window__dot--max" />
      </div>
      <div className="preview-window__url">
        <span className="preview-window__url-lock" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
          </svg>
        </span>
        <span className="preview-window__url-text">
          <span className="preview-window__url-host">booking.dummyticketverified.com</span>
          <span className="preview-window__url-path">{path}</span>
        </span>
      </div>
      <span className="preview-window__badge">
        <span className="preview-window__badge-dot" aria-hidden="true" />
        Legal
      </span>
    </div>
  );
}
