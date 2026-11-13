// Textos, cores e regras usados no carrinho e em Meus Pedidos

export const FRETE_PADRAO = 19.9
export const FRETE_GRATIS_A_PARTIR = 200

export function calcularFrete(subtotal) {
  return subtotal >= FRETE_GRATIS_A_PARTIR ? 0 : FRETE_PADRAO
}

export const statusLabels = {
  pendente: 'Pendente',
  pago: 'Pago',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

// Cores do selo de status, no mesmo visual da loja
export function classeStatus(status) {
  switch (status) {
    case 'pago':
      return 'bg-secondary text-dark-gray'
    case 'enviado':
      return 'bg-dark-gray-2 text-white'
    case 'entregue':
      return 'bg-success text-white'
    case 'cancelado':
      return 'bg-error text-white'
    default:
      return 'bg-warning text-white'
  }
}

export const pagamentoLabels = {
  pix: 'Pix',
  cartao: 'Cartão de crédito',
  boleto: 'Boleto',
}

export function formatarDataPedido(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Evita que o parâmetro redirect do login leve para outro site
export function destinoSeguro(valor, padrao = '/') {
  if (typeof valor === 'string' && valor.startsWith('/') && !valor.startsWith('//')) {
    return valor
  }
  return padrao
}

export const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

// Máscara simples de CEP (00000-000)
export function formatarCep(valor) {
  const digits = String(valor).replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}
