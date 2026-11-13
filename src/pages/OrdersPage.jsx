import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import StatusBadge from '../components/StatusBadge';
import { formatPrice } from '../data/products';
import { formatarDataPedido, pagamentoLabels } from '../data/orders';
import { apiEstaNoAr, getUsuarioLogado, listarPedidos } from '../services/api';

function OrdersPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [offline, setOffline] = useState(false);
  const sucesso = params.get('sucesso') === '1';

  useEffect(() => {
    if (!getUsuarioLogado()) {
      navigate(`/login?redirect=${encodeURIComponent('/meus-pedidos')}`, { replace: true });
      return;
    }

    let ativo = true;
    setCarregando(true);
    setErro('');
    setOffline(false);

    listarPedidos()
      .then((resultado) => {
        if (!ativo) return;
        setPedidos(resultado.data || []);
      })
      .catch(async (err) => {
        if (!ativo) return;
        if (err.code === 'API_OFFLINE' || !(await apiEstaNoAr())) {
          setOffline(true);
          setErro(
            'Os pedidos só funcionam com o back-end ligado. Rode o projeto com ./iniciar.sh para ver seus pedidos.'
          );
        } else {
          setErro(err.message || 'Não foi possível carregar seus pedidos.');
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [navigate]);

  function fecharSucesso() {
    const proximo = new URLSearchParams(params);
    proximo.delete('sucesso');
    setParams(proximo, { replace: true });
  }

  return (
    <Layout>
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-10 md:py-10 xl:px-[100px]">
        <h1 className="text-2xl font-bold text-dark-gray">Meus Pedidos</h1>
        <p className="mt-1 text-sm text-dark-gray-3">
          Acompanhe as compras que você fez nesta loja.
        </p>

        {sucesso && (
          <div
            role="status"
            className="mt-6 flex flex-wrap items-start justify-between gap-3 rounded-lg bg-success/15 px-4 py-3 text-sm font-bold text-success"
          >
            <p>Pedido realizado com sucesso! Ele já aparece na lista abaixo.</p>
            <button type="button" onClick={fecharSucesso} className="underline">
              Fechar
            </button>
          </div>
        )}

        {carregando && (
          <p className="py-16 text-center text-dark-gray-3">Carregando seus pedidos...</p>
        )}

        {!carregando && erro && (
          <div className="mt-10 rounded-lg bg-white px-6 py-12 text-center">
            <p className="text-base font-bold text-dark-gray">
              {offline ? 'O back-end não está no ar' : 'Algo deu errado'}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-dark-gray-3">{erro}</p>
            <Link
              to="/products"
              className="mt-6 inline-flex h-10 items-center rounded bg-primary px-6 text-sm font-bold text-white hover:bg-tertiary"
            >
              Ver produtos
            </Link>
          </div>
        )}

        {!carregando && !erro && pedidos.length === 0 && (
          <div className="mt-10 rounded-lg bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-dark-gray">Você ainda não fez nenhum pedido</h2>
            <p className="mt-2 text-sm text-dark-gray-3">
              Quando finalizar uma compra, ela aparece aqui com o status e os itens.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex h-10 items-center rounded bg-primary px-6 text-sm font-bold text-white hover:bg-tertiary"
            >
              Começar a comprar
            </Link>
          </div>
        )}

        {!carregando && !erro && pedidos.length > 0 && (
          <ul className="mt-8 flex flex-col gap-5">
            {pedidos.map((pedido) => (
              <li key={pedido.id} className="rounded-lg bg-white p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-dark-gray-3">
                      Pedido #{String(pedido.id).padStart(4, '0')}
                    </p>
                    <p className="mt-1 text-base font-bold text-dark-gray">
                      {formatarDataPedido(pedido.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={pedido.status} />
                </div>

                <ul className="mt-4 flex flex-col gap-3">
                  {pedido.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt=""
                          className="size-14 rounded object-cover"
                        />
                      ) : (
                        <span className="size-14 rounded bg-light-gray-3" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-dark-gray-2">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-dark-gray-3">
                          {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}
                          {item.size ? ` · Tam. ${item.size}` : ''}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-dark-gray">
                        {formatPrice(item.subtotal)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-light-gray-2 pt-4">
                  <p className="text-sm text-dark-gray-3">
                    {pagamentoLabels[pedido.payment_method] || pedido.payment_method}
                    {pedido.shipping_cost === 0 ? ' · Frete grátis' : ''}
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-base font-bold text-dark-gray">
                      Total {formatPrice(pedido.total)}
                    </p>
                    <Link
                      to={`/meus-pedidos/${pedido.id}`}
                      className="text-sm font-bold text-primary hover:underline"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default OrdersPage;
