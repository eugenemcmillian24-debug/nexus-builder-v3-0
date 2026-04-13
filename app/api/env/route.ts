import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { builds } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { buildId, key, value, action } = await req.json();

  try {
    const build = await db.query.builds.findFirst({
      where: and(eq(builds.id, buildId), eq(builds.userId, user.id)),
    });

    if (!build) return NextResponse.json({ error: "Build not found" }, { status: 404 });

    console.log(`[ENV] \${action}: \${key}=\${value} for build \${buildId}`);

    return NextResponse.json({ success: true, message: `Environment variable \${key} \${action === 'delete' ? 'removed' : 'updated'}.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
