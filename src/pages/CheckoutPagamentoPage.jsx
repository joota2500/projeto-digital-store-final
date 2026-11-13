import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, Barcode } from 'lucide-react';
import CheckoutShell from '../components/CheckoutShell';
import CheckoutResumo from '../components/CheckoutResumo';
import CheckoutBarra from '../components/CheckoutBarra';
import { useCheckoutGuard } from '../hooks/useCheckoutGuard';
import { useCart } from '../context/CartContext';
import { pagamentoLabels } from '../data/orders';
import { criarPedido } from '../services/api';
import { alertaErro } from '../utils/alertas';

const formas = [
  { id: 'pix', label: 'Pix', detalhe: 'Aprovação na hora', Icon: QrCode },
  { id: 'cartao', label: 'Cartão de crédito', detalhe: 'Em até 12x (simulado)', Icon: CreditCard },
  { id: 'boleto', label: 'Boleto', detalhe: 'Confirmação em 1 a 2 dias', Icon: Barcode },
];

function CheckoutPagamentoPage() {
  const navigate = useNavigate();
  const liberado = useCheckoutGuard({ exigirEndereco: true });
  const { itens, checkout, atualizarCheckout, limpar, limparCheckout } = useCart();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  async function finalizar() {
    setErro('');
    if (!itens.length) return;

    setEnviando(true);
    try {
      await criarPedido({
        recipient: checkout.recipient.trim(),
        zipcode: checkout.zipcode.trim(),
        street: checkout.street.trim(),
        number: checkout.number.trim(),
        complement: checkout.complement.trim() || undefined,
        neighborhood: checkout.neighborhood.trim(),
        city: checkout.city.trim(),
        state: checkout.state,
        payment_method: checkout.payment_method,
        items: itens.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          size: item.size || undefined,
          color: item.color || undefined,
        })),
      });
      limpar();
      limparCheckout();
      navigate('/meus-pedidos?sucesso=1');
    } catch (err) {
      const mensagem = err.message || 'Não foi possível finalizar a compra.';
      setErro(mensagem);
      await alertaErro('Não foi possível finalizar', mensagem);
    } finally {
      setEnviando(false);
    }
  }

  if (!liberado) {
    return null;
  }

  const botao = (
    <button
      type="button"
      disabled={enviando}
      onClick={finalizar}
      className="flex h-12 w-full items-center justify-center rounded-lg bg-warning text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-95 disabled:opacity-70"
    >
      {enviando ? 'Finalizando...' : 'Finalizar compra'}
    </button>
  );

  const observacao = `Pagamento ${pagamentoLabels[checkout.payment_method]?.toLowerCase() || ''} é só uma simulação, para o projeto do curso.`;

  return (
    <CheckoutShell
      etapaAtual={3}
      podeIrPara={{ 2: true, 3: true }}
      titulo="Pagamento"
      descricao="Escolha como você prefere pagar"
      resumo={
        <CheckoutResumo
          mostrarEndereco
          botao={botao}
          observacao={observacao}
        />
      }
    >
      <div className="rounded-xl border border-light-gray-2 bg-white p-4 shadow-[0_2px_12px_rgba(31,31,31,0.04)] md:p-6">
        <div role="radiogroup" aria-label="Forma de pagamento" className="flex flex-col gap-3">
          {formas.map(({ id, label, detalhe, Icon }) => {
            const ativo = checkout.payment_method === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={ativo}
                onClick={() => atualizarCheckout('payment_method', id)}
                className={`flex items-center gap-3.5 rounded-xl border-2 p-3.5 text-left transition md:p-4 ${
                  ativo
                    ? 'border-primary bg-[#C92071]/5 shadow-[0_4px_16px_rgba(201,32,113,0.08)]'
                    : 'border-light-gray-2 bg-white hover:border-primary/40'
                }`}
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
                    ativo ? 'bg-primary text-white' : 'bg-light-gray-3 text-dark-gray-3'
                  }`}
                >
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-dark-gray md:text-base">{label}</span>
                  <span className="mt-0.5 block text-xs text-dark-gray-3">{detalhe}</span>
                </span>
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    ativo ? 'border-primary' : 'border-light-gray-2'
                  }`}
                  aria-hidden
                >
                  {ativo && <span className="size-2.5 rounded-full bg-primary" />}
                </span>
              </button>
            );
          })}
        </div>

        {erro && (
          <p role="alert" className="mt-4 text-sm font-bold text-error">
            {erro}
          </p>
        )}

        <div className="mt-5 hidden lg:block">
          {botao}
          <p className="mt-3 text-center text-[11px] text-dark-gray-3">{observacao}</p>
        </div>

        <p className="mt-4 text-center text-[11px] text-dark-gray-3 lg:hidden">{observacao}</p>
      </div>

      {/* No celular o resumo com endereço aparece abaixo, antes da barra */}
      <div className="mt-4 lg:hidden">
        <CheckoutResumo mostrarItens mostrarEndereco />
      </div>

      <CheckoutBarra desabilitado={enviando}>{botao}</CheckoutBarra>
    </CheckoutShell>
  );
}

export default CheckoutPagamentoPage;
