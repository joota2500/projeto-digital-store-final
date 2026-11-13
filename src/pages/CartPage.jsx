import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, Barcode, Minus, Plus, Trash2 } from 'lucide-react';
import Layout from './Layout';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import {
  calcularFrete,
  FRETE_GRATIS_A_PARTIR,
  ESTADOS_BR,
  pagamentoLabels,
} from '../data/orders';
import { criarPedido, getUsuarioLogado } from '../services/api';

const campo =
  'h-10 w-full rounded-lg bg-light-gray-3 px-3 text-sm text-dark-gray-2 outline-none placeholder:text-light-gray md:h-11 md:px-4';

const formas = [
  { id: 'pix', label: 'Pix', detalhe: 'Aprovação na hora', Icon: QrCode },
  { id: 'cartao', label: 'Cartão de crédito', detalhe: 'Em até 12x (simulado)', Icon: CreditCard },
  { id: 'boleto', label: 'Boleto', detalhe: 'Confirmação em 1 a 2 dias', Icon: Barcode },
];

function formatarCep(valor) {
  const digits = String(valor).replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function CartPage() {
  const navigate = useNavigate();
  const { itens, alterarQuantidade, remover, limpar, subtotal, quantidadeTotal } = useCart();
  const usuario = getUsuarioLogado();
  const frete = calcularFrete(subtotal);
  const total = subtotal + frete;
  const faltaFrete = Math.max(0, FRETE_GRATIS_A_PARTIR - subtotal);
  const progressoFrete = Math.min(100, (subtotal / FRETE_GRATIS_A_PARTIR) * 100);

  const [form, setForm] = useState({
    recipient: '',
    zipcode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'CE',
    payment_method: 'pix',
  });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  function atualizar(campoNome, valor) {
    setForm((atual) => ({ ...atual, [campoNome]: valor }));
  }

  async function finalizar(e) {
    e.preventDefault();
    setErro('');

    if (!usuario) {
      navigate(`/login?redirect=${encodeURIComponent('/carrinho')}`);
      return;
    }

    if (!itens.length) return;

    setEnviando(true);
    try {
      await criarPedido({
        recipient: form.recipient.trim(),
        zipcode: form.zipcode.trim(),
        street: form.street.trim(),
        number: form.number.trim(),
        complement: form.complement.trim() || undefined,
        neighborhood: form.neighborhood.trim(),
        city: form.city.trim(),
        state: form.state,
        payment_method: form.payment_method,
        items: itens.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          size: item.size || undefined,
          color: item.color || undefined,
        })),
      });
      limpar();
      navigate('/meus-pedidos?sucesso=1');
    } catch (err) {
      setErro(err.message || 'Não foi possível finalizar a compra.');
    } finally {
      setEnviando(false);
    }
  }

  if (!itens.length) {
    return (
      <Layout>
        <div className="mx-auto max-w-[1440px] px-4 py-16 text-center md:px-10 md:py-20 xl:px-[100px]">
          <h1 className="text-xl font-bold text-dark-gray md:text-2xl">Seu carrinho está vazio</h1>
          <p className="mt-2 text-sm text-dark-gray-3 md:text-base">
            Que tal dar uma olhada nos tênis da loja?
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex h-10 items-center rounded bg-primary px-6 text-sm font-bold text-white hover:bg-tertiary"
          >
            Ver produtos
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-[1440px] px-4 py-5 md:px-10 md:py-8 xl:px-[100px]">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 md:mb-5">
          <div>
            <h1 className="text-xl font-bold text-dark-gray md:text-2xl">Meu carrinho</h1>
            <p className="mt-0.5 text-xs text-dark-gray-3 md:text-sm">
              {quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'}
            </p>
          </div>
          <Link to="/products" className="text-xs font-bold text-primary hover:underline md:text-sm">
            Continuar comprando
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
          <section aria-label="Itens do carrinho" className="flex flex-col gap-3">
            {itens.map((item) => (
              <article
                key={item.key}
                className="flex gap-3 rounded-lg bg-white p-3 md:gap-4 md:p-4"
              >
                <Link to={`/product/${item.productId}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-16 rounded object-cover md:size-20"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-sm font-bold text-dark-gray hover:text-primary md:text-base"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-dark-gray-3">
                        {item.size && <span>Tam. {item.size}</span>}
                        {item.color && (
                          <span className="inline-flex items-center gap-1">
                            Cor
                            <span
                              className="inline-block size-2.5 rounded-full border border-light-gray-2"
                              style={{ backgroundColor: item.color }}
                              aria-hidden
                            />
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remover(item.key)}
                      aria-label={`Remover ${item.name}`}
                      className="text-light-gray hover:text-error"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 md:mt-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        disabled={item.quantity <= 1}
                        onClick={() => alterarQuantidade(item.key, item.quantity - 1)}
                        className="flex size-7 items-center justify-center rounded border border-light-gray-2 text-dark-gray-2 disabled:opacity-40"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-5 text-center text-sm font-bold text-dark-gray">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        onClick={() => alterarQuantidade(item.key, item.quantity + 1)}
                        className="flex size-7 items-center justify-center rounded border border-light-gray-2 text-dark-gray-2"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-dark-gray md:text-base">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-lg bg-white p-4 lg:sticky lg:top-4">
            <h2 className="text-base font-bold text-dark-gray">Resumo</h2>

            <div className="mt-3">
              {faltaFrete > 0 ? (
                <p className="text-xs text-dark-gray-3 md:text-sm">
                  Faltam <strong className="text-primary">{formatPrice(faltaFrete)}</strong> para frete grátis
                </p>
              ) : (
                <p className="text-xs font-bold text-success md:text-sm">Você ganhou frete grátis!</p>
              )}
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-light-gray-3">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progressoFrete}%` }}
                />
              </div>
            </div>

            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-dark-gray-2">
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-dark-gray-2">
                <dt>Frete</dt>
                <dd>{frete === 0 ? 'Grátis' : formatPrice(frete)}</dd>
              </div>
              <div className="flex justify-between border-t border-light-gray-2 pt-2 text-sm font-bold text-dark-gray md:text-base">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            {!usuario ? (
              <div className="mt-4">
                <p className="mb-2 text-xs text-dark-gray-3 md:text-sm">
                  Entre na sua conta para finalizar a compra.
                </p>
                <Link
                  to={`/login?redirect=${encodeURIComponent('/carrinho')}`}
                  className="flex h-11 items-center justify-center rounded bg-primary text-sm font-bold text-white hover:bg-tertiary"
                >
                  Entrar para finalizar
                </Link>
              </div>
            ) : (
              <form onSubmit={finalizar} className="mt-4 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-dark-gray">Entrega</h3>

                <div>
                  <label htmlFor="recipient" className="mb-1 block text-xs font-bold text-dark-gray-2">
                    Quem vai receber
                  </label>
                  <input
                    id="recipient"
                    required
                    value={form.recipient}
                    onChange={(e) => atualizar('recipient', e.target.value)}
                    placeholder="Nome completo"
                    className={campo}
                  />
                </div>

                <div>
                  <label htmlFor="zipcode" className="mb-1 block text-xs font-bold text-dark-gray-2">
                    CEP
                  </label>
                  <input
                    id="zipcode"
                    required
                    inputMode="numeric"
                    value={form.zipcode}
                    onChange={(e) => atualizar('zipcode', formatarCep(e.target.value))}
                    placeholder="00000-000"
                    className={campo}
                  />
                </div>

                <div>
                  <label htmlFor="street" className="mb-1 block text-xs font-bold text-dark-gray-2">
                    Rua
                  </label>
                  <input
                    id="street"
                    required
                    value={form.street}
                    onChange={(e) => atualizar('street', e.target.value)}
                    placeholder="Rua, avenida..."
                    className={campo}
                  />
                </div>

                <div className="grid grid-cols-[1fr_1.4fr] gap-2">
                  <div>
                    <label htmlFor="number" className="mb-1 block text-xs font-bold text-dark-gray-2">
                      Número
                    </label>
                    <input
                      id="number"
                      required
                      value={form.number}
                      onChange={(e) => atualizar('number', e.target.value)}
                      placeholder="1510"
                      className={campo}
                    />
                  </div>
                  <div>
                    <label htmlFor="complement" className="mb-1 block text-xs font-bold text-dark-gray-2">
                      Complemento
                    </label>
                    <input
                      id="complement"
                      value={form.complement}
                      onChange={(e) => atualizar('complement', e.target.value)}
                      placeholder="Apto, bloco..."
                      className={campo}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="neighborhood" className="mb-1 block text-xs font-bold text-dark-gray-2">
                    Bairro
                  </label>
                  <input
                    id="neighborhood"
                    required
                    value={form.neighborhood}
                    onChange={(e) => atualizar('neighborhood', e.target.value)}
                    placeholder="Bairro"
                    className={campo}
                  />
                </div>

                <div className="grid grid-cols-[1fr_72px] gap-2">
                  <div>
                    <label htmlFor="city" className="mb-1 block text-xs font-bold text-dark-gray-2">
                      Cidade
                    </label>
                    <input
                      id="city"
                      required
                      value={form.city}
                      onChange={(e) => atualizar('city', e.target.value)}
                      placeholder="Cidade"
                      className={campo}
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="mb-1 block text-xs font-bold text-dark-gray-2">
                      UF
                    </label>
                    <select
                      id="state"
                      required
                      value={form.state}
                      onChange={(e) => atualizar('state', e.target.value)}
                      className={campo}
                    >
                      {ESTADOS_BR.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <h3 className="mt-1 text-sm font-bold text-dark-gray">Pagamento</h3>
                <div role="radiogroup" aria-label="Forma de pagamento" className="flex flex-col gap-1.5">
                  {formas.map(({ id, label, detalhe, Icon }) => {
                    const ativo = form.payment_method === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={ativo}
                        onClick={() => atualizar('payment_method', id)}
                        className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition ${
                          ativo
                            ? 'border-primary bg-[#C92071]/5'
                            : 'border-light-gray-2 hover:border-primary/40'
                        }`}
                      >
                        <Icon size={18} className={ativo ? 'text-primary' : 'text-dark-gray-3'} />
                        <span>
                          <span className="block text-sm font-bold text-dark-gray">{label}</span>
                          <span className="block text-xs text-dark-gray-3">{detalhe}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {erro && (
                  <p role="alert" className="text-sm font-bold text-error">
                    {erro}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="mt-1 h-11 rounded bg-warning text-sm font-bold text-white uppercase transition hover:brightness-95 disabled:opacity-70"
                >
                  {enviando ? 'Finalizando...' : 'Finalizar compra'}
                </button>
                <p className="text-center text-[11px] text-dark-gray-3">
                  Pagamento {pagamentoLabels[form.payment_method]?.toLowerCase()} é só uma simulação,
                  para o projeto do curso.
                </p>
              </form>
            )}
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export default CartPage;
