import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

export default async function CatalogPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, image_url")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="catalog-intro">
        <h1>Catalogo</h1>
        <p>Dai un&apos;occhiata ai capi disponibili. I prezzi sono indicativi.</p>
      </div>

      {products && products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          Nessun prodotto ancora in catalogo. Torna a trovarci presto.
        </div>
      )}
    </>
  );
}
