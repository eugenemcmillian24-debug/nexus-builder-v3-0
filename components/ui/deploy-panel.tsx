import LiveStatusIndicator from "./live-status";\nimport { Globe, Server, Activity } from "lucide-react";

export default function DeployPanel({ deployUrl }: { deployUrl?: string }) {
  return (
    <div className="p-6 bg-surface terminal-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Globe className="w-4 h-4" /> VERCEL_PRODUCTION
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <LiveStatusIndicator url={deployUrl || ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-surface-2 border border-border">
          <Activity className="w-3 h-3 text-orange mb-1" />
          <p className="text-[9px] text-text-dim uppercase">Latency</p>
          <p className="text-xs font-bold font-code">24ms</p>
        </div>
        <div className="p-3 bg-surface-2 border border-border">
          <Server className="w-3 h-3 text-blue mb-1" />
          <p className="text-[9px] text-text-dim uppercase">Region</p>
          <p className="text-xs font-bold font-code">iad1</p>
        </div>
      </div>

      {deployUrl ? (
        <a 
          href={deployUrl} 
          target="_blank"
          className="block w-full py-2 bg-white text-black text-center text-[10px] font-bold hover:bg-accent transition-colors"
        >
          VIEW_LIVE_DEPLOY
        </a>
      ) : (
        <div className="w-full py-2 bg-surface-2 text-text-dim text-center text-[10px] font-bold border border-dashed border-border">
          DEPLOYMENT_PENDING
        </div>
      )}
    </div>
  );
}