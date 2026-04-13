"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, Plus, Users, Settings, Building2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Organization {
  id: number;
  name: string;
  slug: string;
  role: string;
}

export default function TeamSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    const res = await fetch("/api/orgs");
    const data = await res.json();
    setOrgs(data.orgs);
    if (data.orgs.length > 0) setActiveOrg(data.orgs[0]);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-all border border-transparent hover:border-border group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-accent" />
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-xs font-bold text-text truncate uppercase tracking-tighter">
              {activeOrg?.name || "Personal Workspace"}
            </p>
            <p className="text-[9px] text-text-dim uppercase">{activeOrg?.role || "Owner"}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-text-dim transition-transform \${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 z-[100] glass-panel rounded-xl shadow-2xl overflow-hidden p-2"
          >
            <div className="text-[9px] font-bold text-text-dim uppercase p-2 tracking-[0.2em]">Switch Organization</div>
            <div className="space-y-1">
              {orgs.map((org) => (
                <button
                  key={org.id}
                  onClick={() => { setActiveOrg(org); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-all \${
                    activeOrg?.id === org.id ? 'bg-accent/10 text-accent' : 'hover:bg-surface-2 text-text-dim hover:text-text'
                  }`}
                >
                  <span className="text-xs font-bold">{org.name}</span>
                  {activeOrg?.id === org.id && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
            <div className="h-[1px] bg-border/50 my-2" />
            <button className="w-full flex items-center gap-3 p-2 text-xs font-bold text-text-dim hover:text-accent hover:bg-accent/5 rounded-lg transition-all">
              <Plus className="w-4 h-4" /> CREATE_TEAM
            </button>
            <button className="w-full flex items-center gap-3 p-2 text-xs font-bold text-text-dim hover:text-text hover:bg-surface-2 rounded-lg transition-all">
              <Settings className="w-4 h-4" /> ORG_SETTINGS
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
