import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import { getProductById, products } from '../data/products';
import ProductListing from '../components/ProductListing';

// Página de visualização do produto
const ProductViewPage = () => {
  const { id } = useParams();
  const product = getProductById(id);

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl">Produto não encontrado</h1>
        </div>
      </Layout>
    );
  }

  const relacionados = products.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-light-gray-3 rounded-lg aspect-square flex items-center justify-center">
            <img src={product.image} alt={product.name} className="max-h-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-dark-gray mb-4">{product.name}</h1>
            <p className="text-dark-gray-3 mb-6">Categoria: {product.category}</p>
            <div className="text-3xl font-bold text-primary mb-6">
              R$ {(product.priceDiscount || product.price).toFixed(2)}
            </div>
            <button className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-tertiary transition">
              COMPRAR
            </button>
            <p className="mt-8 text-dark-gray-2 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Descrição do produto aqui. 
              Material de qualidade, confortável e estiloso. Perfeito para o dia a dia.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Produtos relacionados</h2>
        <ProductListing products={relacionados} />
      </div>
    </Layout>
  );
};

export default ProductViewPage;
