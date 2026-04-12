import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { builds, generatedFiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { FileCode, Globe, Github, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function BuildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  if (!user) return null;

  const build = await db.query.builds.findFirst({
    where: and(eq(builds.id, parseInt(id)), eq(builds.userId, user.id)),
  });

  if (!build) notFound();

  const files = await db.query.generatedFiles.findMany({
    where: eq(generatedFiles.buildId, build.id),
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-text-dim hover:text-accent mb-8 transition-colors">
          <ChevronLeft className="w-3 h-3" /> BACK_TO_DASHBOARD
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 bg-surface terminal-border">
              <h1 className="text-2xl font-bold text-text mb-4">{build.prompt}</h1>
              <div className="flex flex-wrap gap-4">
                {build.repoUrl && (
                  <a href={build.repoUrl} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-surface-2 border border-border text-sm hover:border-accent transition-all">
                    <Github className="w-4 h-4" /> REPOSITORY
                  </a>
                )}
                {build.deployUrl && (
                  <a href={build.deployUrl} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-accent text-black font-bold text-sm hover:opacity-90 transition-all">
                    <Globe className="w-4 h-4" /> LIVE_DEPLOY
                  </a>
                )}
              </div>
            </div>

            <div className="bg-surface terminal-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-surface-2 flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue" /> GENERATED_FILES ({files.length})
                </span>
              </div>
              <div className="divide-y divide-border">
                {files.map((file) => (
                  <div key={file.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-2 transition-colors">
                    <span className="text-xs font-code text-text-muted">{file.path}</span>
                    <span className="text-[10px] text-text-dim">{(file.sizeBytes / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-surface-2 border border-border">
              <h3 className="text-xs font-bold text-text-dim mb-4 uppercase tracking-widest">Build Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-xs text-text-muted">Status</span>
                  <span className="text-xs font-bold text-accent uppercase">{build.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-muted">Credits Used</span>
                  <span className="text-xs font-bold text-orange">{build.creditsUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-muted">Timestamp</span>
                  <span className="text-xs font-bold">{new Date(build.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}