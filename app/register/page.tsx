"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Non è stato possibile completare la registrazione.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="form-shell">
        <h1>Controlla la tua email</h1>
        <p className="subtitle">
          Ti abbiamo inviato un link di conferma a {email}. Aprilo per
          attivare il tuo account.
        </p>
        <Link href="/login" className="btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          Vai al login
        </Link>
      </div>
    );
  }

  return (
    <div className="form-shell">
      <h1>Registrati</h1>
      <p className="subtitle">Crea un account per accedere al sito.</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Registrazione in corso…" : "Registrati"}
        </button>
        {error && <p className="form-message error">{error}</p>}
      </form>
      <p className="form-footnote">
        Hai già un account? <Link href="/login">Accedi</Link>
      </p>
    </div>
  );
}
