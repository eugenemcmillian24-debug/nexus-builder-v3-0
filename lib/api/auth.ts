import { db } from "@/lib/db";
import { apiKeys, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function validateApiKey(key: string) {
  if (!key) return null;

  const apiKeyRecord = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.key, key),
  });

  if (!apiKeyRecord) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, apiKeyRecord.userId),
  });

  if (!user) return null;

  // Update last used timestamp
  await db.update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, apiKeyRecord.id));

  return user;
}
