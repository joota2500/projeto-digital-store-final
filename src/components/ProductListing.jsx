import React from 'react';
import ProductCard from './ProductCard';

// Lista os produtos em grid
const ProductListing = ({ products }) => {
  if (!products || products.length === 0) {
    return <p className="text-center text-dark-gray-2 py-8">Nenhum produto encontrado.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductListing;
