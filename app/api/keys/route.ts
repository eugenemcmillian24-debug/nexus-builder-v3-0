import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await db.query.apiKeys.findMany({
    where: eq(apiKeys.userId, user.id),
    orderBy: (apiKeys, { desc }) => [desc(apiKeys.createdAt)],
  });

  return NextResponse.json({ keys });
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const key = `nx_\${crypto.randomBytes(24).toString("hex")}`;

  const [newKey] = await db.insert(apiKeys).values({
    userId: user.id,
    name,
    key,
  }).returning();

  return NextResponse.json({ key: newKey });
}

export async function DELETE(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  await db.delete(apiKeys).where(
    and(eq(apiKeys.id, parseInt(id)), eq(apiKeys.userId, user.id))
  );

  return NextResponse.json({ success: true });
}
