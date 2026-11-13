// Lista de produtos da loja (dados mockados, sem banco de dados)
// Os campos seguem o que a página de produto e os filtros precisam

const descricaoPadrao =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.'

// Galeria da página de produto (os arquivos oficiais se chamam produc-image)
const imagensGaleria = [1, 2, 3, 4, 5].map((numero) => ({
  src: `/produc-image-${numero}.jpeg`,
}))

const listaProdutos = [
  {
    name: 'K-Swiss V8 - Masculino',
    price: 200,
    priceDiscount: 100,
    category: 'esporte-lazer',
    brand: 'k-swiss',
    gender: 'masculino',
    condition: 'novo',
  },
  {
    name: 'Tênis Nike Revolution 6 Next Nature Masculino',
    price: 219,
    category: 'corrida',
    brand: 'nike',
    gender: 'masculino',
    condition: 'novo',
  },
  {
    name: 'Air Jordan 1 Mid - Unissex',
    price: 899.9,
    priceDiscount: 749.9,
    category: 'casual',
    brand: 'nike',
    gender: 'unissex',
    condition: 'novo',
  },
  {
    name: 'Adidas Superstar - Feminino',
    price: 499.99,
    priceDiscount: 399.99,
    category: 'casual',
    brand: 'adidas',
    gender: 'feminino',
    condition: 'novo',
  },
  {
    name: 'Puma Suede Classic - Unissex',
    price: 349.9,
    category: 'casual',
    brand: 'puma',
    gender: 'unissex',
    condition: 'usado',
  },
  {
    name: 'Balenciaga Triple S - Masculino',
    price: 5999,
    priceDiscount: 4799,
    category: 'utilitario',
    brand: 'balenciaga',
    gender: 'masculino',
    condition: 'novo',
  },
  {
    name: 'Adidas Ultraboost 22 - Masculino',
    price: 999.99,
    priceDiscount: 699.99,
    category: 'corrida',
    brand: 'adidas',
    gender: 'masculino',
    condition: 'novo',
  },
  {
    name: 'Nike Air Max 90 - Feminino',
    price: 799.99,
    category: 'esporte-lazer',
    brand: 'nike',
    gender: 'feminino',
    condition: 'novo',
  },
  {
    name: 'K-Swiss Court Express - Feminino',
    price: 279.9,
    priceDiscount: 199.9,
    category: 'esporte-lazer',
    brand: 'k-swiss',
    gender: 'feminino',
    condition: 'usado',
  },
  {
    name: 'Puma RS-X - Masculino',
    price: 649.9,
    category: 'corrida',
    brand: 'puma',
    gender: 'masculino',
    condition: 'novo',
  },
  {
    name: 'Balenciaga Speed - Feminino',
    price: 4299,
    category: 'utilitario',
    brand: 'balenciaga',
    gender: 'feminino',
    condition: 'usado',
  },
  {
    name: 'Adidas Forum Low - Unissex',
    price: 599.99,
    priceDiscount: 479.99,
    category: 'casual',
    brand: 'adidas',
    gender: 'unissex',
    condition: 'novo',
  },
  {
    name: 'Nike Pegasus 40 - Masculino',
    price: 899.99,
    priceDiscount: 629.99,
    category: 'corrida',
    brand: 'nike',
    gender: 'masculino',
    condition: 'novo',
  },
  {
    name: 'K-Swiss Classic VN - Unissex',
    price: 329.9,
    category: 'casual',
    brand: 'k-swiss',
    gender: 'unissex',
    condition: 'novo',
  },
  {
    name: 'Puma Cali Dream - Feminino',
    price: 499.9,
    priceDiscount: 349.9,
    category: 'esporte-lazer',
    brand: 'puma',
    gender: 'feminino',
    condition: 'usado',
  },
]

// Completa cada produto com id, imagem, referência e dados da página de visualização
export const products = listaProdutos.map((produto, index) => ({
  id: index + 1,
  image: `/product-thumb-${(index % 5) + 1}.jpeg`,
  reference: `Casual | ${produto.brand.toUpperCase()} | REF:${38416711 + index * 7}`,
  stars: 4.7,
  rating: 90,
  description: descricaoPadrao,
  images: imagensGaleria,
  sizes: ['39', '40', '41', '42', '43'],
  colors: ['#6FEEFF', '#FF6969', '#5E5E5E', '#6D70B7'],
  ...produto,
}))

// Busca um produto pelo ID da URL
export function getProductById(id) {
  return products.find((produto) => produto.id === Number(id))
}

// Preço final (usa o desconto quando existir)
export function getFinalPrice(produto) {
  return produto.priceDiscount ?? produto.price
}

// Formata o preço no padrão brasileiro (R$ 1.234,56)
export function formatPrice(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

// Textos amigáveis das categorias (usados no breadcrumb e nos filtros)
export const categoryLabels = {
  'esporte-lazer': 'Esporte e lazer',
  casual: 'Casual',
  utilitario: 'Utilitário',
  corrida: 'Corrida',
}

// Opções da barra de filtros da listagem
export const filterOptions = {
  brand: {
    title: 'Marca',
    options: [
      { text: 'Adidas', value: 'adidas' },
      { text: 'Balenciaga', value: 'balenciaga' },
      { text: 'K-Swiss', value: 'k-swiss' },
      { text: 'Nike', value: 'nike' },
      { text: 'Puma', value: 'puma' },
    ],
  },
  category: {
    title: 'Categoria',
    options: [
      { text: 'Esporte e lazer', value: 'esporte-lazer' },
      { text: 'Casual', value: 'casual' },
      { text: 'Utilitário', value: 'utilitario' },
      { text: 'Corrida', value: 'corrida' },
    ],
  },
  gender: {
    title: 'Gênero',
    options: [
      { text: 'Masculino', value: 'masculino' },
      { text: 'Feminino', value: 'feminino' },
      { text: 'Unissex', value: 'unissex' },
    ],
  },
  condition: {
    title: 'Estado',
    options: [
      { text: 'Novo', value: 'novo' },
      { text: 'Usado', value: 'usado' },
    ],
  },
}
