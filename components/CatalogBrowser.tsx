"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
};

export default function CatalogBrowser({
  products,
}: {
  products: Product[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tutte");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["Tutte", ...unique];
  }, [products]);

  const filtered = products.filter((product) => {
    const matchesCategory =
      activeCategory === "Tutte" || product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="catalog-controls">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca un prodotto…"
          className="catalog-search"
        />
        <div className="catalog-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={
                "catalog-category-chip" +
                (activeCategory === cat ? " active" : "")
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          Nessun prodotto trovato con questi filtri.
        </div>
      )}
    </>
  );
}
