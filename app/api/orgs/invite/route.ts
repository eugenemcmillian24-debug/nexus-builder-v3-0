import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { organizations, teamMembers, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orgId, email, role } = await req.json();

  // Check if current user is admin/owner of the org
  const member = await db.query.teamMembers.findFirst({
    where: and(eq(teamMembers.orgId, orgId), eq(teamMembers.userId, user.id))
  });

  if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Find user by email
  const targetUser = await db.query.users.findFirst({
    where: eq(users.email, email)
  });

  if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await db.insert(teamMembers).values({
    orgId,
    userId: targetUser.id,
    role: role || "member",
  }).onConflictDoUpdate({
    target: [teamMembers.userId, teamMembers.orgId],
    set: { role: role || "member" }
  });

  return NextResponse.json({ success: true });
}
