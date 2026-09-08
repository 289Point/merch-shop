"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
};

export default function AdminProductForm({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description ?? "");
    setPrice(String(product.price));
    setImageUrl(product.image_url ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsedPrice = parseFloat(price.replace(",", "."));
    if (Number.isNaN(parsedPrice)) {
      setError("Inserisci un prezzo valido.");
      return;
    }

    setLoading(true);

    const payload = {
      name,
      description: description || null,
      price: parsedPrice,
      image_url: imageUrl || null,
    };

    if (editingId) {
      const { data, error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId)
        .select()
        .single();

      setLoading(false);

      if (error) {
        setError("Non è stato possibile salvare le modifiche.");
        return;
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? (data as Product) : p))
      );
      resetForm();
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select()
        .single();

      setLoading(false);

      if (error) {
        setError("Non è stato possibile aggiungere il prodotto.");
        return;
      }

      setProducts((prev) => [data as Product, ...prev]);
      resetForm();
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Eliminare questo prodotto?");
    if (!confirmed) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      setError("Non è stato possibile eliminare il prodotto.");
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <div className="admin-layout">
      <div className="admin-panel">
        <h2>{editingId ? "Modifica prodotto" : "Nuovo prodotto"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="description">Descrizione</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="price">Prezzo (€)</label>
            <input
              id="price"
              required
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="29.90"
            />
          </div>
          <div className="field">
            <label htmlFor="image_url">URL immagine</label>
            <input
              id="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading
              ? "Salvataggio…"
              : editingId
              ? "Salva modifiche"
              : "Aggiungi prodotto"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: 10 }}
              onClick={resetForm}
            >
              Annulla modifica
            </button>
          )}
          {error && <p className="form-message error">{error}</p>}
        </form>
      </div>

      <div className="admin-list">
        {products.length === 0 && (
          <div className="empty-state">Nessun prodotto ancora creato.</div>
        )}
        {products.map((product) => (
          <div className="admin-row" key={product.id}>
            <div className="admin-row-thumb">
              {product.image_url && (
                <img src={product.image_url} alt={product.name} />
              )}
            </div>
            <div className="admin-row-info">
              <div className="admin-row-name">{product.name}</div>
              <div className="admin-row-price">
                € {product.price.toFixed(2)}
              </div>
            </div>
            <div className="admin-row-actions">
              <button
                className="btn btn-secondary"
                style={{ width: "auto", padding: "6px 12px", fontSize: "0.85rem" }}
                onClick={() => startEdit(product)}
              >
                Modifica
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(product.id)}
              >
                Elimina
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
