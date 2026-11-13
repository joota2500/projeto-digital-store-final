import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import {
  calcularFrete,
  FRETE_GRATIS_A_PARTIR,
} from '../data/orders';

// Cartão de resumo do pedido, usado à direita no notebook
function CheckoutResumo({
  mostrarItens = false,
  mostrarEndereco = false,
  botao,
  observacao,
}) {
  const { itens, subtotal, quantidadeTotal, checkout } = useCart();
  const frete = calcularFrete(subtotal);
  const total = subtotal + frete;
  const faltaFrete = Math.max(0, FRETE_GRATIS_A_PARTIR - subtotal);
  const progressoFrete = Math.min(100, (subtotal / FRETE_GRATIS_A_PARTIR) * 100);

  const enderecoLinha = [
    checkout.street,
    checkout.number,
    checkout.complement,
    checkout.neighborhood,
    checkout.city && checkout.state ? `${checkout.city} - ${checkout.state}` : checkout.city,
    checkout.zipcode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-light-gray-2 bg-white shadow-[0_8px_30px_rgba(31,31,31,0.06)] lg:max-h-[calc(100vh-20rem)]">
      <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
      <h2 className="text-base font-bold text-dark-gray">Resumo</h2>
      <p className="mt-0.5 text-xs text-dark-gray-3">
        {quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'}
      </p>

      {mostrarItens && (
        <ul className="mt-3 flex flex-col gap-2.5 border-b border-light-gray-2 pb-3">
          {itens.map((item) => (
            <li key={item.key} className="flex items-center gap-2.5">
              <img
                src={item.image}
                alt=""
                className="size-11 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-dark-gray">{item.name}</p>
                <p className="text-[11px] text-dark-gray-3">
                  {item.quantity}x {formatPrice(item.unitPrice)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

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

      {mostrarEndereco && checkout.street && (
        <div className="mt-4 rounded-lg bg-light-gray-3/70 p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-bold text-dark-gray">Entrega</p>
            <Link to="/carrinho/entrega" className="text-[11px] font-bold text-primary hover:underline">
              Editar
            </Link>
          </div>
          <p className="mt-1 text-xs font-bold text-dark-gray-2">{checkout.recipient}</p>
          <p className="mt-0.5 text-xs leading-5 text-dark-gray-3">{enderecoLinha}</p>
        </div>
      )}

      </div>

      {(botao || observacao) && (
        <div className="hidden shrink-0 border-t border-light-gray-2 p-4 lg:block md:px-5">
          {botao}
          {observacao && (
            <p className="mt-3 text-center text-[11px] text-dark-gray-3">
              {observacao}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default CheckoutResumo;
