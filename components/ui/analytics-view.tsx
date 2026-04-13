"use client";
import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsView() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics").then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div className="p-12 text-center text-text-dim">Loading_Analytics...</div>;

  return (
    <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="text-xs font-bold uppercase tracking-widest">Efficiency</span>
          </div>
          <p className="text-3xl font-bold text-text">94.2%</p>
          <p className="text-[10px] text-text-dim uppercase mt-1">Resource Utilization</p>
        </div>
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-blue" />
            <span className="text-xs font-bold uppercase tracking-widest">Build Health</span>
          </div>
          <p className="text-3xl font-bold text-text">{data.buildStats.find((s:any) => s.status === 'complete')?.count || 0}</p>
          <p className="text-[10px] text-text-dim uppercase mt-1">Successful Deployments</p>
        </div>
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-purple" />
            <span className="text-xs font-bold uppercase tracking-widest">Total Usage</span>
          </div>
          <p className="text-3xl font-bold text-text">{data.usageStats.reduce((acc:number, s:any) => acc + (s.total || 0), 0)}</p>
          <p className="text-[10px] text-text-dim uppercase mt-1">Credits Consumed</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl h-80 flex flex-col">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
          <BarChart3 className="w-4 h-4 text-accent" /> Resource_Consumption_Timeline
        </h3>
        <div className="flex-1 flex items-end gap-2 px-4">
          {data.usageStats.map((s:any, i:number) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-accent/20 border border-accent/30 rounded-t-sm group-hover:bg-accent/40 transition-all relative" style={{ height: `\${Math.min(100, (s.total / 500) * 100)}%` }}>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-accent opacity-0 group-hover:opacity-100">{s.total}</div>
              </div>
              <span className="text-[8px] text-text-dim rotate-45 mt-2">{s.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
