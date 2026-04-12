import { Github, RefreshCw, GitBranch } from "lucide-react";

export default function GithubPanel({ status, repoUrl }: { status: string, repoUrl?: string }) {
  return (
    <div className="p-6 bg-surface terminal-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Github className="w-4 h-4" /> GITHUB_SYNC
        </h3>
        <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-[10px] text-accent font-bold uppercase">
          {status}
        </span>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-surface-2 border border-border rounded flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="w-4 h-4 text-purple" />
            <span className="text-xs font-code">main</span>
          </div>
          <button className="text-text-dim hover:text-accent transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {repoUrl && (
          <p className="text-[10px] text-text-dim truncate">
            Remote: <span className="text-blue underline">{repoUrl}</span>
          </p>
        )}
      </div>
    </div>
  );
}