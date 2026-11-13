import { Link } from 'react-router-dom';

// Card de produto individual
// Mantém o Link para /product/${id}
export default function ProductCard({ product }) {
  if (!product) return null;

  const {
    id,
    name,
    image,
    category,
    price,
    priceDiscount,
  } = product;

  // Formata preço com vírgula (ex: 299,90)
  const formatPrice = (value) => {
    return Number(value).toFixed(2).replace('.', ',');
  };

  return (
    <Link to={`/product/${id}`} className="block group">
      <div className="bg-white rounded-[4px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Imagem com fundo branco e selo de desconto */}
        <div className="relative bg-white aspect-square">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
          {/* Selo 30% OFF quando houver priceDiscount */}
          {priceDiscount && (
            <span className="absolute top-3 left-3 bg-[#E7FF86] text-dark-gray-2 text-[14px] font-bold rounded-full px-3 py-1">
              30% OFF
            </span>
          )}
        </div>

        {/* Informações do produto */}
        <div className="p-4">
          {/* Categoria acima do nome */}
          {category && (
            <p className="text-[12px] font-bold text-light-gray mb-1">
              {category}
            </p>
          )}

          {/* Nome do produto */}
          <h3 className="text-dark-gray-2 font-medium mb-2 line-clamp-2">
            {name}
          </h3>

          {/* Preços */}
          <div className="flex items-center gap-2">
            {priceDiscount && (
              <span className="text-light-gray line-through text-sm">
                R$ {formatPrice(price)}
              </span>
            )}
            <span className="text-dark-gray font-bold text-[24px]">
              R$ {formatPrice(priceDiscount || price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
