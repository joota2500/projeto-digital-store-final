import { useParams } from "react-router-dom";

import Layout from "./Layout";
import Section from "../components/Section";
import ProductListing from "../components/ProductListing";
import Gallery from "../components/Gallery";
import BuyBox from "../components/BuyBox";
import ProductOptions from "../components/ProductOptions";

import { products, getProductById } from "../data/products";

function ProductViewPage() {
  // Pega o ID do produto pela URL
  const { id } = useParams();

  // Busca o produto pelo ID
  const product = getProductById(id);

  // Se o produto não existir, mostra uma mensagem
  if (!product) {
    return (
      <Layout>
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-dark-gray-2">
            Produto não encontrado
          </h1>
        </div>
      </Layout>
    );
  }

  // Pega 4 produtos diferentes do produto atual
  const recommendedProducts = products
    .filter((item) => String(item.id) !== String(product.id))
    .slice(0, 4);

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-[14px] text-dark-gray-3 mb-8">
          <span>Home</span>
          <span>/</span>
          <span>Produtos</span>
          <span>/</span>
          <span>Tênis</span>
          <span>/</span>
          <span className="text-dark-gray-2 font-medium">
            {product.name}
          </span>
        </div>

        {/* Informações do produto */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16">

          {/* Galeria de imagens */}
          <div className="w-full lg:flex-1 min-w-0">
            <Gallery
              images={product.images}
              showThumbs
              width="700px"
              height="570px"
              radius="4px"
              className="max-w-full"
            />
          </div>

          {/* Informações e opções de compra */}
          <div className="w-full lg:flex-1 min-w-0">
            <BuyBox
              name={product.name}
              reference={product.reference}
              stars={product.stars}
              rating={product.rating}
              price={product.price}
              priceDiscount={product.priceDiscount}
              description={product.description}
            >

              {/* Opções de tamanho */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[14px] text-light-gray">
                  Tamanho
                </h3>

                <ProductOptions
                  options={product.sizes}
                  shape="square"
                  radius="4px"
                  type="text"
                />
              </div>

              {/* Opções de cor */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[14px] text-light-gray">
                  Cor
                </h3>

                <ProductOptions
                  options={product.colors}
                  shape="circle"
                  type="color"
                />
              </div>

            </BuyBox>
          </div>

        </div>

        {/* Produtos recomendados */}
        <Section
          title="Produtos recomendados"
          titleAlign="left"
          link={{
            text: "Ver todos",
            href: "/products",
          }}
        >
          <ProductListing products={recommendedProducts} />
        </Section>

      </div>
    </Layout>
  );
}

export default ProductViewPage;
