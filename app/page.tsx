"use client";
import React, { useState } from "react";
import { useBuild } from "@/hooks/useBuild";
import TerminalPane from "@/components/ui/terminal";
import InteractiveTerminal from "@/components/ui/interactive-terminal";\nimport EnvManager from "@/components/ui/env-manager";
import PhaseTracker from "@/components/ui/phase-tracker";
import FileTree from "@/components/ui/file-tree";
import Sidebar from "@/components/ui/sidebar";
import CodePreview from "@/components/ui/code-preview";
import TemplatePicker from "@/components/ui/template-picker";
import { Send, Zap, Cpu, Code2, Monitor, Terminal as TerminalIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type WorkspaceMode = "BUILDER" | "IDE" | "TERMINAL" | "ENV";

export default function BuilderPage() {
  const [mode, setMode] = useState<WorkspaceMode>("BUILDER");
  const [prompt, setPrompt] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const { isRunning, logs, files, currentPhase, result, suggestions, startBuild } = useBuild();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [localFiles, setLocalFiles] = useState<any[]>([]);

  React.useEffect(() => {
    if (files.length > 0) setLocalFiles(files);
  }, [files]);

  const handleSaveFile = (newContent: string) => {
    if (!selectedFile) return;
    setLocalFiles(prev => prev.map(f => f.path === selectedFile.path ? { ...f, content: newContent } : f));
    setSelectedFile({ ...selectedFile, content: newContent });
  };

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      <Sidebar credits={150} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence>
          {selectedFile && (
            <CodePreview 
              path={selectedFile.path}
              content={selectedFile.content}
              onClose={() => setSelectedFile(null)}
              onSave={handleSaveFile}
            />
          )}
                    {mode === "ENV" && (
              <motion.div 
                key="env"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <EnvManager buildId={result ? 1 : undefined} />
              </motion.div>
            )}\n          </AnimatePresence>

        {/* Workspace Mode Switcher Header */}
        <header className="h-16 border-b border-border bg-surface-2/50 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <div className="flex bg-surface border border-border rounded-lg p-1">
              {[
                { id: "BUILDER", icon: Cpu, label: "ARCHITECT" },
                { id: "IDE", icon: Code2, label: "EDITOR" },
                { id: "TERMINAL", icon: TerminalIcon, label: "CONSOLE" },\n                { id: "ENV", icon: Shield, label: "SECRETS" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as WorkspaceMode)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold transition-all \${
                    mode === m.id ? "bg-accent text-black" : "text-text-dim hover:text-text"
                  }`}
                >
                  <m.icon className="w-3.5 h-3.5" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8">
            <PhaseTracker activePhase={currentPhase} />
          </div>
        </header>

        {/* Mode Content Area */}
        <div className="flex-1 p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {mode === "BUILDER" && (
              <motion.div 
                key="builder"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex gap-6"
              >
                <div className="w-80 lg:w-96 flex flex-col gap-6">
                  <section className="bg-surface/80 backdrop-blur-xl border border-border/50 p-6 rounded-xl flex flex-col gap-6 shadow-[0_0_20px_rgba(0,255,136,0.05)] overflow-y-auto custom-scrollbar">
                    <TemplatePicker 
                      selectedId={selectedTemplateId}
                      onSelect={(template) => {
                        setSelectedTemplateId(template.id);
                        setPrompt(template.prompt);
                      }}
                    />
                    <div className="h-[1px] bg-border/50 w-full" />
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold text-accent uppercase tracking-widest">Architect Prompt</h2>
                        <Monitor className="w-4 h-4 text-text-dim" />
                      </div>
                      <textarea
                        value={prompt}
                        onChange={(e) => { setPrompt(e.target.value); setSelectedTemplateId(undefined); }}
                        placeholder="Describe your vision in plain English..."
                        className="w-full h-48 bg-background/50 border border-border p-4 text-sm font-code rounded-lg focus:border-accent outline-none transition-all resize-none"
                      />
                      <button
                        onClick={() => startBuild(prompt)}
                        disabled={isRunning || !prompt}
                        className="w-full py-4 bg-accent text-black font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all disabled:opacity-50"
                      >
                        {isRunning ? "INITIALIZING..." : <><Send className="w-4 h-4" /> EXECUTE_BUILD</>}
                      </button>
                    </div>
                  </section>
                </div>
                <div className="flex-1 flex flex-col gap-6">
                  <TerminalPane logs={logs} isRunning={isRunning} suggestions={suggestions} />
                </div>
              </motion.div>
            )}

            {mode === "IDE" && (
              <motion.div 
                key="ide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex gap-6"
              >
                <div className="w-80 lg:w-96 glass-panel rounded-xl overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-border bg-surface-2/50 text-[10px] font-bold text-text-dim uppercase flex justify-between items-center">
                    <span>Source_Explorer</span>
                    <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-accent">
                      {localFiles.length} FILES
                    </span>
                  </div>
                  <FileTree files={localFiles} onSelectFile={(file) => setSelectedFile(file)} />
                </div>
                <div className="flex-1 glass-panel rounded-xl flex items-center justify-center text-text-dim">
                  <div className="text-center">
                    <Code2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-xs uppercase tracking-[0.3em]">Select_File_to_Edit</p>
                  </div>
                </div>
              </motion.div>
            )}

            {mode === "TERMINAL" && (
              <motion.div 
                key="terminal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <InteractiveTerminal buildId={result ? 1 : undefined} />
              </motion.div>
            )}
                      {mode === "ENV" && (
              <motion.div 
                key="env"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <EnvManager buildId={result ? 1 : undefined} />
              </motion.div>
            )}\n          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
