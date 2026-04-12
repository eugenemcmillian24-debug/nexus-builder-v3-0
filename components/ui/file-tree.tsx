"use client";
import React from "react";
import { File, ChevronRight, Folder } from "lucide-react";

interface FileItem {
  path: string;
  content: string;
  size: string;
}

interface FileTreeProps {
  files: FileItem[];
  onSelectFile: (file: FileItem) => void;
}

export default function FileTree({ files, onSelectFile }: FileTreeProps) {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
      {files.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-[10px] text-text-dim uppercase tracking-[0.2em] animate-pulse">
            System_Idle...
          </p>
        </div>
      ) : (
        files.map((file, i) => (
          <div 
            key={i} 
            onClick={() => onSelectFile(file)}
            className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/5 border border-transparent hover:border-accent/10 transition-all cursor-pointer animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-6 h-6 rounded bg-surface flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <File className="w-3.5 h-3.5 text-blue group-hover:text-accent shrink-0 transition-colors" />
              </div>
              <span className="text-[11px] font-code text-text-muted truncate group-hover:text-text transition-colors">
                {file.path}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold text-text-dim opacity-0 group-hover:opacity-100 transition-opacity">
                {file.size}
              </span>
              <ChevronRight className="w-3 h-3 text-text-dim group-hover:text-accent transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
