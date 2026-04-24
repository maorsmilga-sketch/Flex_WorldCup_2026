export function FootballHero() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.12]"
      aria-hidden
    >
      <div className="absolute -right-10 top-10 h-64 w-64 rounded-full bg-sky-400 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-emerald-500/40 blur-3xl" />
      <svg
        className="absolute bottom-4 left-1/2 w-[min(90vw,520px)] -translate-x-1/2 text-white"
        viewBox="0 0 200 120"
        fill="none"
      >
        <ellipse cx="100" cy="88" rx="78" ry="22" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="100" cy="88" r="14" stroke="currentColor" strokeWidth="1.2" />
        <line x1="100" y1="10" x2="100" y2="166" stroke="currentColor" strokeWidth="1.2" />
        <rect
          x="22"
          y="10"
          width="156"
          height="156"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
