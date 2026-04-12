"use client";
import React, { useEffect, useRef, useState } from "react";
import { BuildEvent } from "@/hooks/useBuild";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, Maximize2, Copy, Zap } from "lucide-react";

export default function TerminalPane({ logs, isRunning, suggestions = [] }: { logs: BuildEvent[], isRunning: boolean, suggestions?: string[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, autoScroll]);

  return (
    <div className="flex-1 bg-surface/80 backdrop-blur-xl border border-border/50 flex flex-col overflow-hidden min-h-[500px] rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.05)]">
      <div className="px-4 py-3 border-b border-border bg-surface-2/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red/40 border border-red/60" />
            <div className="w-3 h-3 rounded-full bg-amber/40 border border-amber/60" />
            <div className="w-3 h-3 rounded-full bg-accent/40 border border-accent/60" />
          </div>
          <div className="h-4 w-[1px] bg-border" />
          <span className="text-[10px] font-bold text-text-dim flex items-center gap-2 tracking-widest uppercase">
            <TerminalIcon className="w-3 h-3" /> NEXUS_STDOUT
          </span>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 text-text-dim hover:text-text hover:bg-surface rounded transition-all"><Copy className="w-3.5 h-3.5" /></button>
          <button className="p-1.5 text-text-dim hover:text-text hover:bg-surface rounded transition-all"><Maximize2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="flex-1 p-6 font-code text-[13px] overflow-y-auto space-y-1.5 bg-[#05050a]/80 custom-scrollbar">
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={i} 
              className="flex gap-4 group"
            >
              <span className="text-text-dim shrink-0 opacity-30 group-hover:opacity-100 transition-opacity">
                {String(i + 1).padStart(3, '0')}
              </span>
              <span className={
                log.level === 'cmd' ? 'text-blue' :
                log.level === 'ok' ? 'text-accent' :
                log.level === 'err' ? 'text-red' :
                log.level === 'code' ? 'text-purple/80' : 'text-text/90'
              }>
                {log.level === 'cmd' && <span className="text-accent mr-2">➜</span>}
                {log.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isRunning && (
          <div className="flex gap-4 text-accent animate-pulse">
            <span className="text-text-dim opacity-30">{String(logs.length + 1).padStart(3, '0')}</span>
            <div className="flex items-center gap-2">
              <span className="text-accent">➜</span>
              <span>EXECUTING_AI_INFERENCE</span>
              <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-1" />
            </div>
          </div>
        )}
        <div ref={endRef} />\n        {suggestions.length > 0 && (
          <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg animate-in fade-in slide-in-from-bottom-2">
            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Recommended_Actions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((cmd, i) => (
                <button 
                  key={i}
                  onClick={() => navigator.clipboard.writeText(cmd)}
                  className="px-3 py-1.5 bg-background border border-border rounded text-[11px] font-code hover:border-accent hover:text-accent transition-all flex items-center gap-2 group"
                >
                  <span className="text-accent opacity-50 group-hover:opacity-100">$</span> {cmd}
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 ml-1" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
