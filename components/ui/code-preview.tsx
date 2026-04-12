"use client";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { X, Save, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface CodePreviewProps {
  path: string;
  content: string;
  onClose: () => void;
  onSave?: (newContent: string) => void;
}

export default function CodePreview({ path, content, onClose, onSave }: CodePreviewProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(content);
  const [copied, setCopied] = React.useState(false);

  const extension = path.split(".").pop() || "typescript";
  const language = extension === "tsx" || extension === "ts" ? "typescript" : 
                   extension === "js" || extension === "jsx" ? "javascript" : 
                   extension === "css" ? "css" : "markdown";

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-4 lg:inset-10 z-[100] glass-panel rounded-2xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-surface-2/80 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red/40" />
            <div className="w-3 h-3 rounded-full bg-amber/40" />
            <div className="w-3 h-3 rounded-full bg-accent/40" />
          </div>
          <div className="h-4 w-[1px] bg-border" />
          <span className="text-xs font-code text-accent tracking-widest">{path.toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopy}
            className="p-2 text-text-dim hover:text-accent transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-all ${
              isEditing ? "bg-accent text-black border-accent" : "border-border text-text-dim hover:text-text"
            }`}
          >
            {isEditing ? "VIEW_MODE" : "EDIT_MODE"}
          </button>

          {isEditing && (
            <button 
              onClick={() => {
                onSave?.(editedContent);
                setIsEditing(false);
              }}
              className="p-2 text-accent hover:bg-accent/10 rounded transition-all"
            >
              <Save className="w-4 h-4" />
            </button>
          )}

          <div className="h-4 w-[1px] bg-border mx-2" />

          <button 
            onClick={onClose}
            className="p-2 text-text-dim hover:text-red transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor/Preview Body */}
      <div className="flex-1 overflow-hidden relative bg-[#05050a]">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full p-8 bg-transparent text-text font-code text-sm outline-none resize-none custom-scrollbar"
            spellCheck={false}
          />
        ) : (
          <div className="h-full overflow-auto custom-scrollbar">
            <SyntaxHighlighter
              language={language}
              style={atomDark}
              customStyle={{
                margin: 0,
                padding: "2rem",
                background: "transparent",
                fontSize: "13px",
                fontFamily: "var(--font-code)",
                lineHeight: "1.6"
              }}
              showLineNumbers={true}
              lineNumberStyle={{ minWidth: "3em", paddingRight: "1em", color: "#4a4a6a", textAlign: "right" }}
            >
              {editedContent}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      {/* Footer / Status Bar */}
      <div className="px-6 py-2 border-t border-border bg-surface-2/50 flex items-center justify-between text-[10px] text-text-dim font-bold tracking-widest">
        <div className="flex gap-6">
          <span>LANG: {language.toUpperCase()}</span>
          <span>SIZE: {(new Blob([editedContent]).size / 1024).toFixed(2)} KB</span>
        </div>
        <span>NEXUS_IDE_V1.0</span>
      </div>
    </motion.div>
  );
}
