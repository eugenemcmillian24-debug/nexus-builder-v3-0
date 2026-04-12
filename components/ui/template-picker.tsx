"use client";
import React from "react";
import { Layout, MessageSquare, User, ShoppingBag, Zap } from "lucide-react";
import { BlueprintTemplate, BLUEPRINT_TEMPLATES } from "@/lib/ai/templates";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, any> = {
  Layout,
  MessageSquare,
  User,
  ShoppingBag
};

interface TemplatePickerProps {
  onSelect: (template: BlueprintTemplate) => void;
  selectedId?: string;
}

export default function TemplatePicker({ onSelect, selectedId }: TemplatePickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-bold text-text-dim uppercase tracking-widest flex items-center gap-2">
          <Zap className="w-3 h-3 text-accent" /> SELECT_TEMPLATE
        </h3>
        <span className="text-[9px] text-accent/50">PRESET_CONFIGS</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {BLUEPRINT_TEMPLATES.map((template) => {
          const Icon = ICON_MAP[template.icon] || Layout;
          const isActive = selectedId === template.id;

          return (
            <motion.button
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(template)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isActive 
                ? "bg-accent/10 border-accent shadow-[0_0_20px_rgba(0,255,136,0.1)]" 
                : "bg-surface-2/50 border-border/50 hover:border-accent/30 hover:bg-surface"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${isActive ? "bg-accent text-black" : "bg-surface text-accent"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-bold ${isActive ? "text-accent" : "text-text"}`}>
                  {template.name}
                </span>
              </div>
              <p className="text-[10px] text-text-dim leading-relaxed line-clamp-2">
                {template.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
