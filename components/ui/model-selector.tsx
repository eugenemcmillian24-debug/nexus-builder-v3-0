"use client";
import React from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { FREE_MODELS } from "@/lib/ai/router";
import { motion, AnimatePresence } from "framer-motion";

export default function ModelSelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedModel = FREE_MODELS.find(m => m.id === value) || FREE_MODELS[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-surface-2 border border-border rounded-lg hover:border-accent/50 transition-all"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-text uppercase tracking-tighter">{selectedModel.name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-text-dim transition-transform \${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 z-[110] glass-panel rounded-xl p-2 shadow-2xl"
          >
            {FREE_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => { onChange(m.id); setIsOpen(false); }}
                className={`w-full text-left p-2 rounded-lg text-[10px] font-bold transition-all \${
                  value === m.id ? 'bg-accent/10 text-accent' : 'hover:bg-surface-2 text-text-dim hover:text-text'
                }`}
              >
                {m.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
