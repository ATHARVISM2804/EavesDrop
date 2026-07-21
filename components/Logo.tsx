export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* The Listening Fox — soundwave curling off a perked ear.
          Amber-gradient fur, cream face, ink features. */}
      <svg
        width="30"
        height="30"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="eaves-fur" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E38B4E" />
            <stop offset="1" stopColor="#C15E2C" />
          </linearGradient>
        </defs>

        {/* Signal antenna — copper stalk + amber "signal ball" (drawn first so
            the head overlaps its base and it reads as rooted between the ears) */}
        <path
          d="M24 14C22.4 8 25 4.8 28.8 4.6"
          fill="none"
          stroke="#C15E2C"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="31" cy="4.2" r="2.9" fill="#E38B4E" />
        <circle cx="30" cy="3.2" r="0.95" fill="#FFFFFF" opacity="0.65" />

        {/* Head + ears (rounded corners via matching stroke) */}
        <path
          d="M9 8 18.5 16.5 24 12.8 29.5 16.5 39 8 37.5 23.5 24 39 10.5 23.5Z"
          fill="url(#eaves-fur)"
          stroke="url(#eaves-fur)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Inner-ear + muzzle markings */}
        <path d="M12.6 10.8 16.8 15.4 13.2 15.4Z" fill="#FFFFFF" opacity="0.9" />
        <path d="M35.4 10.8 31.2 15.4 34.8 15.4Z" fill="#FFFFFF" opacity="0.9" />
        <path d="M16.5 24 31.5 24 24 38Z" fill="#FFFFFF" />

        {/* Soft almond eyes, gentle inward tilt */}
        <ellipse
          cx="18.6"
          cy="21.4"
          rx="2"
          ry="1.35"
          transform="rotate(14 18.6 21.4)"
          fill="#0E0E10"
        />
        <ellipse
          cx="29.4"
          cy="21.4"
          rx="2"
          ry="1.35"
          transform="rotate(-14 29.4 21.4)"
          fill="#0E0E10"
        />

        {/* Nose */}
        <path d="M22.3 31.5 25.7 31.5 24 34.8Z" fill="#0E0E10" />
      </svg>

      <span className="font-serif text-lg font-semibold tracking-tight">
        Eavesdrop
      </span>
    </span>
  );
}
