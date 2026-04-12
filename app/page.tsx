"use client";
import { useState } from "react";
import { useBuild } from "@/hooks/useBuild";
import TerminalPane from "@/components/ui/terminal";
import PhaseTracker from "@/components/ui/phase-tracker";
import FileTree from "@/components/ui/file-tree";
import GlitchText from "@/components/ui/glitch-text";
import { Send, Zap } from "lucide-react";

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");
  const { isRunning, logs, files, currentPhase, result, startBuild } = useBuild();

  const handleBuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || isRunning) return;
    startBuild(prompt);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <GlitchText text="NEXUS_BUILDER" className="text-xl font-bold" />
          <div className="hidden md:block">
            <PhaseTracker activePhase={currentPhase} />
          </div>
          <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent animate-pulse" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="p-6 bg-surface terminal-border">
            <h2 className="text-xs font-bold text-accent mb-4 uppercase tracking-[0.2em]">Initial Prompt</h2>
            <form onSubmit={handleBuild} className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Build a SaaS dashboard with Next.js 15, Neon DB, and Stripe..."
                disabled={isRunning}
                className="w-full h-40 bg-background border border-border p-4 text-sm font-code focus:border-accent outline-none transition-all resize-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isRunning || !prompt}
                className="w-full py-4 bg-accent text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-white transition-all disabled:bg-text-dim"
              >
                {isRunning ? "EXECUTING..." : <><Send className="w-4 h-4" /> GENERATE_NEXUS</>}
              </button>
            </form>
          </section>

          <section className="flex-1 bg-surface terminal-border overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border bg-surface-2 text-[10px] font-bold text-text-dim uppercase">File Registry</div>
            <FileTree files={files} />
          </section>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <TerminalPane logs={logs} isRunning={isRunning} />

          {result && (
            <div className="p-8 bg-accent/5 border border-accent/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="text-accent font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" /> BUILD_SUCCESSFUL
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href={result.repoUrl} target="_blank" className="p-4 bg-surface border border-border hover:border-blue transition-all group">
                  <p className="text-[10px] text-text-dim mb-1">GitHub Repository</p>
                  <p className="text-sm font-code text-blue truncate">{result.repoUrl}</p>
                </a>
                <a href={result.deployUrl} target="_blank" className="p-4 bg-surface border border-border hover:border-accent transition-all">
                  <p className="text-[10px] text-text-dim mb-1">Production URL</p>
                  <p className="text-sm font-code text-accent truncate">{result.deployUrl}</p>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}