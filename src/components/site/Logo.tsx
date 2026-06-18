export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-md bg-foreground text-background ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 14l4-8 3 6 2-4 5 10" />
      </svg>
    </span>
  );
}
