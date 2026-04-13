"use client";
import React, { useState } from "react";
import { Shield, Plus, Trash2, Eye, EyeOff, Save, Loader2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvVar {
  key: string;
  value: string;
  isSecret: boolean;
}

export default function EnvManager({ buildId }: { buildId?: number }) {
  const [vars, setVars] = useState<EnvVar[]>([
    { key: "DATABASE_URL", value: "postgresql://***", isSecret: true },
    { key: "NEXT_PUBLIC_APP_URL", value: "https://...", isSecret: false },
  ]);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const addVar = () => {
    if (!newKey || !newValue) return;
    setVars([...vars, { key: newKey, value: newValue, isSecret: true }]);
    setNewKey("");
    setNewValue("");
  };

  const deleteVar = (key: string) => {
    setVars(vars.filter(v => v.key !== key));
  };

  const toggleVisibility = (key: string) => {
    setShowValues(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveEnv = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulation
    setIsSaving(false);
    alert("Environment variables synchronized with Vercel.");
  };

  return (
    <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-surface-2/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber/10 rounded-lg">
            <Lock className="w-4 h-4 text-amber" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase">Secure_Environment</h3>
            <p className="text-[10px] text-text-dim uppercase">Runtime Secrets & Variables</p>
          </div>
        </div>
        <button 
          onClick={saveEnv}
          disabled={isSaving}
          className="px-4 py-2 bg-accent text-black font-bold text-xs rounded-lg flex items-center gap-2 hover:glow-accent transition-all"
        >
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          SYNC_TO_CLOUD
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-background border border-border rounded-lg flex flex-col gap-3">
            <input 
              placeholder="VARIABLE_NAME" 
              value={newKey}
              onChange={(e) => setNewKey(e.target.value.toUpperCase())}
              className="bg-transparent border-b border-border py-2 text-xs font-code outline-none focus:border-accent"
            />
            <input 
              placeholder="VALUE" 
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="bg-transparent border-b border-border py-2 text-xs font-code outline-none focus:border-accent"
            />
            <button 
              onClick={addVar}
              className="mt-2 py-2 border border-dashed border-border rounded text-[10px] font-bold text-text-dim hover:border-accent hover:text-accent transition-all"
            >
              + ADD_VARIABLE
            </button>
          </div>

          <div className="p-6 bg-accent/5 border border-accent/20 rounded-lg flex items-start gap-4">
            <Shield className="w-8 h-8 text-accent opacity-50 shrink-0" />
            <div>
              <h4 className="text-[10px] font-bold text-accent uppercase mb-1">Encrypted Storage</h4>
              <p className="text-[10px] text-text-dim leading-relaxed">
                Secrets are stored using AES-256 encryption and are only decrypted during the build phase on the edge.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {vars.map((v) => (
            <div key={v.key} className="flex items-center gap-4 p-3 bg-surface-2/50 border border-border rounded-lg group hover:border-border-2 transition-all">
              <div className="w-48 shrink-0 text-xs font-code text-text-muted">{v.key}</div>
              <div className="flex-1 font-code text-xs">
                {showValues[v.key] ? v.value : "••••••••••••••••"}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleVisibility(v.key)} className="p-1.5 text-text-dim hover:text-text">
                  {showValues[v.key] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => deleteVar(v.key)} className="p-1.5 text-text-dim hover:text-red">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
