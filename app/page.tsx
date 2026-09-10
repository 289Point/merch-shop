import { createClient } from "@/lib/supabase/server";
import CatalogBrowser from "@/components/CatalogBrowser";

export default async function CatalogPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, image_url, category, in_stock")
    .order("sort_order", { ascending: true });

  const { data: settings } = await supabase
    .from("site_settings")
    .select("catalog_title, catalog_subtitle")
    .eq("id", 1)
    .single();

  return (
    <>
      <div className="catalog-intro">
        <h1>{settings?.catalog_title ?? "Catalogo"}</h1>
        {settings?.catalog_subtitle && <p>{settings.catalog_subtitle}</p>}
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
