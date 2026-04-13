"use client";
import { useState } from "react";

export type BuildEvent =
  | { type: "log"; level: "cmd" | "info" | "ok" | "code" | "err"; text: string }
  | { type: "phase"; phase: "blueprint" | "scaffold" | "generate" | "github" | "deploy" | "done"; data?: any }
  | { type: "file"; path: string; content: string; size: string; ms: number }
  | { type: "done"; repoUrl: string; deployUrl: string; fileCount: number }
  | { type: "error"; message: string }
  | { type: "suggestion"; commands: string[] };

export function useBuild() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<BuildEvent[]>([]);
  const [files, setFiles] = useState<{ path: string; content: string; size: string }[]>([]);
  const [currentPhase, setCurrentPhase] = useState<string>("idle");
  const [result, setResult] = useState<{ repoUrl: string; deployUrl: string } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const startBuild = async (prompt: string, options?: { model?: string }) => {
    setIsRunning(true);
    setLogs([]);
    setFiles([]);
    setResult(null);

    const response = await fetch("/api/build", {
      method: "POST",
      body: JSON.stringify({ prompt, ...options }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const event: BuildEvent = JSON.parse(line.replace("data: ", ""));

        if (event.type === "log") setLogs(prev => [...prev, event]);
        if (event.type === "phase") setCurrentPhase(event.phase);
        if (event.type === "file") setFiles(prev => [...prev, { path: event.path, content: event.content, size: event.size }]);
        if (event.type === "suggestion") setSuggestions(event.commands);
        if (event.type === "done") {
          setResult({ repoUrl: event.repoUrl, deployUrl: event.deployUrl });
          setIsRunning(false);
        }
        if (event.type === "error") {
          setLogs(prev => [...prev, { type: "log", level: "err", text: event.message }]);
          setIsRunning(false);
        }
      }
    }
  };

  return { isRunning, logs, files, currentPhase, result, suggestions, startBuild };
}
