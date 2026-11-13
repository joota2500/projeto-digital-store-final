import { useNavigate } from 'react-router-dom';
import CheckoutShell from '../components/CheckoutShell';
import CheckoutResumo from '../components/CheckoutResumo';
import CheckoutBarra from '../components/CheckoutBarra';
import { useCheckoutGuard } from '../hooks/useCheckoutGuard';
import { useCart } from '../context/CartContext';
import { ESTADOS_BR, formatarCep } from '../data/orders';

const campo =
  'h-11 w-full rounded-lg border border-transparent bg-light-gray-3 px-3 text-sm text-dark-gray-2 outline-none transition placeholder:text-light-gray focus:border-primary/40 focus:bg-white md:px-4';

function CheckoutEntregaPage() {
  const navigate = useNavigate();
  const liberado = useCheckoutGuard();
  const { checkout, atualizarCheckout, enderecoPreenchido } = useCart();

  function enviar(e) {
    e.preventDefault();
    navigate('/carrinho/pagamento');
  }

  if (!liberado) {
    return null;
  }

  const botao = (
    <button
      type="submit"
      form="form-entrega"
      className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm font-bold text-white transition hover:bg-tertiary"
    >
      Continuar
    </button>
  );

  return (
    <CheckoutShell
      etapaAtual={2}
      podeIrPara={{ 2: true, 3: enderecoPreenchido }}
      titulo="Entrega"
      descricao="Para onde a gente envia o seu pedido?"
      resumo={
        <CheckoutResumo mostrarItens botao={botao} />
      }
    >
      <form
        id="form-entrega"
        onSubmit={enviar}
        className="rounded-xl border border-light-gray-2 bg-white p-4 shadow-[0_2px_12px_rgba(31,31,31,0.04)] md:p-6"
      >
        <div className="flex flex-col gap-3.5">
          <div>
            <label htmlFor="recipient" className="mb-1.5 block text-xs font-bold text-dark-gray-2">
              Quem vai receber
            </label>
            <input
              id="recipient"
              required
              autoComplete="name"
              value={checkout.recipient}
              onChange={(e) => atualizarCheckout('recipient', e.target.value)}
              placeholder="Nome completo"
              className={campo}
            />
          </div>

          <div>
            <label htmlFor="zipcode" className="mb-1.5 block text-xs font-bold text-dark-gray-2">
              CEP
            </label>
            <input
              id="zipcode"
              required
              inputMode="numeric"
              autoComplete="postal-code"
              minLength={9}
              value={checkout.zipcode}
              onChange={(e) => atualizarCheckout('zipcode', formatarCep(e.target.value))}
              placeholder="00000-000"
              className={`${campo} max-w-[180px]`}
            />
          </div>

          <div>
            <label htmlFor="street" className="mb-1.5 block text-xs font-bold text-dark-gray-2">
              Rua
            </label>
            <input
              id="street"
              required
              autoComplete="address-line1"
              value={checkout.street}
              onChange={(e) => atualizarCheckout('street', e.target.value)}
              placeholder="Rua, avenida..."
              className={campo}
            />
          </div>

          <div className="grid grid-cols-[1fr_1.4fr] gap-3">
            <div>
              <label htmlFor="number" className="mb-1.5 block text-xs font-bold text-dark-gray-2">
                Número
              </label>
              <input
                id="number"
                required
                value={checkout.number}
                onChange={(e) => atualizarCheckout('number', e.target.value)}
                placeholder="1510"
                className={campo}
              />
            </div>
            <div>
              <label htmlFor="complement" className="mb-1.5 block text-xs font-bold text-dark-gray-2">
                Complemento
              </label>
              <input
                id="complement"
                value={checkout.complement}
                onChange={(e) => atualizarCheckout('complement', e.target.value)}
                placeholder="Apto, bloco..."
                className={campo}
              />
            </div>
          </div>

          <div>
            <label htmlFor="neighborhood" className="mb-1.5 block text-xs font-bold text-dark-gray-2">
              Bairro
            </label>
            <input
              id="neighborhood"
              required
              value={checkout.neighborhood}
              onChange={(e) => atualizarCheckout('neighborhood', e.target.value)}
              placeholder="Bairro"
              className={campo}
            />
          </div>

          <div className="grid grid-cols-[1fr_88px] gap-3">
            <div>
              <label htmlFor="city" className="mb-1.5 block text-xs font-bold text-dark-gray-2">
                Cidade
              </label>
              <input
                id="city"
                required
                autoComplete="address-level2"
                value={checkout.city}
                onChange={(e) => atualizarCheckout('city', e.target.value)}
                placeholder="Cidade"
                className={campo}
              />
            </div>
            <div>
              <label htmlFor="state" className="mb-1.5 block text-xs font-bold text-dark-gray-2">
                UF
              </label>
              <select
                id="state"
                required
                autoComplete="address-level1"
                value={checkout.state}
                onChange={(e) => atualizarCheckout('state', e.target.value)}
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
        </div>
      </form>

      <CheckoutBarra>{botao}</CheckoutBarra>
    </CheckoutShell>
  );
}

export default CheckoutEntregaPage;
