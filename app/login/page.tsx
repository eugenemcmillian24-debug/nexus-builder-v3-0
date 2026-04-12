"use client";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import { Github } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `\${window.location.origin}/auth/callback` }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 rounded-lg terminal-border bg-surface">
        <h1 className="text-3xl font-bold glitch mb-2">ACCESS_GRANTED?</h1>
        <p className="text-text-muted mb-8 text-sm">Initialize nexus protocol via GitHub authentication.</p>

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 flex items-center justify-center gap-3 bg-white text-black font-bold rounded hover:bg-accent transition-colors disabled:opacity-50"
        >
          <Github className="w-5 h-5" />
          {loading ? "AUTHORIZING..." : "CONNECT GITHUB"}
        </button>
      </div>
    </div>
  );
}