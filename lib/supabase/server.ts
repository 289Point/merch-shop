import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Usato nelle pagine "server" (quelle senza "use client"), dove leggiamo
// se l'utente è loggato e se è admin, prima ancora che la pagina si carichi
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chiamato da un Server Component: si può ignorare se c'è
            // il middleware che rinfresca le sessioni
          }
        },
      },
    }
  );
}
