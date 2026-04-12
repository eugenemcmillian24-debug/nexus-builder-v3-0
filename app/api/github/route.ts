import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { pullFromGitHub, registerWebhook } from "@/lib/github/sync";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, repoName, owner } = await req.json();

  if (action === "pull") {
    await pullFromGitHub(user.id, repoName);
    return NextResponse.json({ success: true });
  }

  if (action === "register-webhook") {
    await registerWebhook(owner, repoName);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}