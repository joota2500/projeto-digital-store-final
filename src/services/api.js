// Serviço que busca os produtos na API do back-end
// Se a API não estiver no ar, usa o JSON estático (para o site na Vercel continuar funcionando)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const JSON_FALLBACK = '/api/products.json'

const TOKEN_KEY = 'digital_store_token'
const USER_KEY = 'digital_store_user'

// Guarda a lista depois da primeira busca para não repetir o pedido
let cacheProdutos = null
let cacheCategorias = null

function avisarAuthMudou() {
  window.dispatchEvent(new Event('auth-change'))
}

// Acha a opção de tamanho ou de cor na resposta da API
function acharOpcao(produto, titulo, tipo) {
  const opcoes = produto.options || []
  const peloTitulo = opcoes.find(
    (opcao) => opcao.title && opcao.title.toLowerCase() === titulo
  )
  if (peloTitulo) return peloTitulo
  return opcoes.find((opcao) => opcao.type === tipo)
}

// A API oficial não tem marca, gênero nem estado; tentamos descobrir pelo nome/descrição
function inferirMarca(nome) {
  const texto = (nome || '').toLowerCase()
  if (texto.includes('k-swiss') || texto.includes('k swiss')) return 'k-swiss'
  if (texto.includes('nike') || texto.includes('jordan')) return 'nike'
  if (texto.includes('adidas')) return 'adidas'
  if (texto.includes('puma')) return 'puma'
  if (texto.includes('balenciaga')) return 'balenciaga'
  return ''
}

function inferirGenero(nome) {
  const texto = (nome || '').toLowerCase()
  if (texto.includes('unissex')) return 'unissex'
  if (texto.includes('feminino')) return 'feminino'
  if (texto.includes('masculino')) return 'masculino'
  return 'unissex'
}

function inferirEstado(descricao) {
  // Usa palavra inteira para não confundir "usado" com "ousado"
  const texto = descricao || ''
  if (/\busado\b/i.test(texto)) return 'usado'
  return 'novo'
}

// Converte o formato oficial da API para o formato que as páginas já usam
function converterProduto(apiProduto, categoriasPorId) {
  const imagens = (apiProduto.images || []).map((img) => ({
    src: img.content || img.src,
  }))
  const thumb = imagens[0]?.src || ''
  const galeria = imagens.length > 1 ? imagens.slice(1) : imagens

  const slugCategoria = (apiProduto.category_ids || [])
    .map((id) => categoriasPorId[id])
    .find(Boolean) || apiProduto.category || ''

  const opcaoTamanho = acharOpcao(apiProduto, 'tamanho', 'text')
  const opcaoCor = acharOpcao(apiProduto, 'cor', 'color')

  const preco = Number(apiProduto.price)
  const precoComDesconto =
    apiProduto.price_with_discount !== undefined
      ? Number(apiProduto.price_with_discount)
      : undefined

  const marca = inferirMarca(apiProduto.name)
  const marcaLabel = marca ? marca.toUpperCase() : 'DIGITAL STORE'

  const produto = {
    id: apiProduto.id,
    name: apiProduto.name,
    image: thumb,
    price: preco,
    category: slugCategoria,
    brand: marca,
    gender: inferirGenero(apiProduto.name),
    condition: inferirEstado(apiProduto.description),
    reference:
      apiProduto.reference ||
      `Casual | ${marcaLabel} | REF:${38416700 + Number(apiProduto.id)}`,
    stars: apiProduto.stars ?? 4.7,
    rating: apiProduto.rating ?? 90,
    description: apiProduto.description || '',
    images: galeria,
    sizes: opcaoTamanho?.values || [],
    colors: opcaoCor?.values || [],
  }

  // Só inclui o desconto quando ele for menor que o preço original
  if (precoComDesconto !== undefined && precoComDesconto < preco) {
    produto.priceDiscount = precoComDesconto
  }

  return produto
}

async function buscarCategorias() {
  if (cacheCategorias) return cacheCategorias

  const resposta = await fetch(`${API_BASE}/v1/category/search?limit=-1`)
  if (!resposta.ok) {
    throw new Error('Não foi possível carregar as categorias.')
  }

  const json = await resposta.json()
  const mapa = {}
  ;(json.data || []).forEach((categoria) => {
    mapa[categoria.id] = categoria.slug
  })
  cacheCategorias = mapa
  return mapa
}

async function buscarNaApi() {
  const categorias = await buscarCategorias()
  const resposta = await fetch(`${API_BASE}/v1/product/search?limit=-1`)

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar os produtos.')
  }

  const json = await resposta.json()
  return (json.data || []).map((produto) => converterProduto(produto, categorias))
}

async function buscarNoJson() {
  const resposta = await fetch(JSON_FALLBACK)

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar os produtos.')
  }

  return resposta.json()
}

// Retorna todos os produtos (tenta a API e, se falhar, usa o JSON)
export async function getProducts() {
  if (cacheProdutos) {
    return cacheProdutos
  }

  try {
    cacheProdutos = await buscarNaApi()
  } catch {
    cacheProdutos = await buscarNoJson()
  }

  return cacheProdutos
}

// Busca um produto pelo ID da URL
export async function getProductById(id) {
  const produtos = await getProducts()
  return produtos.find((produto) => produto.id === Number(id))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUsuarioLogado() {
  const bruto = localStorage.getItem(USER_KEY)
  if (!bruto) return null

  try {
    return JSON.parse(bruto)
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  avisarAuthMudou()
}

// Login: POST /v1/user/token  — guarda o JWT no localStorage
export async function login(email, password) {
  let resposta

  try {
    resposta = await fetch(`${API_BASE}/v1/user/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Verifique se o back-end está rodando.'
    )
  }

  const dados = await resposta.json().catch(() => ({}))
  if (!resposta.ok) {
    throw new Error(dados.message || 'Não foi possível entrar.')
  }

  localStorage.setItem(TOKEN_KEY, dados.token)
  localStorage.setItem(USER_KEY, JSON.stringify({ email }))
  avisarAuthMudou()
  return dados
}

// Cadastro: POST /v1/user
export async function cadastrarUsuario({
  firstname,
  surname,
  email,
  password,
  confirmPassword,
}) {
  let resposta

  try {
    resposta = await fetch(`${API_BASE}/v1/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstname,
        surname,
        email,
        password,
        confirmPassword,
      }),
    })
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Verifique se o back-end está rodando.'
    )
  }

  const dados = await resposta.json().catch(() => ({}))
  if (!resposta.ok) {
    throw new Error(dados.message || 'Não foi possível cadastrar.')
  }

  return dados
}

// Confere se a API está no ar (usado em Meus Pedidos e no checkout)
export async function apiEstaNoAr() {
  try {
    const resposta = await fetch(`${API_BASE}/`, { signal: AbortSignal.timeout(3000) })
    return resposta.ok
  } catch {
    return false
  }
}

function erroDeRede() {
  const erro = new Error(
    'Os pedidos só funcionam com o back-end ligado. Rode o projeto com ./iniciar.sh para ver seus pedidos.'
  )
  erro.code = 'API_OFFLINE'
  return erro
}

async function requisicaoAutenticada(caminho, opcoes = {}) {
  const token = getToken()
  if (!token) {
    const erro = new Error('Faça login para continuar.')
    erro.code = 'UNAUTHENTICATED'
    throw erro
  }

  let resposta
  try {
    resposta = await fetch(`${API_BASE}${caminho}`, {
      ...opcoes,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(opcoes.headers || {}),
      },
    })
  } catch {
    throw erroDeRede()
  }

  if (resposta.status === 204) return null

  const dados = await resposta.json().catch(() => ({}))
  if (!resposta.ok) {
    const erro = new Error(dados.message || 'Não foi possível concluir a requisição.')
    erro.status = resposta.status
    throw erro
  }

  return dados
}

// POST /v1/order  — transforma o carrinho em um pedido
export async function criarPedido(corpo) {
  return requisicaoAutenticada('/v1/order', {
    method: 'POST',
    body: JSON.stringify(corpo),
  })
}

// GET /v1/order
export async function listarPedidos() {
  return requisicaoAutenticada('/v1/order')
}

// GET /v1/order/:id
export async function buscarPedido(id) {
  return requisicaoAutenticada(`/v1/order/${id}`)
}

// PUT /v1/order/:id/cancel
export async function cancelarPedido(id) {
  return requisicaoAutenticada(`/v1/order/${id}/cancel`, { method: 'PUT' })
}
