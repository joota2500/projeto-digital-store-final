'use strict';

// Os 15 produtos do front-end (public/api/products.json)
// As imagens apontam para os arquivos que já existem na pasta public do projeto
const produtos = [
  {
    name: 'K-Swiss V8 - Masculino',
    slug: 'k-swiss-v8-masculino',
    description: 'O K-Swiss V8 é um tênis masculino confortável para o dia a dia e para atividades leves. Tem visual esportivo e combina bem com looks casuais.',
    price: 200,
    price_with_discount: 100,
    category: 'esporte-lazer',
    thumb: '/media/product-thumb-1.jpeg',
  },
  {
    name: 'Tênis Nike Revolution 6 Next Nature Masculino',
    slug: 'tenis-nike-revolution-6-next-nature-masculino',
    description: 'Leve e macio, o Nike Revolution 6 Next Nature foi pensado para corridas leves e caminhadas, com um cabedal que deixa o pé respirar.',
    price: 219,
    price_with_discount: 219,
    category: 'corrida',
    thumb: '/media/product-thumb-2.jpeg',
  },
  {
    name: 'Air Jordan 1 Mid - Unissex',
    slug: 'air-jordan-1-mid-unissex',
    description: 'O Air Jordan 1 Mid é um ícone do basquete em versão unissex. O design clássico valoriza qualquer look casual, do jeans à calça mais estruturada.',
    price: 899.9,
    price_with_discount: 749.9,
    category: 'casual',
    thumb: '/media/product-thumb-3.jpeg',
  },
  {
    name: 'Adidas Superstar - Feminino',
    slug: 'adidas-superstar-feminino',
    description: 'O Superstar feminino traz as três listras e a ponteira de borracha que todo mundo reconhece. Um clássico confortável para usar no dia a dia.',
    price: 499.99,
    price_with_discount: 399.99,
    category: 'casual',
    thumb: '/media/product-thumb-4.jpeg',
  },
  {
    name: 'Puma Suede Classic - Unissex',
    slug: 'puma-suede-classic-unissex',
    description: 'O Suede Classic é um tênis casual de camurça, com visual retrô e caimento unissex. Esta unidade está em estado de usado, ainda com muito estilo.',
    price: 349.9,
    price_with_discount: 349.9,
    category: 'casual',
    thumb: '/media/product-thumb-5.jpeg',
  },
  {
    name: 'Balenciaga Triple S - Masculino',
    slug: 'balenciaga-triple-s-masculino',
    description: 'O Triple S é um tênis utilitário de solado robusto e presença marcante. Um modelo masculino para quem quer um visual mais ousado no dia a dia.',
    price: 5999,
    price_with_discount: 4799,
    category: 'utilitario',
    thumb: '/media/product-thumb-1.jpeg',
  },
  {
    name: 'Adidas Ultraboost 22 - Masculino',
    slug: 'adidas-ultraboost-22-masculino',
    description: 'O Ultraboost 22 foi feito para corrida, com o amortecimento macio da Boost e um cabedal que acompanha o movimento do pé nos treinos.',
    price: 999.99,
    price_with_discount: 699.99,
    category: 'corrida',
    thumb: '/media/product-thumb-2.jpeg',
  },
  {
    name: 'Nike Air Max 90 - Feminino',
    slug: 'nike-air-max-90-feminino',
    description: 'O Air Max 90 feminino junta o visual clássico da linha com o amortecimento visível no solado. Confortável para passeios e para o lazer.',
    price: 799.99,
    price_with_discount: 799.99,
    category: 'esporte-lazer',
    thumb: '/media/product-thumb-3.jpeg',
  },
  {
    name: 'K-Swiss Court Express - Feminino',
    slug: 'k-swiss-court-express-feminino',
    description: 'Inspirado nas quadras, o Court Express feminino é leve e fácil de combinar no dia a dia. Esta unidade está em estado de usado.',
    price: 279.9,
    price_with_discount: 199.9,
    category: 'esporte-lazer',
    thumb: '/media/product-thumb-4.jpeg',
  },
  {
    name: 'Puma RS-X - Masculino',
    slug: 'puma-rs-x-masculino',
    description: 'O RS-X masculino tem visual mais robusto e amortecimento generoso. Serve bem para correr ou para um look esportivo com personalidade.',
    price: 649.9,
    price_with_discount: 649.9,
    category: 'corrida',
    thumb: '/media/product-thumb-5.jpeg',
  },
  {
    name: 'Balenciaga Speed - Feminino',
    slug: 'balenciaga-speed-feminino',
    description: 'O Speed feminino é um tênis utilitário no estilo meia, fácil de calçar e com visual moderno. Esta unidade está em estado de usado.',
    price: 4299,
    price_with_discount: 4299,
    category: 'utilitario',
    thumb: '/media/product-thumb-1.jpeg',
  },
  {
    name: 'Adidas Forum Low - Unissex',
    slug: 'adidas-forum-low-unissex',
    description: 'O Forum Low retoma o estilo dos anos 80, com as tiras no tornozelo e um visual casual que serve para todos os gêneros.',
    price: 599.99,
    price_with_discount: 479.99,
    category: 'casual',
    thumb: '/media/product-thumb-2.jpeg',
  },
  {
    name: 'Nike Pegasus 40 - Masculino',
    slug: 'nike-pegasus-40-masculino',
    description: 'O Pegasus 40 é um tênis de corrida equilibrado: macio na pisada e estável o suficiente para os treinos no asfalto do dia a dia.',
    price: 899.99,
    price_with_discount: 629.99,
    category: 'corrida',
    thumb: '/media/product-thumb-3.jpeg',
  },
  {
    name: 'K-Swiss Classic VN - Unissex',
    slug: 'k-swiss-classic-vn-unissex',
    description: 'Simples e atemporal, o Classic VN unissex funciona bem no trabalho mais informal e também nos fins de semana.',
    price: 329.9,
    price_with_discount: 329.9,
    category: 'casual',
    thumb: '/media/product-thumb-4.jpeg',
  },
  {
    name: 'Puma Cali Dream - Feminino',
    slug: 'puma-cali-dream-feminino',
    description: 'O Cali Dream feminino tem plataforma leve e inspiração californiana, confortável para o lazer. Esta unidade está em estado de usado.',
    price: 499.9,
    price_with_discount: 349.9,
    category: 'esporte-lazer',
    thumb: '/media/product-thumb-5.jpeg',
  },
];

// Imagens da galeria (mesmo conjunto usado no JSON do front)
const imagensGaleria = [
  '/media/produc-image-1.jpeg',
  '/media/produc-image-2.jpeg',
  '/media/produc-image-3.jpeg',
  '/media/produc-image-4.jpeg',
  '/media/produc-image-5.jpeg',
];

module.exports = {
  async up(queryInterface) {
    const agora = new Date();

    // Pego os IDs reais das categorias (não dependo de serem 1, 2, 3...)
    const [categorias] = await queryInterface.sequelize.query(
      "SELECT id, slug FROM categories WHERE slug IN ('casual', 'esporte-lazer', 'corrida', 'utilitario')"
    );
    const idPorSlug = {};
    categorias.forEach((c) => {
      idPorSlug[c.slug] = c.id;
    });

    await queryInterface.bulkInsert(
      'products',
      produtos.map((p) => ({
        enabled: true,
        name: p.name,
        slug: p.slug,
        use_in_menu: false,
        stock: 10,
        description: p.description,
        price: p.price,
        price_with_discount: p.price_with_discount,
        created_at: agora,
        updated_at: agora,
      }))
    );

    const [inseridos] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM products WHERE slug IN (${produtos.map((p) => `'${p.slug}'`).join(', ')})`
    );
    const idPorProduto = {};
    inseridos.forEach((p) => {
      idPorProduto[p.slug] = p.id;
    });

    const imagens = [];
    const opcoes = [];
    const ligacoes = [];

    produtos.forEach((p) => {
      const productId = idPorProduto[p.slug];

      imagens.push({ product_id: productId, enabled: true, path: p.thumb });
      imagensGaleria.forEach((caminho) => {
        imagens.push({ product_id: productId, enabled: true, path: caminho });
      });

      opcoes.push({
        product_id: productId,
        title: 'Tamanho',
        shape: 'square',
        radius: 0,
        type: 'text',
        values: '39,40,41,42,43',
      });
      opcoes.push({
        product_id: productId,
        title: 'Cor',
        shape: 'circle',
        radius: 0,
        type: 'color',
        values: '#6FEEFF,#FF6969,#5E5E5E,#6D70B7',
      });

      ligacoes.push({
        product_id: productId,
        category_id: idPorSlug[p.category],
      });
    });

    await queryInterface.bulkInsert('product_images', imagens);
    await queryInterface.bulkInsert('product_options', opcoes);
    await queryInterface.bulkInsert('product_categories', ligacoes);
  },

  async down(queryInterface) {
    const slugs = produtos.map((p) => p.slug);
    const [encontrados] = await queryInterface.sequelize.query(
      `SELECT id FROM products WHERE slug IN (${slugs.map((s) => `'${s}'`).join(', ')})`
    );
    const ids = encontrados.map((p) => p.id);

    if (ids.length) {
      await queryInterface.bulkDelete('product_categories', { product_id: ids });
      await queryInterface.bulkDelete('product_options', { product_id: ids });
      await queryInterface.bulkDelete('product_images', { product_id: ids });
      await queryInterface.bulkDelete('products', { id: ids });
    }
  },
};
