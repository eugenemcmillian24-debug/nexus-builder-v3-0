"use client";
import React, { useState, useEffect } from "react";
import { Globe, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";

export default function LiveStatusIndicator({ url }: { url: string }) {
  const [status, setStatus] = useState<"checking" | "live" | "down">("checking");

  useEffect(() => {
    if (!url) return;
    const check = async () => {
      try {
        const res = await fetch(url, { mode: "no-cors" });
        setStatus("live");
      } catch (err) {
        setStatus("down");
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [url]);

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
      status === "live" ? "bg-accent/10 border-accent/20 text-accent" :
      status === "down" ? "bg-red/10 border-red/20 text-red" :
      "bg-surface border-border text-text-dim"
    }`}>
      {status === "checking" && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === "live" && <ShieldCheck className="w-3 h-3" />}
      {status === "down" && <ShieldAlert className="w-3 h-3" />}
      {status.toUpperCase()}
    </div>
  );
}
