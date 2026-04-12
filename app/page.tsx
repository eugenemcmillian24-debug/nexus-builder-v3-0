"use client";
import React, { useState } from "react";
import { useBuild } from "@/hooks/useBuild";
import TerminalPane from "@/components/ui/terminal";
import PhaseTracker from "@/components/ui/phase-tracker";
import FileTree from "@/components/ui/file-tree";
import Sidebar from "@/components/ui/sidebar";\nimport TemplatePicker from "@/components/ui/template-picker";\nimport { BlueprintTemplate } from "@/lib/ai/templates";
import CodePreview from "@/components/ui/code-preview";
import { Send, Zap, Cpu, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");\n  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const { isRunning, logs, files, currentPhase, result, suggestions, startBuild } = useBuild();
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // Allow local updates to files for preview editing
  const [localFiles, setLocalFiles] = useState<any[]>([]);
  React.useEffect(() => {
    if (files.length > 0) setLocalFiles(files);
  }, [files]);

  const handleSaveFile = (newContent: string) => {
    if (!selectedFile) return;
    setLocalFiles(prev => prev.map(f => 
      f.path === selectedFile.path ? { ...f, content: newContent } : f
    ));
    setSelectedFile({ ...selectedFile, content: newContent });
  };

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      <Sidebar credits={150} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Code Preview Overlay */}
        <AnimatePresence>
          {selectedFile && (
            <CodePreview 
              path={selectedFile.path}
              content={selectedFile.content}
              onClose={() => setSelectedFile(null)}
              onSave={handleSaveFile}
            />
          )}
        </AnimatePresence>

        {/* Top Header */}
        <header className="h-16 border-b border-border bg-surface-2/50 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Code2 className="text-accent w-5 h-5" />
            <h1 className="text-sm font-bold tracking-widest uppercase text-text-dim">WORKSPACE // ACTIVE_SESSION</h1>
          </div>
          <PhaseTracker activePhase={currentPhase} />
        </header>

        {/* Content Area */}
        <div className="flex-1 flex gap-6 p-6 overflow-hidden">
          {/* Left Column: Input & Files */}
          <div className="w-80 lg:w-96 flex flex-col gap-6">
            <section className="bg-surface/80 backdrop-blur-xl border border-border/50 p-6 rounded-xl flex flex-col gap-6 shadow-[0_0_20px_rgba(0,255,136,0.05)]">
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
                  <h2 className="text-xs font-bold text-accent uppercase tracking-widest">Custom Architecture</h2>
                  <Cpu className="w-4 h-4 text-text-dim" />
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    setSelectedTemplateId(undefined);
                  }}
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-accent uppercase tracking-widest">Architect Prompt</h2>
                <Cpu className="w-4 h-4 text-text-dim" />
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Initialize project parameters..."
                className="w-full h-48 bg-background/50 border border-border p-4 text-sm font-code rounded-lg focus:border-accent outline-none transition-all resize-none"
              />
              <button
                onClick={() => startBuild(prompt)}
                disabled={isRunning || !prompt}
                className="w-full py-4 bg-accent text-black font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all disabled:opacity-50"
              >
                {isRunning ? "EXECUTING..." : <><Send className="w-4 h-4" /> GENERATE</>}
              </button>
            </section>

            <section className="flex-1 bg-surface/80 backdrop-blur-xl border border-border/50 rounded-xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border bg-surface-2/50 text-[10px] font-bold text-text-dim uppercase flex justify-between items-center">
                <span>File Registry</span>
                <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-accent">
                  {localFiles.length} FILES
                </span>
              </div>
              <FileTree 
                files={localFiles} 
                onSelectFile={(file) => setSelectedFile(file)} 
              />
            </section>
          </div>

          {/* Right Column: Terminal & Output */}
          <div className="flex-1 flex flex-col gap-6">
            <TerminalPane logs={logs} isRunning={isRunning} suggestions={suggestions} />

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-accent/5 border border-accent/20 rounded-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-accent font-bold flex items-center gap-2 uppercase tracking-widest">
                    <Zap className="w-5 h-5" /> Deployment_Ready
                  </h3>
                  <span className="text-[10px] text-text-dim">SECURE_LINK_GENERATED</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <a href={result.repoUrl} target="_blank" className="p-4 bg-surface border border-border hover:border-blue transition-all group rounded-lg">
                    <p className="text-[10px] text-text-dim mb-1">GITHUB_REPOSITORY</p>
                    <p className="text-sm font-code text-blue truncate">{result.repoUrl}</p>
                  </a>
                  <a href={result.deployUrl} target="_blank" className="p-4 bg-surface border border-border hover:border-accent transition-all rounded-lg">
                    <p className="text-[10px] text-text-dim mb-1">LIVE_ENDPOINT</p>
                    <p className="text-sm font-code text-accent truncate">{result.deployUrl}</p>
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
