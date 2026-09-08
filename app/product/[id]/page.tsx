import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, name, description, price, image_url")
    .eq("id", params.id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="product-detail">
        <div className="product-detail-media">
          {product.image_url && (
            <img src={product.image_url} alt={product.name} />
          )}
        </div>
        <div>
          <h1>{product.name}</h1>
          <div className="product-detail-price">
            € {product.price.toFixed(2)}
          </div>
          {product.description && (
            <p className="product-detail-desc">{product.description}</p>
          )}
        </div>
      </div>
      <Link href="/" className="back-link">
        ← Torna al catalogo
      </Link>
    </>
  );
}
