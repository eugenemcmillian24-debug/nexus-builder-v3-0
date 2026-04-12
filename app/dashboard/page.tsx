import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { builds, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";\nimport { RestoreButton } from "@/components/ui/restore-button";
import { Terminal, ExternalLink, Cpu, CreditCard, RotateCcw, Loader2 } from "lucide-react";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) return null;

  const userData = await db.query.users.findFirst({ where: eq(users.id, user.id) });
  const userBuilds = await db.query.builds.findMany({
    where: eq(builds.userId, user.id),
    orderBy: [desc(builds.createdAt)],
  });

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold glitch mb-2">OPERATOR_DASHBOARD</h1>
            <p className="text-text-muted">Welcome back, \${userData?.name || "User"}.</p>
          </div>
          <div className="flex gap-4">
            <div className="p-4 bg-surface terminal-border flex items-center gap-3">
              <Cpu className="text-accent w-5 h-5" />
              <div>
                <p className="text-[10px] text-text-dim uppercase tracking-widest">Available Credits</p>
                <p className="text-xl font-bold text-accent">{userData?.credits ?? 0}</p>
              </div>
            </div>
            <Link href="/credits" className="p-4 bg-surface-2 border border-border-2 hover:bg-surface transition-colors flex items-center gap-3">
              <CreditCard className="text-blue w-5 h-5" />
              <span className="text-sm font-bold">REFILL</span>
            </Link>
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-accent" /> RECENT_BUILDS
            </h2>
            <Link href="/" className="text-xs text-accent hover:underline">NEW_PROJECT +</Link>
          </div>

          <div className="grid gap-4">
            {userBuilds.length === 0 ? (
              <div className="p-12 text-center bg-surface terminal-border">
                <p className="text-text-dim">No builds detected in sector. Initialize first project.</p>
              </div>
            ) : (
              userBuilds.map((build) => (
                <Link 
                  key={build.id} 
                  href={`/dashboard/builds/\${build.id}`}
                  className="group p-6 bg-surface terminal-border hover:border-accent transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs text-text-dim mb-1">{new Date(build.createdAt).toLocaleString()}</p>
                    <h3 className="font-bold text-text group-hover:text-accent transition-colors truncate max-w-md">
                      {build.prompt}
                    </h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] text-text-dim uppercase">Status</p>
                      <p className={`text-xs font-bold \${build.status === 'complete' ? 'text-accent' : 'text-orange'}`}>
                        {build.status.toUpperCase()}
                      </p>
                    </div>
                    {build.deployUrl && (
                      <a 
                        href={build.deployUrl} 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-text-muted hover:text-blue"
                      >
                        <ExternalLink className="w-4 h-4" />\n                      </a>\n                    )}\n                    {build.status === "complete" && (\n                      <RestoreButton buildId={build.id} />
                      </a>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}