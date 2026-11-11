import React from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { colones } from '../lib/api';
import ProductArt from './ProductArt';
const categoryLabels={kits:'Kits de cultivo',iluminacion:'Iluminación LED',carpas:'Carpas y clima',macetas:'Macetas',sustratos:'Sustratos y abonos',riego:'Riego e hidroponía',medicion:'Medición y control',herramientas:'Accesorios',genetica:'Semillas y plantines'};
export default function ProductCard({ product, onAdd, onSelect }) {
  const blocked = product.precio == null;
  const soldOut = product.stock <= 0;
  return <article className="product-card">
    <button className="product-picture" onClick={() => onSelect(product)} aria-label={`Ver ${product.nombre}`}>
      <ProductArt product={product} />
      {product.etiqueta && <span className="product-tag">{product.etiqueta}</span>}
      <span className="open-detail"><ArrowUpRight size={18} /></span>
    </button>
    <div className="product-info">
      <span className="eyebrow product-category">{categoryLabels[product.categoria]||product.categoria}</span>
      <button className="product-title" onClick={() => onSelect(product)}>{product.nombre}</button>
      <div className="product-bottom">
        <div><strong>{blocked ? 'Consultar' : colones(product.precio)}</strong><small>{blocked ? 'Consultar disponibilidad' : soldOut ? 'Sin existencias' : `${product.stock} disponibles`}</small></div>
        <button className="add-to-cart" onClick={() => onAdd(product)} disabled={blocked || soldOut} aria-label={blocked ? 'Consultar disponibilidad' : `Agregar ${product.nombre}`} title={blocked ? 'Consultar' : 'Agregar al carrito'}>
          <Plus size={20} />
        </button>
      </div>
    </div>
  </article>;
}
