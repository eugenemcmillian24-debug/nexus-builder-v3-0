"use client";
import { Zap, Check } from "lucide-react";
import { useState } from "react";

const PLANS = [
  { id: "starter", name: "Starter", price: 9, credits: 90, features: ["Standard AI", "GitHub Sync", "9 Builds/mo"] },
  { id: "pro", name: "PRO", price: 29, credits: 150, features: ["Llama 3.1 70B", "Vercel Deploys", "Priority Support", "15 Builds/mo"] },
  { id: "enterprise", name: "Enterprise", price: 99, credits: 600, features: ["Custom AI Router", "Team Seats", "API Access", "Unlimited History"] }
];

export default function CreditsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (planId: string) => {
    setLoading(planId);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({ planId })
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold glitch mb-4">RECHARGE_PROTOCOLS</h1>
          <p className="text-text-muted">Select a plan to fuel your nexus builds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`p-8 bg-surface terminal-border flex flex-col \${plan.id === 'pro' ? 'border-accent scale-105 shadow-[0_0_30px_rgba(0,255,136,0.1)]' : ''}`}>
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 uppercase tracking-widest">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-accent">\${plan.price}</span>
                  <span className="text-text-dim text-xs">/mo</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                <div className="flex items-center gap-3 p-3 bg-surface-2 border border-border rounded">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold">{plan.credits} Credits</span>
                </div>
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-text-muted">
                    <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePurchase(plan.id)}
                disabled={!!loading}
                className={`w-full py-4 font-bold text-sm transition-all \${
                  plan.id === 'pro' ? 'bg-accent text-black hover:bg-white' : 'bg-surface-2 text-text hover:bg-border'
                }`}
              >
                {loading === plan.id ? "INITIALIZING..." : "SELECT_PLAN"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}