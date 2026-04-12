"use client";
import React from "react";
import { motion } from "framer-motion";

export default function PhaseTracker({ activePhase }: { activePhase: string }) {
  const phases = ["blueprint", "scaffold", "generate", "github", "deploy"];
  const currentIndex = phases.indexOf(activePhase);

  return (
    <div className="flex items-center justify-between w-full max-w-2xl px-8 py-4 bg-surface-2/30 border border-border/50 rounded-full backdrop-blur-md">
      {phases.map((phase, i) => {
        const isCompleted = i < currentIndex;
        const isActive = i === currentIndex;

        return (
          <div key={phase} className="flex items-center flex-1 last:flex-none">
            <div className="relative flex flex-col items-center group">
              <motion.div 
                animate={{ 
                  scale: isActive ? [1, 1.2, 1] : 1,
                  backgroundColor: isActive || isCompleted ? "#00ff88" : "#1a1a2e"
                }}
                transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
                className={`w-3 h-3 rounded-full z-10 \${
                  isActive ? "shadow-[0_0_15px_#00ff88]" : ""
                }`} 
              />
              <span className={`absolute -bottom-6 text-[9px] font-bold uppercase tracking-widest transition-colors \${
                isActive ? "text-accent" : "text-text-dim"
              }`}>
                {phase}
              </span>
            </div>

            {i < phases.length - 1 && (
              <div className="flex-1 h-[2px] mx-4 bg-border relative overflow-hidden">
                {(isCompleted || isActive) && (
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: isCompleted ? "0%" : "-50%" }}
                    className="absolute inset-0 bg-accent"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
