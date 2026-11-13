import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const etapas = [
  { id: 1, nome: 'Carrinho', to: '/carrinho' },
  { id: 2, nome: 'Entrega', to: '/carrinho/entrega' },
  { id: 3, nome: 'Pagamento', to: '/carrinho/pagamento' },
];

// Indicador das 3 etapas do checkout (Carrinho, Entrega e Pagamento)
function CheckoutStepper({ etapaAtual, podeIrPara = {} }) {
  return (
    <ol className="mb-5 flex items-center md:mb-8">
      {etapas.map((etapa, indice) => {
        const concluida = etapa.id < etapaAtual;
        const atual = etapa.id === etapaAtual;
        const liberada = etapa.id <= 1 || concluida || podeIrPara[etapa.id];
        const classeBolinha = atual || concluida
          ? 'bg-primary text-white'
          : 'bg-light-gray-3 text-dark-gray-3';
        const classeNome = atual
          ? 'text-primary'
          : concluida
            ? 'text-dark-gray'
            : 'text-dark-gray-3';

        const conteudo = (
          <span className="flex items-center gap-1.5 md:gap-2">
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold md:size-8 md:text-sm ${classeBolinha}`}
            >
              {concluida ? <Check size={14} strokeWidth={3} /> : etapa.id}
            </span>
            <span className={`text-[11px] font-bold md:text-sm ${classeNome}`}>
              {etapa.nome}
            </span>
          </span>
        );

        return (
          <li key={etapa.id} className="flex min-w-0 flex-1 items-center last:flex-none md:flex-none">
            {liberada ? (
              <Link to={etapa.to} className="shrink-0 hover:opacity-90">
                {conteudo}
              </Link>
            ) : (
              <span className="shrink-0 cursor-default">{conteudo}</span>
            )}
            {indice < etapas.length - 1 && (
              <span
                className={`mx-1.5 h-px min-w-3 flex-1 md:mx-4 md:w-16 md:flex-none ${
                  etapa.id < etapaAtual ? 'bg-primary' : 'bg-light-gray-2'
                }`}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default CheckoutStepper;
