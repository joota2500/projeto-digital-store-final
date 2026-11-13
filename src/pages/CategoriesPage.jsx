import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Layout from './Layout';
import Section from '../components/Section';
import { getProducts } from '../services/api';
import { categoryLabels } from '../data/products';

// Agrupa os produtos pela categoria do JSON e pega uma imagem de exemplo
function agruparCategorias(produtos) {
  const grupos = {};

  produtos.forEach((produto) => {
    const chave = produto.category;
    if (!grupos[chave]) {
      grupos[chave] = {
        slug: chave,
        nome: categoryLabels[chave] || chave,
        quantidade: 0,
        imagem: produto.image,
      };
    }
    grupos[chave].quantidade += 1;
  });

  return Object.values(grupos);
}

function CategoriesPage() {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Busca os produtos na API e monta os cards de categoria
  useEffect(() => {
    getProducts()
      .then((lista) => setCategorias(agruparCategorias(lista)))
      .catch(() => setErro('Não foi possível carregar as categorias. Tente novamente.'))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-[1440px] px-4 py-5 md:px-10 md:py-10 xl:px-[100px]">
        <Section title="Categorias" titleAlign="left">
          <p className="mb-5 -mt-1 text-sm text-dark-gray-3 md:mb-8 md:text-base">
            Escolha uma categoria para ver os produtos da loja.
          </p>

          {carregando && (
            <p className="py-16 text-center text-dark-gray-3">Carregando...</p>
          )}
          {erro && (
            <p className="py-16 text-center text-error">{erro}</p>
          )}
          {!carregando && !erro && (
            <ul className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
              {categorias.map((categoria) => (
                <li key={categoria.slug}>
                  <Link
                    to={`/products?category=${categoria.slug}`}
                    className="group block overflow-hidden rounded bg-white"
                  >
                    <div className="overflow-hidden bg-white">
                      <img
                        src={categoria.imagem}
                        alt={categoria.nome}
                        className="aspect-[292/321] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3 md:p-5">
                      <h3 className="text-sm font-bold text-dark-gray-2 md:text-xl">
                        {categoria.nome}
                      </h3>
                      <p className="mt-0.5 text-xs text-dark-gray-3 md:mt-1 md:text-sm">
                        {categoria.quantidade}{' '}
                        {categoria.quantidade === 1 ? 'produto' : 'produtos'}
                      </p>
                      <p className="mt-2 text-xs font-bold text-primary md:mt-3 md:text-sm">
                        Ver produtos
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </Layout>
  );
}

export default CategoriesPage;
