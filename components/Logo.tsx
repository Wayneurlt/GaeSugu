type LogoMarkProps = {
  size?: number;
  /** Colour of the sun disc. */
  accent?: string;
  /** Colour of the birds and horizon lines; match the background the mark sits on. */
  ink?: string;
  /** Colour of the horizon bars cutting through the sun. */
  horizon?: string;
};

/** The Gae Sugu mark: birds flying across a sun setting over the horizon. */
export function LogoMark({
  size = 44,
  accent = "var(--sun)",
  ink = "var(--ink)",
  horizon = "#FFFFFF",
}: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Gae Sugu mark: birds flying across a sun setting over the horizon"
    >
      <circle cx="60" cy="60" r="56" fill={accent} />
      <g fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 48 Q38.5 40 45 48 Q51.5 40 58 48" />
        <path d="M60 34 Q64.5 28.5 69 34 Q73.5 28.5 78 34" />
        <path d="M76 54 Q79.5 49.5 83 54 Q86.5 49.5 90 54" />
      </g>
      <rect x="10" y="74" width="100" height="8" fill={horizon} />
      <rect x="18" y="90" width="84" height="5" fill={horizon} />
    </svg>
  );
}

type LogoProps = {
  size?: number;
  color?: string;
  horizon?: string;
};

/** Mark + "GAE" wordmark. */
export function Logo({ size = 44, color = "var(--ink)", horizon = "#FFFFFF" }: LogoProps) {
  return (
    <span className="logo" style={{ color }}>
      <LogoMark size={size} ink={color} horizon={horizon} />
      <span className="logo-word" style={{ fontSize: size }}>
        GAE
      </span>
    </span>
  );
}
