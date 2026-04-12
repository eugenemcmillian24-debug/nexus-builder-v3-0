export default function PhaseTracker({ activePhase }: { activePhase: string }) {
  const phases = ["blueprint", "scaffold", "generate", "github", "deploy"];
  const currentIndex = phases.indexOf(activePhase);

  return (
    <div className="flex items-center gap-4">
      {phases.map((phase, i) => (
        <div key={phase} className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-2 h-2 rounded-full transition-all duration-500 \${
              i <= currentIndex ? "bg-accent shadow-[0_0_8px_rgba(0,255,136,0.6)]" : "bg-border-2"
            }`} />
            <span className={`text-[8px] uppercase tracking-tighter font-bold \${
              i === currentIndex ? "text-accent" : "text-text-dim"
            }`}>
              {phase}
            </span>
          </div>
          {i < phases.length - 1 && (
            <div className={`w-8 h-[1px] \${i < currentIndex ? "bg-accent" : "bg-border-2"}`} />
          )}
        </div>
      ))}
    </div>
  );
}