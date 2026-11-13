import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Layout from './Layout';
import CheckoutShell from '../components/CheckoutShell';
import CheckoutResumo from '../components/CheckoutResumo';
import CheckoutBarra from '../components/CheckoutBarra';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { getUsuarioLogado } from '../services/api';

function destinoProximaEtapa() {
  return getUsuarioLogado() ? '/carrinho/entrega' : `/login?redirect=${encodeURIComponent('/carrinho/entrega')}`;
}

function CartPage() {
  const navigate = useNavigate();
  const { itens, alterarQuantidade, remover, quantidadeTotal, enderecoPreenchido } = useCart();

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
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-bold text-white hover:bg-tertiary"
          >
            Ver produtos
          </Link>
        </div>
      </Layout>
    );
  }

  const proxima = destinoProximaEtapa();

  return (
    <CheckoutShell
      etapaAtual={1}
      podeIrPara={{ 2: Boolean(getUsuarioLogado()), 3: Boolean(getUsuarioLogado()) && enderecoPreenchido }}
      titulo="Meu carrinho"
      descricao={`${quantidadeTotal} ${quantidadeTotal === 1 ? 'item' : 'itens'}`}
      extraTitulo={
        <Link to="/products" className="text-xs font-bold text-primary hover:underline md:text-sm">
          Continuar comprando
        </Link>
      }
      resumo={
        <CheckoutResumo
          botao={
            <button
              type="button"
              onClick={() => navigate(proxima)}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm font-bold text-white transition hover:bg-tertiary"
            >
              Continuar
            </button>
          }
        />
      }
    >
      <section aria-label="Itens do carrinho" className="flex flex-col gap-3">
        {itens.map((item) => (
          <article
            key={item.key}
            className="flex gap-3 rounded-xl border border-light-gray-2 bg-white p-3 shadow-[0_2px_12px_rgba(31,31,31,0.04)] md:gap-4 md:p-4"
          >
            <Link to={`/product/${item.productId}`} className="shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="size-16 rounded-lg object-cover md:size-20"
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
                    className="flex size-7 items-center justify-center rounded-md border border-light-gray-2 text-dark-gray-2 disabled:opacity-40"
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
                    className="flex size-7 items-center justify-center rounded-md border border-light-gray-2 text-dark-gray-2"
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

      <CheckoutBarra>
        <button
          type="button"
          onClick={() => navigate(proxima)}
          className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-bold text-white hover:bg-tertiary"
        >
          Continuar
        </button>
      </CheckoutBarra>
    </CheckoutShell>
  );
}

export default CartPage;
