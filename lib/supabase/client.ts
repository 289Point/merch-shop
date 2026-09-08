import { createBrowserClient } from "@supabase/ssr";

// Usato nei componenti "client" (quelli con "use client" in cima al file)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
