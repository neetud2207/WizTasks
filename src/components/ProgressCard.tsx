export function ProgressCard({ percentage }: { percentage: number }) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="parchment-card flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
      <div>
        <h2 className="font-display text-xl font-semibold text-parchment-light">Magical Progress</h2>
        <p className="mt-1 max-w-xs text-sm text-parchment/60">
          Your overall completion charm across every assignment on record.
        </p>
      </div>
      <div className="relative h-32 w-32 shrink-0" role="img" aria-label={`${clamped}% of assignments mastered`}>
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(198,161,91,0.15)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#c6a15b"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl font-semibold text-gold-light">{clamped}%</span>
        </div>
      </div>
    </div>
  );
}
