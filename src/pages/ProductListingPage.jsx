import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import ProductListing from '../components/ProductListing';
import { products } from '../data/products';

// Página de listagem com filtro simples pela query e ordenação visual
const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || '';

  const produtosFiltrados = useMemo(() => {
    let lista = [...products];
    if (filter) {
      lista = lista.filter(p => 
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.category.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return lista;
  }, [filter]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar filtros (visual por enquanto) */}
        <aside className="w-72 hidden md:block">
          <div className="bg-white border border-light-gray-2 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-dark-gray-2 mb-2">Ordenar por</p>
            <select className="w-full border border-light-gray-2 rounded px-3 py-2 text-sm">
              <option>Menor preço</option>
              <option>Maior preço</option>
              <option>Mais relevantes</option>
            </select>
          </div>
          <div className="bg-white border border-light-gray-2 rounded-lg p-4">
            <h3 className="font-medium text-dark-gray-2 mb-3 border-b border-light-gray-2 pb-2">Filtrar por</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium mb-1">Categorias</p>
                <label className="flex items-center gap-2"><input type="checkbox" /> Camisetas</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Calças</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Tênis</label>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">
            {filter ? `Resultados para "${filter}"` : 'Todos os produtos'}
          </h1>
          <ProductListing products={produtosFiltrados} />
        </div>
      </div>
    </Layout>
  );
};

export default ProductListingPage;
