"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Zap, History, Settings, LogOut, Terminal as TerminalIcon } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { icon: TerminalIcon, label: "BUILDER", href: "/" },
  { icon: LayoutDashboard, label: "DASHBOARD", href: "/dashboard" },
  { icon: Zap, label: "CREDITS", href: "/credits" },
  { icon: History, label: "HISTORY", href: "/dashboard" },
];

export default function Sidebar({ credits }: { credits: number }) {
  const pathname = usePathname();

  return (
    <aside className="w-20 lg:w-64 border-r border-border bg-surface-2 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
          <Zap className="w-5 h-5 text-black fill-black" />
        </div>
        <span className="hidden lg:block font-bold tracking-tighter text-xl">NEXUS</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href}>
              <div className={`group relative flex items-center gap-4 p-3 rounded-lg transition-all ${
                isActive ? "bg-accent/10 text-accent" : "text-text-dim hover:bg-surface hover:text-text"
              }`}>
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-accent rounded-r-full" />
                )}
                <item.icon className="w-5 h-5" />
                <span className="hidden lg:block text-sm font-bold">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        <div className="hidden lg:block p-4 bg-background border border-border rounded-lg">
          <p className="text-[10px] text-text-dim uppercase mb-1">Compute Power</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-accent">{credits} CR</span>
            <Zap className="w-4 h-4 text-accent animate-pulse" />
          </div>
        </div>
        <button className="w-full flex items-center gap-4 p-3 text-red/60 hover:text-red hover:bg-red/5 rounded-lg transition-all">
          <LogOut className="w-5 h-5" />
          <span className="hidden lg:block text-sm font-bold">DISCONNECT</span>
        </button>
      </div>
    </aside>
  );
}
