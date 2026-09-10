import { createClient } from "@/lib/supabase/server";
import CatalogBrowser from "@/components/CatalogBrowser";

export default async function CatalogPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
        .select("id, name, price, image_url, category, in_stock")
        .order("sort_order", { ascending: true });
  return (
    <>
           <div className="catalog-intro">
        <h1>Autenticità e qualità, senza compromessi.</h1>
        <p>
          Questo è il nostro spazio dedicato al merchandising di
          Pallacanestro Budrio: qui potrete scoprire i capi e i prodotti che
          abbiamo scelto per rappresentare i nostri colori, dentro e fuori
          dal campo. Lo showroom online è pensato per farvi conoscere le
          nostre proposte, ma vi aspettiamo per vedere i prodotti da vicino
          nel nostro Point fisico. Cerchiamo inoltre di costruire, passo
          dopo passo, una linea sempre più attenta all&apos;ambiente e a
          scelte green ed ecosostenibili, guardando anche al futuro. Per
          qualsiasi informazione, non esitate a contattarci: tutti i nostri
          recapiti sono a vostra disposizione in questa pagina.
        </p>
      </div>
