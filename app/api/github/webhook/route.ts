import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { githubRepos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { pullFromGitHub } from "@/lib/github/sync";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  const hmac = crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET!);
  const digest = `sha256=\${hmac.update(payload).digest("hex")}`;

  if (signature !== digest) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const data = JSON.parse(payload);

  // Skip bot pushes to prevent loops
  if (data.pusher.name === process.env.GITHUB_BOT_USERNAME) {
    return NextResponse.json({ skip: true });
  }

  const repoName = data.repository.name;
  const repo = await db.query.githubRepos.findFirst({ where: eq(githubRepos.repoName, repoName) });

  if (repo) {
    await pullFromGitHub(repo.userId, repoName);
  }

  return NextResponse.json({ success: true });
}