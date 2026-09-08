import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-card-media">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <span className="product-card-media-empty">Nessuna immagine</span>
        )}
      </div>
      <div className="product-card-body">
        <span className="product-card-name">{product.name}</span>
        <span className="product-card-price">
          € {product.price.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
