import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Layout from './Layout';
import Section from '../components/Section';
import ProductListing from '../components/ProductListing';
import Gallery from '../components/Gallery';
import BuyBox from '../components/BuyBox';
import ProductOptions from '../components/ProductOptions';

import { products, getProductById, categoryLabels } from '../data/products';

function ProductViewPage() {
  const { id } = useParams();
  const product = getProductById(id);
  const [adicionado, setAdicionado] = useState(false);

  // Limpa a mensagem ao abrir outro produto
  useEffect(() => {
    setAdicionado(false);
  }, [id]);

  if (!product) {
    return (
      <Layout>
        <div className="mx-auto max-w-[1440px] px-4 py-24 text-center md:px-10 xl:px-[100px]">
          <h1 className="text-2xl font-bold text-dark-gray">
            Produto não encontrado
          </h1>
          <Link to="/products" className="mt-6 inline-block text-lg text-primary hover:underline">
            Ver todos os produtos
          </Link>
        </div>
      </Layout>
    );
  }

  const categoria = categoryLabels[product.category] ?? product.category;
  const recommendedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-10 md:py-10 xl:px-[100px]">

        {/* Breadcrumb */}
        <nav aria-label="Trilha de navegação" className="mb-6 text-sm text-dark-gray-2">
          <ol className="flex flex-wrap gap-1">
            <li>
              <Link to="/" className="font-bold hover:text-primary">Home</Link>
              {' /'}
            </li>
            <li>
              <Link to="/products" className="hover:text-primary">Produtos</Link>
              {' /'}
            </li>
            <li>{categoria} /</li>
            <li className="text-dark-gray-3">{product.name}</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row xl:gap-10">
          <div className="w-full shrink-0 lg:w-[55%] lg:max-w-[700px]">
            {/* A key faz a galeria voltar para a primeira imagem ao trocar de produto */}
            <Gallery
              key={product.id}
              images={product.images}
              showThumbs
              width="700"
              height="570"
              radius="4px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <BuyBox
              name={product.name}
              reference={product.reference}
              stars={product.stars}
              rating={product.rating}
              price={product.price}
              priceDiscount={product.priceDiscount}
              description={product.description}
              onBuy={() => setAdicionado(true)}
            >
              <div>
                <h2 className="mb-2 text-sm font-bold text-light-gray">Tamanho</h2>
                <ProductOptions
                  options={product.sizes}
                  shape="square"
                  type="text"
                  radius="4px"
                  label="Tamanho"
                />
              </div>

              <div>
                <h2 className="mb-2 text-sm font-bold text-light-gray">Cor</h2>
                <ProductOptions
                  options={product.colors}
                  shape="circle"
                  type="color"
                  label="Cor"
                />
              </div>
            </BuyBox>

            {adicionado && (
              <p role="status" className="mt-4 text-sm font-bold text-success">
                Produto adicionado ao carrinho!
              </p>
            )}
          </div>
        </div>

        <Section
          title="Produtos recomendados"
          titleAlign="left"
          link={{ text: 'Ver todos', href: '/products' }}
          className="mt-16 md:mt-20"
        >
          <ProductListing products={recommendedProducts} columns={4} />
        </Section>
      </div>
    </Layout>
  );
}

export default ProductViewPage;
