import Layout from './Layout'
import Section from '../components/Section'
import ProductListing from '../components/ProductListing'
import Gallery from '../components/Gallery'
import { products } from '../data/products'

function HomePage() {
  // Imagens do banner principal
  const imagensBanner = [
    { src: '/home-slide-1.jpeg' },
    { src: '/home-slide-2.jpeg' },
    { src: '/home-slide-3.jpeg' },
    { src: '/home-slide-4.jpeg' },
    { src: '/home-slide-5.jpeg' },
    { src: '/home-slide-6.jpeg' },
    { src: '/home-slide-7.jpeg' },
    { src: '/home-slide-8.jpeg' },
  ]

  return (
    <Layout>
      <main className="w-full">

        {/* Banner principal */}
        <Gallery
          images={imagensBanner}
          width="1440px"
          height="681px"
          className="mx-auto max-w-full"
        />

        <div className="max-w-[1200px] mx-auto px-4">

          {/* Coleções em destaque */}
          <Section
            title="Coleções em destaque"
            titleAlign="center"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

              <img
                src="/collection-1.png"
                alt="Coleção em destaque 1"
                className="w-full rounded-[4px]"
              />

              <img
                src="/collection-2.png"
                alt="Coleção em destaque 2"
                className="w-full rounded-[4px]"
              />

              <img
                src="/collection-3.png"
                alt="Coleção em destaque 3"
                className="w-full rounded-[4px]"
              />

            </div>
          </Section>

          {/* Produtos em alta */}
          <Section
            title="Produtos em alta"
            titleAlign="left"
            link={{
              text: 'Ver todos',
              href: '/products',
            }}
          >
            <ProductListing products={products} />
          </Section>

        </div>
      </main>
    </Layout>
  )
}

export default HomePage
