import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getServerAuth() {
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
  return supabase;
}

export async function getUser() {
  const supabase = await getServerAuth();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}