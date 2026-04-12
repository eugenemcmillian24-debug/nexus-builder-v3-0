"use client";
import React from "react";
import { RotateCcw, Loader2 } from "lucide-react";

export function RestoreButton({ buildId }: { buildId: number }) {
  const [loading, setLoading] = React.useState(false);

  const handleRestore = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to rollback the entire repository to this version?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/build/rollback", {
        method: "POST",
        body: JSON.stringify({ buildId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      window.location.reload();
    } catch (err) {
      console.error("Rollback failed:", err);
      alert("Rollback failed: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleRestore}
      disabled={loading}
      className="p-2 text-text-dim hover:text-orange transition-colors"
      title="Rollback Repository to this Build"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
    </button>
  );
}
