import { File } from "lucide-react";

export default function FileTree({ files }: { files: { path: string, size: string }[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {files.length === 0 ? (
        <div className="p-8 text-center text-text-dim text-[10px]">WAITING_FOR_GENERATION...</div>
      ) : (
        files.map((file, i) => (
          <div 
            key={i} 
            className="group flex items-center justify-between p-2 hover:bg-surface-2 border border-transparent hover:border-border transition-all cursor-pointer animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <File className="w-3.5 h-3.5 text-blue shrink-0" />
              <span className="text-[11px] font-code text-text-muted truncate group-hover:text-text transition-colors">
                {file.path}
              </span>
            </div>
            <span className="text-[9px] font-bold text-text-dim shrink-0">{file.size}</span>
          </div>
        ))
      )}
    </div>
  );
}