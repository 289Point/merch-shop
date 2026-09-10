import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/contact";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description, price, image_url")
    .eq("id", params.id)
    .single();

  if (!product) {
    return { title: "Prodotto non trovato" };
  }

  const title = `${product.name} — € ${product.price.toFixed(2)}`;
  const description =
    product.description ??
    `Scopri "${product.name}" nel catalogo di 289Point Showroom.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, in_stock, gallery_urls")
    .eq("id", params.id)
    .single();

  if (!product) {
    notFound();
  }

  const images = [
    ...(product.image_url ? [product.image_url] : []),
    ...(product.gallery_urls ?? []),
  ];

  return (
    <>
      <div className="product-detail">
        <ProductGallery name={product.name} images={images} />
        <div>
          <h1>{product.name}</h1>
          <div className="product-detail-price">
            € {product.price.toFixed(2)}
          </div>
          {product.in_stock === false && (
            <div className="product-detail-sold-out">
              Attualmente esaurito
            </div>
          )}
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
