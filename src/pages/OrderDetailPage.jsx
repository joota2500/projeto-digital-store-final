import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from './Layout';
import StatusBadge from '../components/StatusBadge';
import { formatPrice } from '../data/products';
import {
  formatarDataPedido,
  pagamentoLabels,
  statusLabels,
} from '../data/orders';
import {
  apiEstaNoAr,
  buscarPedido,
  cancelarPedido,
  getUsuarioLogado,
} from '../services/api';

const etapas = ['pendente', 'pago', 'enviado', 'entregue'];

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [offline, setOffline] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [avisoCancelar, setAvisoCancelar] = useState('');

  useEffect(() => {
    if (!getUsuarioLogado()) {
      navigate(`/login?redirect=${encodeURIComponent(`/meus-pedidos/${id}`)}`, {
        replace: true,
      });
      return;
    }

    let ativo = true;
    setCarregando(true);
    setErro('');
    setOffline(false);

    buscarPedido(id)
      .then((dados) => {
        if (ativo) setPedido(dados);
      })
      .catch(async (err) => {
        if (!ativo) return;
        if (err.code === 'API_OFFLINE' || !(await apiEstaNoAr())) {
          setOffline(true);
          setErro(
            'Os pedidos só funcionam com o back-end ligado. Rode o projeto com ./iniciar.sh para ver seus pedidos.'
          );
        } else {
          setErro(err.message || 'Não foi possível carregar este pedido.');
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [id, navigate]);

  async function confirmarCancelamento() {
    if (!pedido) return;
    const ok = window.confirm('Tem certeza que deseja cancelar este pedido?');
    if (!ok) return;

    setCancelando(true);
    setAvisoCancelar('');
    try {
      const atualizado = await cancelarPedido(pedido.id);
      setPedido(atualizado);
    } catch (err) {
      setAvisoCancelar(err.message || 'Não foi possível cancelar o pedido.');
    } finally {
      setCancelando(false);
    }
  }

  const podeCancelar = pedido && (pedido.status === 'pendente' || pedido.status === 'pago');

  return (
    <Layout>
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-10 md:py-10 xl:px-[100px]">
        <Link to="/meus-pedidos" className="text-sm font-bold text-primary hover:underline">
          ← Voltar para Meus Pedidos
        </Link>

        {carregando && (
          <p className="py-16 text-center text-dark-gray-3">Carregando pedido...</p>
        )}

        {!carregando && erro && (
          <div className="mt-10 rounded-lg bg-white px-6 py-12 text-center">
            <p className="text-base font-bold text-dark-gray">
              {offline ? 'O back-end não está no ar' : 'Não encontramos este pedido'}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-dark-gray-3">{erro}</p>
            <Link
              to="/meus-pedidos"
              className="mt-6 inline-flex h-10 items-center rounded bg-primary px-6 text-sm font-bold text-white hover:bg-tertiary"
            >
              Ir para Meus Pedidos
            </Link>
          </div>
        )}

        {!carregando && !erro && pedido && (
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-dark-gray-3">
                    Pedido #{String(pedido.id).padStart(4, '0')}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-dark-gray">
                    {formatarDataPedido(pedido.created_at)}
                  </h1>
                </div>
                <StatusBadge status={pedido.status} />
              </div>

              {pedido.status !== 'cancelado' && (
                <ol className="mt-8 flex items-center gap-2">
                  {etapas.map((etapa, indice) => {
                    const atual = etapas.indexOf(pedido.status);
                    const feita = atual >= indice;
                    return (
                      <li key={etapa} className="flex flex-1 flex-col items-center gap-2">
                        <span
                          className={`h-2 w-full rounded-full ${feita ? 'bg-primary' : 'bg-light-gray-2'}`}
                        />
                        <span
                          className={`text-xs ${feita ? 'font-bold text-primary' : 'text-light-gray'}`}
                        >
                          {statusLabels[etapa]}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}

              <section className="mt-8 rounded-lg bg-white p-5 md:p-6">
                <h2 className="text-base font-bold text-dark-gray">Itens</h2>
                <ul className="mt-4 flex flex-col gap-4">
                  {pedido.items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      {item.product_id ? (
                        <Link to={`/product/${item.product_id}`} className="shrink-0">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="size-20 rounded object-cover"
                          />
                        </Link>
                      ) : (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="size-20 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-dark-gray-2">{item.product_name}</p>
                        <p className="mt-1 text-sm text-dark-gray-3">
                          {item.quantity} × {formatPrice(item.unit_price)}
                          {item.size ? ` · Tam. ${item.size}` : ''}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-dark-gray">
                        {formatPrice(item.subtotal)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="flex h-fit flex-col gap-5">
              <section className="rounded-lg bg-white p-5 md:p-6">
                <h2 className="text-base font-bold text-dark-gray">Entrega</h2>
                <address className="mt-3 text-sm leading-6 text-dark-gray-2 not-italic">
                  {pedido.recipient}
                  <br />
                  {pedido.street}, {pedido.number}
                  {pedido.complement ? ` — ${pedido.complement}` : ''}
                  <br />
                  {pedido.neighborhood}
                  <br />
                  {pedido.city} - {pedido.state}
                  <br />
                  CEP {pedido.zipcode}
                </address>
              </section>

              <section className="rounded-lg bg-white p-5 md:p-6">
                <h2 className="text-base font-bold text-dark-gray">Pagamento</h2>
                <p className="mt-3 text-sm text-dark-gray-2">
                  {pagamentoLabels[pedido.payment_method] || pedido.payment_method}
                </p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-dark-gray-2">
                    <dt>Subtotal</dt>
                    <dd>{formatPrice(pedido.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-dark-gray-2">
                    <dt>Frete</dt>
                    <dd>
                      {pedido.shipping_cost === 0
                        ? 'Grátis'
                        : formatPrice(pedido.shipping_cost)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-light-gray-2 pt-3 text-base font-bold text-dark-gray">
                    <dt>Total</dt>
                    <dd>{formatPrice(pedido.total)}</dd>
                  </div>
                </dl>
              </section>

              {podeCancelar && (
                <div>
                  {avisoCancelar && (
                    <p role="alert" className="mb-3 text-sm font-bold text-error">
                      {avisoCancelar}
                    </p>
                  )}
                  <button
                    type="button"
                    disabled={cancelando}
                    onClick={confirmarCancelamento}
                    className="flex h-11 w-full items-center justify-center rounded border border-error text-sm font-bold text-error hover:bg-error hover:text-white disabled:opacity-70"
                  >
                    {cancelando ? 'Cancelando...' : 'Cancelar pedido'}
                  </button>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default OrderDetailPage;
