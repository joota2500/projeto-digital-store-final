import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';

import Layout from './Layout';
import Section from '../components/Section';
import ProductListing from '../components/ProductListing';
import FilterGroup from '../components/FilterGroup';

import { getProducts } from '../services/api';
import { getFinalPrice, filterOptions } from '../data/products';

const filtrosVazios = {
  brand: [],
  category: [],
  gender: [],
  condition: [],
};

// Remove acentos para a busca funcionar com "tenis" e "tênis"
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function correspondeABusca(produto, termo) {
  if (!termo) return true;
  const alvo = normalizar(`tênis ${produto.name} ${produto.brand} ${produto.category} ${produto.gender}`);
  return normalizar(termo)
    .split(/\s+/)
    .every((palavra) => alvo.includes(palavra));
}

function PainelFiltros({ selected, temFiltroAtivo, onLimpar, onChange, onChangeUnico }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-dark-gray-2">Filtrar por</h2>
        {temFiltroAtivo && (
          <button
            type="button"
            onClick={onLimpar}
            className="text-sm text-primary hover:underline"
          >
            Limpar
          </button>
        )}
      </div>

      <hr className="mt-4 mb-4 border-light-gray-2" />

      {['brand', 'category', 'gender'].map((grupo) => (
        <FilterGroup
          key={grupo}
          title={filterOptions[grupo].title}
          inputType="checkbox"
          options={filterOptions[grupo].options}
          selected={selected[grupo]}
          onChange={(valor, marcado) => onChange(grupo, valor, marcado)}
        />
      ))}

      <FilterGroup
        title={filterOptions.condition.title}
        inputType="radio"
        options={filterOptions.condition.options}
        selected={selected.condition}
        onChange={(valor, marcado) => onChangeUnico('condition', valor, marcado)}
      />
    </>
  );
}

function ProductListingPage() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') ?? '';
  // Aceita ?category= ou ?categoria= (vindo da página de Categorias)
  const categoryParam = searchParams.get('category') ?? searchParams.get('categoria');
  const brandParam = searchParams.get('brand');

  const [products, setProducts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Ordenação começa em "Menor preço"
  const [order, setOrder] = useState('lowest');
  const [selected, setSelected] = useState(filtrosVazios);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Busca os produtos na API
  useEffect(() => {
    getProducts()
      .then((lista) => setProducts(lista))
      .catch(() => setErro('Não foi possível carregar os produtos. Tente novamente.'))
      .finally(() => setCarregando(false));
  }, []);

  // Se a URL trouxer categoria ou marca, já marca o filtro
  useEffect(() => {
    setSelected({
      ...filtrosVazios,
      category: categoryParam ? [categoryParam] : [],
      brand: brandParam ? [brandParam] : [],
    });
  }, [categoryParam, brandParam]);

  // Trava o scroll do fundo quando a gaveta de filtros está aberta
  useEffect(() => {
    if (!mostrarFiltros) return undefined;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [mostrarFiltros]);

  function atualizarFiltro(grupo, valor, marcado, somenteUm = false) {
    setSelected((atual) => ({
      ...atual,
      [grupo]: somenteUm
        ? [valor]
        : marcado
          ? [...atual[grupo], valor]
          : atual[grupo].filter((item) => item !== valor),
    }));
  }

  const filteredProducts = useMemo(() => {
    const resultado = products.filter((produto) => {
      if (!correspondeABusca(produto, filter)) return false;
      if (selected.brand.length && !selected.brand.includes(produto.brand)) return false;
      if (selected.category.length && !selected.category.includes(produto.category)) return false;
      if (selected.gender.length && !selected.gender.includes(produto.gender)) return false;
      if (selected.condition.length && !selected.condition.includes(produto.condition)) return false;
      return true;
    });

    if (order === 'relevance') return resultado;

    return [...resultado].sort((a, b) =>
      order === 'lowest'
        ? getFinalPrice(a) - getFinalPrice(b)
        : getFinalPrice(b) - getFinalPrice(a)
    );
  }, [products, filter, selected, order]);

  const temFiltroAtivo = Object.values(selected).some((lista) => lista.length > 0);
  const quantidade = filteredProducts.length;
  const titulo = `${filter ? `Resultados para “${filter}” - ` : ''}${quantidade} ${
    quantidade === 1 ? 'produto' : 'produtos'
  }`;

  const propsFiltros = {
    selected,
    temFiltroAtivo,
    onLimpar: () => setSelected(filtrosVazios),
    onChange: (grupo, valor, marcado) => atualizarFiltro(grupo, valor, marcado),
    onChangeUnico: (grupo, valor, marcado) => atualizarFiltro(grupo, valor, marcado, true),
  };

  return (
    <Layout>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-5 md:px-10 md:py-8 lg:flex-row lg:items-start lg:gap-7 xl:px-[100px]">

        {/* No desktop: ordenar + filtros na lateral. No celular: só o select e o botão. */}
        <aside className="flex w-full shrink-0 items-center gap-2 lg:w-[308px] lg:flex-col lg:items-stretch lg:gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-2">
            <label htmlFor="sort" className="text-xs text-dark-gray-2 md:text-sm lg:text-base">
              Ordenar por
            </label>
            <select
              id="sort"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="h-10 w-full cursor-pointer rounded border border-dark-gray-2 bg-transparent px-3 text-sm text-dark-gray-2 outline-none focus:border-primary md:h-12 md:text-base lg:h-[60px] lg:w-[308px]"
            >
              <option value="lowest">Menor preço</option>
              <option value="highest">Maior preço</option>
              <option value="relevance">Mais relevantes</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setMostrarFiltros(true)}
            className="mt-5 flex h-10 shrink-0 items-center justify-center gap-2 rounded bg-primary px-3 text-sm font-bold text-white lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filtrar
          </button>

          {/* Filtros no desktop */}
          <div className="hidden rounded bg-white p-6 lg:block lg:w-[308px]">
            <PainelFiltros {...propsFiltros} />
          </div>
        </aside>

        {/* Gaveta de filtros no celular */}
        {mostrarFiltros && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Fechar filtros"
              className="absolute inset-0 bg-black/40"
              onClick={() => setMostrarFiltros(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              className="absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-light-gray-2 px-4 py-3">
                <p className="text-base font-bold text-dark-gray-2">Filtros</p>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setMostrarFiltros(false)}
                  className="text-dark-gray-2"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <PainelFiltros {...propsFiltros} />
              </div>
              <div className="border-t border-light-gray-2 p-4">
                <button
                  type="button"
                  onClick={() => setMostrarFiltros(false)}
                  className="flex h-11 w-full items-center justify-center rounded bg-primary text-sm font-bold text-white"
                >
                  Ver {quantidade} {quantidade === 1 ? 'produto' : 'produtos'}
                </button>
              </div>
            </div>
          </div>
        )}

        <Section title={titulo} titleAlign="left" className="min-w-0 flex-1">
          {carregando && (
            <p className="py-12 text-center text-dark-gray-3">Carregando...</p>
          )}
          {erro && (
            <p className="py-12 text-center text-error">{erro}</p>
          )}
          {!carregando && !erro && (
            <ProductListing products={filteredProducts} columns={3} />
          )}
        </Section>
      </div>
    </Layout>
  );
}

export default ProductListingPage;
