import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Layout from "./Layout";
import Section from "../components/Section";
import ProductListing from "../components/ProductListing";
import FilterGroup from "../components/FilterGroup";

import { products } from "../data/products";

function ProductListingPage() {
  // Pega o filtro que vem pela URL
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "";

  // Guarda a opção de ordenação
  const [order, setOrder] = useState("");

  // Calcula os produtos filtrados e ordenados
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtra pelo nome ou categoria
    if (filter) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(filter.toLowerCase()) ||
        product.category.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Ordena pelo preço, considerando o desconto
    if (order === "menor") {
      result.sort((a, b) => {
        const priceA = a.priceDiscount ?? a.price;
        const priceB = b.priceDiscount ?? b.price;

        return priceA - priceB;
      });
    }

    if (order === "maior") {
      result.sort((a, b) => {
        const priceA = a.priceDiscount ?? a.price;
        const priceB = b.priceDiscount ?? b.price;

        return priceB - priceA;
      });
    }

    return result;
  }, [filter, order]);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-8 px-4 py-8">

        {/* Barra lateral de filtros */}
        <aside className="w-full md:w-[308px] shrink-0 flex flex-col gap-5">

          {/* Ordenação */}
          <div className="flex flex-col gap-3">
            <label className="text-[16px] font-medium text-dark-gray-2">
              Ordenar por
            </label>

            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full h-[60px] px-4 border border-light-gray-2 rounded text-dark-gray-2 bg-white outline-none"
            >
              <option value="">Selecione</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
            </select>
          </div>

          {/* Caixa de filtros */}
          <div className="w-full bg-white p-5 flex flex-col gap-5 rounded">

            <h2 className="text-[16px] font-medium text-dark-gray-2">
              Filtrar por
            </h2>

            <div className="w-full h-[1px] bg-light-gray-2"></div>

            {/* Filtro por marca */}
            <FilterGroup
              title="Marca"
              inputType="checkbox"
              options={[
                { text: "Adidas" },
                { text: "Nike" },
                { text: "Puma" },
                { text: "K-Swiss" },
              ]}
            />

            <div className="w-full h-[1px] bg-light-gray-2"></div>

            {/* Filtro por categoria */}
            <FilterGroup
              title="Categoria"
              inputType="checkbox"
              options={[
                { text: "Esporte e lazer" },
                { text: "Casual" },
                { text: "Utilitário" },
                { text: "Corrida" },
              ]}
            />

            <div className="w-full h-[1px] bg-light-gray-2"></div>

            {/* Filtro por gênero */}
            <FilterGroup
              title="Gênero"
              inputType="checkbox"
              options={[
                { text: "Masculino" },
                { text: "Feminino" },
                { text: "Unisex" },
              ]}
            />

            <div className="w-full h-[1px] bg-light-gray-2"></div>

            {/* Filtro por estado */}
            <FilterGroup
              title="Estado"
              inputType="radio"
              options={[
                { text: "Novo" },
                { text: "Usado" },
              ]}
            />

          </div>
        </aside>

        {/* Lista de produtos */}
        <div className="flex-1 min-w-0">
          <Section
            title={`Resultados para "${filter || "todos os produtos"}" - ${filteredProducts.length} produtos`}
            titleAlign="left"
          >
            <ProductListing products={filteredProducts} />
          </Section>
        </div>

      </div>
    </Layout>
  );
}

export default ProductListingPage;
