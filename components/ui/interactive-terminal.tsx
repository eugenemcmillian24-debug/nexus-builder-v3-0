"use client";
import React, { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, Send, ChevronRight, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  type: "cmd" | "out" | "err" | "sys";
  text: string;
  time: string;
}

export default function InteractiveTerminal({ buildId }: { buildId?: number }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "sys", text: "NEXUS_KERNEL_V1.0 INITIALIZED", time: new Date().toLocaleTimeString() },
    { type: "sys", text: "READY_FOR_COMMANDS", time: new Date().toLocaleTimeString() },
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    const newLines: TerminalLine[] = [
      ...history,
      { type: "cmd", text: cmd, time: new Date().toLocaleTimeString() }
    ];
    setHistory(newLines);
    setInput("");
    setIsExecuting(true);

    try {
      // Simulation of command processing
      // In a real environment, this would call a backend proxy to a container or shell
      await new Promise(r => setTimeout(r, 800));

      let output = "";
      if (cmd.startsWith("npm")) output = "Executing npm package manager... Done.";
      else if (cmd.startsWith("ls")) output = "app/ components/ lib/ public/ next.config.ts package.json";
      else if (cmd === "clear") {
        setHistory([]);
        setIsExecuting(false);
        return;
      }
      else output = `Command not found: \${cmd.split(" ")[0]}. Try 'npm' or 'ls'.`;

      setHistory(prev => [...prev, { type: "out", text: output, time: new Date().toLocaleTimeString() }]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex-1 glass-panel flex flex-col overflow-hidden min-h-[400px] rounded-xl">
      <div className="px-4 py-2 border-b border-border bg-surface-2/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3 h-3 text-accent" />
          <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Interactive_Terminal</span>
        </div>
        <button onClick={() => setHistory([])} className="p-1 text-text-dim hover:text-red transition-colors">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 p-4 font-code text-[12px] overflow-y-auto space-y-1 custom-scrollbar bg-black/40">
        <AnimatePresence initial={false}>
          {history.map((line, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              key={i} 
              className="flex gap-3"
            >
              <span className="text-text-dim shrink-0">[{line.time}]</span>
              <span className={
                line.type === 'cmd' ? 'text-blue' :
                line.type === 'err' ? 'text-red' :
                line.type === 'sys' ? 'text-accent opacity-70' : 'text-text/80'
              }>
                {line.type === 'cmd' && <span className="text-accent mr-2">$</span>}
                {line.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {isExecuting && (
          <div className="flex gap-3 text-accent animate-pulse">
            <span className="text-text-dim">[{new Date().toLocaleTimeString()}]</span>
            <Loader2 className="w-3 h-3 animate-spin" />
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 border-t border-border bg-surface-2/30 flex items-center gap-3">
        <ChevronRight className="w-4 h-4 text-accent" />
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && executeCommand(input)}
          placeholder="Execute system command..."
          className="flex-1 bg-transparent outline-none text-sm font-code"
          disabled={isExecuting}
        />
        <button onClick={() => executeCommand(input)} disabled={isExecuting || !input}>
          <Send className="w-4 h-4 text-text-dim hover:text-accent transition-colors" />
        </button>
      </div>
    </div>
  );
}
