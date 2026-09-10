import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = !!user && user.email === process.env.ADMIN_EMAIL;

  // Se hai caricato public/logo.png, viene mostrato automaticamente qui
  const hasLogo = fs.existsSync(path.join(process.cwd(), "public", "logo.png"));

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-title">
          {hasLogo && (
            <Image
              src="/logo.png"
              alt="289Point Showroom"
              width={36}
              height={36}
              className="site-logo"
            />
          )}
          289Point Showroom
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
