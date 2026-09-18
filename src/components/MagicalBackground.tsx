export function MagicalBackground() {
  const motes = Array.from({ length: 18 });

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-midnight">
      <div className="absolute inset-0 bg-stars" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 10% 20%, rgba(236,224,195,0.5) 0, transparent 100%), radial-gradient(1px 1px at 30% 70%, rgba(236,224,195,0.4) 0, transparent 100%), radial-gradient(1px 1px at 60% 15%, rgba(236,224,195,0.5) 0, transparent 100%), radial-gradient(1px 1px at 80% 50%, rgba(236,224,195,0.3) 0, transparent 100%), radial-gradient(1px 1px at 90% 85%, rgba(236,224,195,0.4) 0, transparent 100%)',
        }}
      />
      <div className="magical-dust">
        {motes.map((_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 53) % 100}%`,
              bottom: `${(i * 17) % 60}%`,
              animationDelay: `${(i % 9) * 0.8}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
    </div>
  );
}
