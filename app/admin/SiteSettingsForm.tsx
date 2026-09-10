"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SiteSettingsForm({
  initialTitle,
  initialSubtitle,
}: {
  initialTitle: string;
  initialSubtitle: string;
}) {
  const supabase = createClient();
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase
      .from("site_settings")
      .update({ catalog_title: title, catalog_subtitle: subtitle })
      .eq("id", 1);

    setLoading(false);

    if (error) {
      setError("Non è stato possibile salvare i testi.");
      return;
    }

    setMessage("Testi salvati.");
  }

  return (
    <div className="admin-panel" style={{ marginBottom: 32 }}>
      <h2>Testi della homepage</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="catalog_title">Titolo</label>
          <input
            id="catalog_title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="catalog_subtitle">Sottotitolo / descrizione</label>
          <textarea
            id="catalog_subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={6}
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Salvataggio…" : "Salva testi"}
        </button>
        {message && <p className="form-message success">{message}</p>}
        {error && <p className="form-message error">{error}</p>}
      </form>
    </div>
  );
}
