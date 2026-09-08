import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = !!user && user.email === process.env.ADMIN_EMAIL;

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-title">
          Il Tuo Merch
        </Link>
        <nav className="site-nav">
          {isAdmin && <Link href="/admin">Pannello admin</Link>}
          {user ? (
            <Link href="/logout">Esci ({user.email})</Link>
          ) : (
            <>
              <Link href="/login">Accedi</Link>
              <Link href="/register">Registrati</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
