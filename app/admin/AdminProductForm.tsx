"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/imageCompress";
type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  in_stock: boolean;
  gallery_urls: string[];
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
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState(true);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  function resetForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setCategory("");
    setInStock(true);
    setGalleryUrls([]);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description ?? "");
    setPrice(String(product.price));
    setImageUrl(product.image_url ?? "");
    setCategory(product.category ?? "");
    setInStock(product.in_stock);
    setGalleryUrls(product.gallery_urls ?? []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    setError("");

    const file = await compressImage(rawFile);
    const filePath = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    setUploading(false);

    if (uploadError) {
      setError("Non è stato possibile caricare l'immagine.");
      return;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    setImageUrl(data.publicUrl);
  }

  async function handleGalleryFilesChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setError("");

    const uploadedUrls: string[] = [];

        for (const rawFile of Array.from(files)) {
      const file = await compressImage(rawFile);
      const filePath = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) {
        setError("Non è stato possibile caricare una o più immagini.");
        continue;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    setGalleryUrls((prev) => [...prev, ...uploadedUrls]);
    setUploadingGallery(false);
    e.target.value = "";
  }

  function removeGalleryImage(index: number) {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
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
      category: category.trim() || "Generale",
      in_stock: inStock,
      gallery_urls: galleryUrls,
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
            <label htmlFor="category">Categoria</label>
            <input
              id="category"
              list="category-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="es. T-shirt, Felpe, Accessori"
            />
            <datalist id="category-suggestions">
              {Array.from(new Set(products.map((p) => p.category))).map(
                (cat) => (
                  <option key={cat} value={cat} />
                )
              )}
            </datalist>
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
            <label htmlFor="image_file">Immagine</label>
            <input
              id="image_file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {uploading && (
              <span style={{ fontSize: "0.82rem", color: "var(--paper-muted)" }}>
                Caricamento in corso…
              </span>
            )}
            {imageUrl && !uploading && (
              <div
                style={{
                  width: 72,
                  height: 72,
                  border: "1px solid var(--paper-line)",
                  overflow: "hidden",
                  marginTop: 4,
                }}
              >
                <img
                  src={imageUrl}
                  alt="Anteprima"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
          </div>
          <div className="field">
            <label htmlFor="image_url">Oppure incolla un URL immagine</label>
            <input
              id="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="field">
            <label htmlFor="gallery_files">
              Altre foto (facoltativo, puoi selezionarne più di una insieme)
            </label>
            <input
              id="gallery_files"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryFilesChange}
            />
            {uploadingGallery && (
              <span style={{ fontSize: "0.82rem", color: "var(--paper-muted)" }}>
                Caricamento in corso…
              </span>
            )}
            {galleryUrls.length > 0 && (
              <div className="gallery-thumbs">
                {galleryUrls.map((url, index) => (
                  <div className="gallery-thumb" key={url + index}>
                    <img src={url} alt={`Foto ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      aria-label="Rimuovi foto"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="field field-checkbox">
            <label htmlFor="in_stock">
              <input
                id="in_stock"
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
              Disponibile (deseleziona per segnarlo come esaurito)
            </label>
          </div>
          <button
            className="btn"
            type="submit"
            disabled={loading || uploading || uploadingGallery}
          >
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
              <div className="admin-row-name">
                {product.name}
                {!product.in_stock && (
                  <span className="admin-badge-sold-out">Esaurito</span>
                )}
              </div>
              <div className="admin-row-price">
                {product.category} · € {product.price.toFixed(2)}
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
