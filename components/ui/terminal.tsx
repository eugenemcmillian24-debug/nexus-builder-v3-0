"use client";
import { useEffect, useRef } from "react";
import { BuildEvent } from "@/hooks/useBuild";

export default function TerminalPane({ logs, isRunning }: { logs: BuildEvent[], isRunning: boolean }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex-1 bg-surface terminal-border flex flex-col overflow-hidden min-h-[500px]">
      <div className="px-4 py-2 border-b border-border bg-surface-2 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red/20 border border-red/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber/20 border border-amber/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent/20 border border-accent/40" />
        </div>
        <span className="text-[10px] font-bold text-text-dim tracking-widest">TERMINAL_OUTPUT v1.0</span>
      </div>

      <div className="flex-1 p-6 font-code text-xs overflow-y-auto space-y-2 selection:bg-accent/30">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-text-dim shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
            <span className={
              log.level === 'cmd' ? 'text-blue' :
              log.level === 'ok' ? 'text-accent' :
              log.level === 'err' ? 'text-red' :
              log.level === 'code' ? 'text-purple' : 'text-text'
            }>
              {log.level === 'cmd' && "$ "}
              {log.text}
            </span>
          </div>
        ))}
        {isRunning && (
          <div className="flex gap-3 text-accent animate-pulse">
            <span className="text-text-dim">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
            <span>$ EXECUTING_SYSTEM_CALL...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}