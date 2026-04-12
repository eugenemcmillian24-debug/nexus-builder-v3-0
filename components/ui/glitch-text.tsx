export default function GlitchText({ text, className }: { text: string, className?: string }) {
  return (
    <span className={`relative inline-block \${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-red opacity-70 animate-pulse translate-x-0.5">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-blue opacity-70 animate-pulse -translate-x-0.5">{text}</span>
    </span>
  );
}