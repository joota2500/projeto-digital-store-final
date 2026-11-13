import Layout from './Layout';
import Gallery from '../components/Gallery';
import ProductListing from '../components/ProductListing';
import { Link } from 'react-router-dom';
import { Shirt, Footprints, Glasses, Headphones } from 'lucide-react';
import { products } from '../data/products';

// Página inicial da Drip Store
// O Layout já possui <main>, então usamos <div> por fora
export default function HomePage() {
  // Imagens do carrossel principal
  const homeSlides = [
    '/home-slide-1.jpeg',
    '/home-slide-2.jpeg',
    '/home-slide-3.jpeg',
    '/home-slide-4.jpeg',
    '/home-slide-5.jpeg',
    '/home-slide-6.jpeg',
    '/home-slide-7.jpeg',
    '/home-slide-8.jpeg',
  ];

  // Imagens das coleções em destaque
  const collections = [
    { src: '/collection-1.png', alt: 'Novo drop Supreme' },
    { src: '/collection-2.png', alt: 'Coleção Adidas' },
    { src: '/collection-3.png', alt: 'Novo Beats Bass' },
  ];

  // Itens da segunda seção de coleções (círculos)
  const categoryItems = [
    { name: 'Camisetas', icon: Shirt },
    { name: 'Calças', icon: Footprints },
    { name: 'Bonés', icon: Glasses },
    { name: 'Headphones', icon: Headphones },
    { name: 'Tênis', icon: Footprints },
  ];

  return (
    <Layout>
      <div className="pb-16">
        {/* Carrossel principal */}
        <Gallery
          images={homeSlides}
          width="100%"
          height="681px"
          radius="0px"
          showArrows={false}
          showDots={true}
          className="mb-12"
        />

        {/* Seção: Coleções em destaque (com imagens e selos) */}
        <section className="max-w-[1440px] mx-auto px-6 mb-16">
          <h2 className="text-[24px] font-bold text-dark-gray-2 mb-8">
            Coleções em destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.src}
                className="relative rounded-[4px] overflow-hidden"
              >
                <img
                  src={collection.src}
                  alt={collection.alt}
                  className="w-full h-auto"
                />
                <span className="absolute top-4 left-4 bg-[#E7FF86] text-dark-gray-2 text-[14px] font-bold rounded-full px-3 py-1">
                  30% OFF
                </span>
                <Link
                  to="/products"
                  className="absolute bottom-4 left-4 bg-white text-primary font-bold text-[14px] rounded-[8px] w-[153px] h-[48px] flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  Comprar
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Segunda Section: Coleções em destaque (círculos com ícones) */}
        <section className="max-w-[1440px] mx-auto px-6 mb-16">
          <h2 className="text-[24px] font-bold text-dark-gray-2 mb-8 text-center">
            Coleções em destaque
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categoryItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  {/* Círculo branco com sombra leve */}
                  <div className="w-[104px] h-[104px] bg-white rounded-full shadow-md flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow">
                    <Icon
                      size={40}
                      className="text-dark-gray-2 group-hover:text-primary transition-colors"
                    />
                  </div>
                  {/* Nome abaixo */}
                  <span className="text-[14px] text-dark-gray-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Seção: Produtos em alta (dados de src/data/products.js) */}
        <section className="max-w-[1440px] mx-auto px-6 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[24px] font-bold text-dark-gray-2">
              Produtos em alta
            </h2>
            <Link
              to="/products"
              className="text-primary font-bold hover:underline"
            >
              Ver todos →
            </Link>
          </div>
          <ProductListing products={products} columns={4} />
        </section>

        {/* Bloco: Oferta especial (antes do rodapé) */}
        <section className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-[8px] p-8">
            {/* Imagem à esquerda */}
            <div>
              <img
                src="/product-thumb-1.jpeg"
                alt="Air Jordan edição de colecionador"
                className="w-full h-auto rounded-[4px] object-cover"
              />
            </div>

            {/* Texto à direita */}
            <div>
              <p className="text-warning text-[14px] font-bold mb-2">
                Oferta especial
              </p>
              <h3 className="text-dark-gray-2 text-[32px] font-bold mb-4 leading-tight">
                Air Jordan edição de colecionador
              </h3>
              <p className="text-dark-gray mb-6">
                Garanta o seu Air Jordan edição limitada de colecionador com desconto especial.
                Peça exclusiva com design clássico e qualidade premium.
              </p>
              <Link
                to="/product/1"
                className="inline-flex items-center justify-center bg-primary text-white font-bold rounded-[8px] w-[153px] h-[48px] hover:opacity-90 transition-opacity"
              >
                Ver Oferta
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
