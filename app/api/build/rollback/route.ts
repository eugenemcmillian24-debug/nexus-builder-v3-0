import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { builds, generatedFiles, githubRepos } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { pushToGitHub } from "@/lib/github/sync";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { buildId } = await req.json();

  try {
    const build = await db.query.builds.findFirst({
      where: and(eq(builds.id, buildId), eq(builds.userId, user.id)),
    });

    if (!build) return NextResponse.json({ error: "Build not found" }, { status: 404 });

    const files = await db.query.generatedFiles.findMany({
      where: eq(generatedFiles.buildId, build.id),
    });

    if (!files.length) return NextResponse.json({ error: "No files found for this build" }, { status: 400 });

    const repoName = build.repoUrl?.split("/").pop() || "";
    if (!repoName) return NextResponse.json({ error: "Repository URL not found" }, { status: 400 });

    // Push previous files to GitHub
    const repoUrl = await pushToGitHub(user.id, repoName, files.map(f => ({ path: f.path, content: f.content })));

    // Create a NEW build record for the rollback
    await db.insert(builds).values({
      userId: user.id,
      prompt: `Rollback to build #\${buildId}: \${build.prompt}`,
      repoUrl,
      status: "complete",
      fileCount: files.length,
      completedAt: new Date()
    });

    return NextResponse.json({ success: true, repoUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
