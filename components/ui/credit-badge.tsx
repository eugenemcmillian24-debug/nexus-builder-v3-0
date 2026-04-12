import { Zap } from "lucide-react";

export default function CreditBadge({ credits }: { credits: number }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-full">
      <Zap className="w-3 h-3 text-accent fill-accent" />
      <span className="text-xs font-bold text-text uppercase tracking-wider">
        {credits} <span className="text-text-dim">CR</span>
      </span>
    </div>
  );
}