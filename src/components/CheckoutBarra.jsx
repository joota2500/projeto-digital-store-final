import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { calcularFrete } from '../data/orders';

// Barra fixa no rodapé do celular, com o total e o botão da etapa
function CheckoutBarra({ children, desabilitado = false }) {
  const { subtotal } = useCart();
  const total = subtotal + calcularFrete(subtotal);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-light-gray-2 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(31,31,31,0.08)] backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-dark-gray-3">Total</p>
          <p className="text-base font-bold leading-tight text-dark-gray">{formatPrice(total)}</p>
        </div>
        <div className={`ml-auto min-w-0 flex-1 max-w-[220px] ${desabilitado ? 'pointer-events-none opacity-70' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default CheckoutBarra;
