import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet: any[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch {}
          },
        },
      }
    );
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Sync user to Neon DB
      const existingUser = await db.query.users.findFirst({ where: eq(users.id, data.user.id) });
      if (!existingUser) {
        await db.insert(users).values({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.full_name || data.user.user_metadata.user_name,
          avatarUrl: data.user.user_metadata.avatar_url,
          credits: 0,
          plan: "starter"
        });
      }
      return NextResponse.redirect(`\${origin}\${next}`);
    }
  }

  return NextResponse.redirect(`\${origin}/login?error=auth_failed`);
}