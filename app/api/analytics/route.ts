import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { creditTx, builds } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId");

  // Fetch credit usage over time
  const usageStats = await db.select({
    date: sql`DATE(created_at)`,
    total: sql`SUM(amount)`,
  })
  .from(creditTx)
  .where(eq(creditTx.userId, user.id))
  .groupBy(sql`DATE(created_at)`)
  .orderBy(sql`DATE(created_at)`);

  // Fetch build success rates
  const buildStats = await db.select({
    status: builds.status,
    count: sql`COUNT(*)`,
  })
  .from(builds)
  .where(eq(builds.userId, user.id))
  .groupBy(builds.status);

  return NextResponse.json({ usageStats, buildStats });
}
