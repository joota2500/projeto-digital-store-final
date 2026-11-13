import ProductCard from './ProductCard';

// Listagem de produtos com grid responsivo
// Prop columns (padrão 4): 4 colunas na Home e 3 na página de listagem
export default function ProductListing({ products = [], columns = 4 }) {
  const colsClass = columns === 3 ? 'xl:grid-cols-3' : 'lg:grid-cols-4';

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-dark-gray-3 md:text-base">
        Nenhum produto encontrado.
      </p>
    );
  }

  return (
    <ul className={`grid grid-cols-2 gap-x-3 gap-y-5 md:gap-x-6 md:gap-y-8 ${colsClass}`}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
