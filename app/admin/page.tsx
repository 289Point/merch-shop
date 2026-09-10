import { createClient } from "@/lib/supabase/server";
import AdminProductForm from "./AdminProductForm";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select(
      "id, name, description, price, image_url, category, in_stock, gallery_urls, sort_order"
    )
    .order("sort_order", { ascending: true });

  return (
    <>
      <div className="admin-header">
        <h1>Pannello admin</h1>
        <p>Aggiungi, modifica o elimina i prodotti del catalogo.</p>
      </div>
      <AdminProductForm initialProducts={products ?? []} />
    </>
  );
}
