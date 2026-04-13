import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { organizations, teamMembers, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // List all orgs the user is a member of
  const members = await db.query.teamMembers.findMany({
    where: eq(teamMembers.userId, user.id),
    with: { organization: true }
  });

  return NextResponse.json({ orgs: members.map(m => ({ ...m.organization, role: m.role })) });
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, slug } = await req.json();
  if (!name || !slug) return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });

  try {
    const result = await db.transaction(async (tx) => {
      const [org] = await tx.insert(organizations).values({
        name,
        slug,
        ownerId: user.id,
        credits: 0,
      }).returning();

      await tx.insert(teamMembers).values({
        orgId: org.id,
        userId: user.id,
        role: "owner",
      });

      return org;
    });

    return NextResponse.json({ org: result });
  } catch (err: any) {
    return NextResponse.json({ error: "Slug already taken or invalid data" }, { status: 400 });
  }
}
