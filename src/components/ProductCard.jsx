import React from 'react';
import { Link } from 'react-router-dom';

// Card de produto com preço original e desconto (preço riscado)
const ProductCard = ({ product }) => {
  const { id, name, image, price, priceDiscount } = product;
  const temDesconto = priceDiscount && priceDiscount < price;

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="bg-light-gray-3 rounded-lg overflow-hidden mb-3 aspect-[292/321] flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-sm text-dark-gray-2 line-clamp-2 mb-1">{name}</h3>
      <div className="flex items-baseline gap-2">
        {temDesconto ? (
          <>
            <span className="text-base text-light-gray line-through">R$ {price.toFixed(2).replace('.', ',')}</span>
            <span className="text-2xl font-bold text-dark-gray">R$ {priceDiscount.toFixed(2).replace('.', ',')}</span>
          </>
        ) : (
          <span className="text-2xl font-bold text-dark-gray">R$ {price.toFixed(2).replace('.', ',')}</span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
