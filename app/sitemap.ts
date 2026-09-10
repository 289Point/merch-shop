import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const SITE_URL = "https://289merch.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id")
    .order("created_at", { ascending: false });

  const productEntries: MetadataRoute.Sitemap = (products ?? []).map(
    (product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...productEntries,
  ];
}
