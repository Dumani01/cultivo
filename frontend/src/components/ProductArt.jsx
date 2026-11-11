import React from 'react';
export default function ProductArt({ product, hero = false }) {
  return <div className={`product-art tone-${product.categoria || 'kits'} ${hero ? 'hero-art' : ''}`}>
    <img src={`/art/${product.imagen || 'kit'}.svg`} alt={product.nombre} loading={hero ? 'eager' : 'lazy'} />
  </div>;
}
