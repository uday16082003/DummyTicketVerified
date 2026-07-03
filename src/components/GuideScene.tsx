export default function GuideScene() {
  return (
    <>
    <div className="guide__scene" aria-hidden="true">
      <div className="guide__scene-glow" />
      <div className="guide__scene-glow guide__scene-glow--left" />

      <svg
        className="guide__globe"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="guide-globe-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="guide-route" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <filter id="guide-pin-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Globe wireframe */}
        <circle cx="250" cy="250" r="148" stroke="url(#guide-globe-stroke)" strokeWidth="1.75" />
        <ellipse cx="250" cy="250" rx="148" ry="54" stroke="url(#guide-globe-stroke)" strokeWidth="1.25" opacity="0.55" />
        <ellipse cx="250" cy="250" rx="54" ry="148" stroke="url(#guide-globe-stroke)" strokeWidth="1.25" opacity="0.55" />
        <ellipse cx="250" cy="250" rx="104" ry="148" stroke="url(#guide-globe-stroke)" strokeWidth="1" opacity="0.3" />
        <path d="M102 250h296M250 102v296" stroke="url(#guide-globe-stroke)" strokeWidth="1" opacity="0.28" />
        <path
          d="M250 136c-42 32-68 70-68 114s26 82 68 114c42-32 68-70 68-114s-26-82-68-114z"
          stroke="url(#guide-globe-stroke)"
          strokeWidth="1.25"
          opacity="0.38"
        />

        {/* Flight routes */}
        <path
          className="guide__route guide__route--1"
          d="M198 118 C 230 150, 290 170, 332 198"
          stroke="url(#guide-route)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="7 9"
        />
        <path
          className="guide__route guide__route--2"
          d="M332 198 C 300 250, 240 290, 168 318"
          stroke="url(#guide-route)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="7 9"
        />
        <path
          className="guide__route guide__route--3"
          d="M168 318 C 150 260, 160 200, 198 118"
          stroke="url(#guide-route)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="5 10"
          opacity="0.65"
        />

        {/* Location pins */}
        <g className="guide__pin" filter="url(#guide-pin-glow)">
          <circle className="guide__pin-pulse" cx="198" cy="108" r="14" fill="#f97316" opacity="0.15" />
          <circle cx="198" cy="108" r="5" fill="#f97316" opacity="0.35" />
          <path
            d="M198 92c-7.7 0-14 6.3-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.7-6.3-14-14-14z"
            fill="#fb923c"
          />
          <circle cx="198" cy="106" r="4" fill="#fff7ed" />
        </g>

        <g className="guide__pin guide__pin--delay" filter="url(#guide-pin-glow)">
          <circle className="guide__pin-pulse" cx="342" cy="198" r="14" fill="#3b82f6" opacity="0.15" />
          <circle cx="342" cy="198" r="5" fill="#3b82f6" opacity="0.35" />
          <path
            d="M342 182c-7.7 0-14 6.3-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.7-6.3-14-14-14z"
            fill="#60a5fa"
          />
          <circle cx="342" cy="196" r="4" fill="#eff6ff" />
        </g>

        <g className="guide__pin guide__pin--delay-2" filter="url(#guide-pin-glow)">
          <circle className="guide__pin-pulse" cx="158" cy="328" r="14" fill="#22c55e" opacity="0.15" />
          <circle cx="158" cy="328" r="5" fill="#22c55e" opacity="0.35" />
          <path
            d="M158 312c-7.7 0-14 6.3-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.7-6.3-14-14-14z"
            fill="#4ade80"
          />
          <circle cx="158" cy="326" r="4" fill="#ecfdf5" />
        </g>

        <g className="guide__pin guide__pin--delay-3" filter="url(#guide-pin-glow)">
          <circle className="guide__pin-pulse" cx="288" cy="128" r="12" fill="#eab308" opacity="0.12" />
          <path
            d="M288 116c-6 0-11 5-11 11 0 8 11 20 11 20s11-12 11-20c0-6-5-11-11-11z"
            fill="#facc15"
          />
          <circle cx="288" cy="127" r="3.5" fill="#fefce8" />
        </g>

        {/* Plane along route */}
        <g className="guide__plane">
          <path
            d="M318 178l14 8-14 4-4 10-6-2 2-12-12-6 14-2z"
            fill="#38bdf8"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>

    <div className="guide__scene-labels" aria-hidden="true">
      <span className="guide__scene-label guide__scene-label--route">
        <span className="guide__scene-label-dot" aria-hidden="true" />
        <span className="guide__scene-label-line" aria-hidden="true" />
        <em>Visa route</em>
      </span>
      <span className="guide__scene-label guide__scene-label--pnr">
        <span className="guide__scene-label-dot" aria-hidden="true" />
        <span className="guide__scene-label-line" aria-hidden="true" />
        <em>Live PNR</em>
      </span>
      <span className="guide__scene-label guide__scene-label--embassy">
        <span className="guide__scene-label-dot" aria-hidden="true" />
        <span className="guide__scene-label-line" aria-hidden="true" />
        <em>Embassy ready</em>
      </span>
    </div>
    </>
  );
}
