import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products';

// Card de um produto (usado na Home, na listagem e nos recomendados)
export default function ProductCard({ product }) {
  if (!product) return null;

  const { id, name, image, price, priceDiscount } = product;

  // Só mostra o selo quando o preço com desconto é menor que o original
  const temDesconto = priceDiscount !== undefined && priceDiscount < price;
  const porcentagem = temDesconto
    ? Math.round((1 - priceDiscount / price) * 100)
    : 0;

  return (
    <Link to={`/product/${id}`} className="group block">
      {/* Área da imagem com fundo branco */}
      <div className="relative overflow-hidden rounded bg-white">
        {temDesconto && (
          <span className="absolute top-2 left-2 rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold text-dark-gray-2 md:top-3 md:left-3 md:px-3 md:py-1 md:text-xs">
            {porcentagem}% OFF
          </span>
        )}
        <img
          src={image}
          alt={name}
          width={292}
          height={321}
          className="aspect-[292/321] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Categoria fixa "Tênis", como no design */}
      <p className="mt-2 text-[10px] font-bold text-light-gray md:mt-3 md:text-xs">
        Tênis
      </p>

      <h3 className="mt-0.5 line-clamp-2 text-sm leading-snug text-dark-gray-2 md:text-lg">
        {name}
      </h3>

      <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
        {temDesconto ? (
          <>
            <del className="text-sm text-light-gray md:text-lg">
              {formatPrice(price)}
            </del>
            <span className="text-sm font-bold text-dark-gray md:text-lg">
              {formatPrice(priceDiscount)}
            </span>
          </>
        ) : (
          <span className="text-sm font-bold text-dark-gray md:text-lg">
            {formatPrice(price)}
          </span>
        )}
      </p>
    </Link>
  );
}
