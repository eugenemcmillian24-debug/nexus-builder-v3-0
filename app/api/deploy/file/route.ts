import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { pushToGitHub } from "@/lib/github/sync";
import { deployToVercel } from "@/lib/deploy/vercel";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path, content, repoUrl, repoName } = await req.json();

  try {
    await pushToGitHub(user.id, repoName || "nexus-project", [{ path, content }]);
    const { deployUrl } = await deployToVercel(repoUrl || "", repoName || "nexus-project");
    return NextResponse.json({ success: true, deployUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
