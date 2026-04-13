"use client";
import React, { useState } from "react";
import { Mail, Shield, X, Loader2, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function InviteModal({ orgId, onClose }: { orgId: number, onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [isSending, setIsSending] = useState(false);

  const handleInvite = async () => {
    setIsSending(true);
    try {
      const res = await fetch("/api/orgs/invite", {
        method: "POST",
        body: JSON.stringify({ orgId, email, role }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      alert("Invitation sent to " + email);
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="w-5 h-5 text-accent" />
            <span className="text-sm font-bold uppercase tracking-widest">Invite Collaborator</span>
          </div>
          <button onClick={onClose} className="p-1 text-text-dim hover:text-red"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-dim uppercase px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@nexus.build"
                className="w-full bg-background border border-border pl-12 pr-4 py-3 text-sm font-code rounded-lg focus:border-accent outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-dim uppercase px-1">Access Role</label>
            <div className="grid grid-cols-2 gap-3">
              {['member', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-3 rounded-lg border text-[10px] font-bold transition-all \${
                    role === r ? 'bg-accent/10 border-accent text-accent' : 'bg-surface-2 border-border text-text-dim'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleInvite}
            disabled={isSending || !email}
            className="w-full py-4 bg-accent text-black font-bold text-sm rounded-lg hover:glow-accent transition-all disabled:opacity-50"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "SEND_NEXUS_INVITE"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
