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
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-10 md:py-10 xl:px-[100px]">
        <Section title="Categorias" titleAlign="left">
          <p className="mb-8 -mt-2 text-base text-dark-gray-3">
            Escolha uma categoria para ver os produtos da loja.
          </p>

          {carregando && (
            <p className="py-16 text-center text-dark-gray-3">Carregando...</p>
          )}
          {erro && (
            <p className="py-16 text-center text-error">{erro}</p>
          )}
          {!carregando && !erro && (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-dark-gray-2 md:text-xl">
                        {categoria.nome}
                      </h3>
                      <p className="mt-1 text-sm text-dark-gray-3">
                        {categoria.quantidade}{' '}
                        {categoria.quantidade === 1 ? 'produto' : 'produtos'}
                      </p>
                      <p className="mt-3 text-sm font-bold text-primary">
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
