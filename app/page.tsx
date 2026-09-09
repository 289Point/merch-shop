import { createClient } from "@/lib/supabase/server";
import CatalogBrowser from "@/components/CatalogBrowser";

export default async function CatalogPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
        .select("id, name, price, image_url, category, in_stock")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="catalog-intro">
        <h1>Catalogo</h1>
        <p>Dai un&apos;occhiata ai capi disponibili. I prezzi sono indicativi.</p>
      </div>

      {products && products.length > 0 ? (
        <CatalogBrowser products={products} />
      ) : (
        <div className="empty-state">
          Nessun prodotto ancora in catalogo. Torna a trovarci presto.
        </div>
      )}
    </>
  );
}
