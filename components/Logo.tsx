export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Signal-cutting-through-static mark: concentric "listening" arcs */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="2.5" fill="#D97B3F" />
        <path
          d="M16.5 7.5a6.5 6.5 0 0 1 0 9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M7.5 16.5a6.5 6.5 0 0 1 0-9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-serif text-lg font-semibold tracking-tight">
        Eavesdrop
      </span>
    </span>
  );
}
