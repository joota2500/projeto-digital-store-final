import ProductCard from './ProductCard';

// Listagem de produtos com grid responsivo
// Prop columns (padrão 4): controla quantas colunas no desktop (lg)
export default function ProductListing({ products = [], columns = 4 }) {
  // Define a classe de colunas do Tailwind conforme a prop
  const colsClass = columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  // Mensagem quando nenhum produto for encontrado
  if (products.length === 0) {
    return (
      <p className="text-center text-dark-gray-3 py-10">
        Nenhum produto encontrado.
      </p>
    );
  }

  return (
    <div className={`grid grid-cols-2 ${colsClass} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
