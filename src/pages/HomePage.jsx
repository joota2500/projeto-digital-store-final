import React from 'react';
import Layout from './Layout';
import Section from '../components/Section';
import ProductListing from '../components/ProductListing';
import Gallery from '../components/Gallery';
import { products } from '../data/products';

const slides = [
  { src: 'https://picsum.photos/id/101/1440/500', alt: 'Promoção 1' },
  { src: 'https://picsum.photos/id/102/1440/500', alt: 'Promoção 2' },
  { src: 'https://picsum.photos/id/103/1440/500', alt: 'Promoção 3' },
];

const HomePage = () => {
  const produtosEmAlta = products.slice(0, 8);

  return (
    <Layout>
      <Gallery images={slides} height="420px" />

      <div className="max-w-7xl mx-auto px-4">
        <Section title="Coleções em destaque" titleAlign="center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary/10 rounded-lg h-40 flex items-center justify-center font-semibold text-primary">Nova Coleção</div>
            <div className="bg-secondary/30 rounded-lg h-40 flex items-center justify-center font-semibold">Ofertas</div>
            <div className="bg-tertiary/10 rounded-lg h-40 flex items-center justify-center font-semibold text-tertiary">Mais Vendidos</div>
          </div>
        </Section>

        <Section title="Produtos em alta" titleAlign="left" link={{ text: 'Ver todos →', href: '/products' }}>
          <ProductListing products={produtosEmAlta} />
        </Section>
      </div>
    </Layout>
  );
};

export default HomePage;
