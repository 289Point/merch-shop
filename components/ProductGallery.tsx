"use client";

import { useState } from "react";

export default function ProductGallery({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return <div className="product-detail-media" />;
  }

  return (
    <div>
      <div className="product-detail-media">
        <img src={images[selected]} alt={name} />
      </div>
      {images.length > 1 && (
        <div className="product-gallery-thumbs">
          {images.map((url, index) => (
            <button
              key={url + index}
              type="button"
              className={
                "product-gallery-thumb" +
                (index === selected ? " active" : "")
              }
              onClick={() => setSelected(index)}
              aria-label={`Mostra foto ${index + 1}`}
            >
              <img src={url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
