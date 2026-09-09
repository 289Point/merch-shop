import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category?: string;
  in_stock?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-card-media">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 220px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="product-card-media-empty">Nessuna immagine</span>
        )}
        {product.in_stock === false && (
          <span className="product-card-sold-out">Esaurito</span>
        )}
      </div>
      <div className="product-card-body">
        {product.category && (
          <span className="product-card-category">{product.category}</span>
        )}
        <span className="product-card-name">{product.name}</span>
        <span className="product-card-price">
          € {product.price.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
