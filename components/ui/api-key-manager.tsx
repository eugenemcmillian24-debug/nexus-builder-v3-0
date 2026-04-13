"use client";
import React, { useState, useEffect } from "react";
import { Key, Plus, Trash2, Copy, Check, Loader2, Globe, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ApiKey {
  id: number;
  name: string;
  key: string;
  createdAt: string;
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsExecuting] = useState(false);
  const [newName, setNewName] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      setKeys(data.keys);
    } catch (err) {
      console.error("Failed to fetch keys", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createKey = async () => {
    if (!newName) return;
    setIsExecuting(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();
      setKeys([data.key, ...keys]);
      setNewName("");
    } catch (err) {
      console.error("Failed to create key", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const deleteKey = async (id: number) => {
    if (!confirm("Are you sure you want to revoke this API key?")) return;
    try {
      await fetch(`/api/keys?id=\${id}`, { method: "DELETE" });
      setKeys(keys.filter(k => k.id !== id));
    } catch (err) {
      console.error("Failed to delete key", err);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-surface-2/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue/10 rounded-lg">
            <Key className="w-4 h-4 text-blue" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-text">API_ACCESS_PROTOCOLS</h3>
            <p className="text-[10px] text-text-dim uppercase">External Integration Tokens</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
        <section className="p-6 bg-accent/5 border border-accent/20 rounded-xl flex items-start gap-4 mb-8">
          <Globe className="w-8 h-8 text-accent opacity-50 shrink-0" />
          <div>
            <h4 className="text-[10px] font-bold text-accent uppercase mb-1">Nexus API Gateway</h4>
            <p className="text-xs text-text-muted leading-relaxed max-w-2xl">
              Integrate NEXUS BUILDER into your own CI/CD pipelines or tools. Use these tokens to authenticate requests to our programmatic endpoints. 
              Keep these keys secure — they provide full access to your projects and credits.
            </p>
          </div>
        </section>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <input 
              placeholder="Key Name (e.g. GitHub Actions, Local CLI)" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-background border border-border pl-4 pr-4 py-3 text-sm font-code rounded-lg focus:border-accent outline-none transition-all"
            />
          </div>
          <button 
            onClick={createKey}
            disabled={isCreating || !newName}
            className="px-6 py-3 bg-accent text-black font-bold text-xs rounded-lg flex items-center gap-2 hover:glow-accent transition-all disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> GENERATE_NEW_KEY</>}
          </button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
          ) : keys.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-xl">
              <p className="text-xs text-text-dim uppercase tracking-widest">No active keys detected</p>
            </div>
          ) : (
            keys.map((k) => (
              <div key={k.id} className="flex items-center gap-4 p-4 bg-surface-2/50 border border-border rounded-xl group hover:border-accent/30 transition-all">
                <div className="flex-1">
                  <p className="text-[10px] text-text-dim uppercase mb-1 font-bold tracking-tighter">{k.name}</p>
                  <div className="flex items-center gap-3">
                    <code className="text-xs font-code text-accent/80 bg-black/30 px-2 py-1 rounded">
                      {k.key.slice(0, 8)}************************
                    </code>
                    <button 
                      onClick={() => copyToClipboard(k.key, k.id)}
                      className="p-1 text-text-dim hover:text-accent transition-colors"
                    >
                      {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-text-dim uppercase mb-1">Created</p>
                  <p className="text-[10px] font-code text-text-muted">{new Date(k.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => deleteKey(k.id)} className="p-2 text-text-dim hover:text-red transition-colors ml-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
