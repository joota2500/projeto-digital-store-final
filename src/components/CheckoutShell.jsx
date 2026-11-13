import Layout from '../pages/Layout';
import CheckoutStepper from './CheckoutStepper';

// Molde das páginas do checkout: stepper, duas colunas no notebook e espaço para a barra do celular
function CheckoutShell({ etapaAtual, podeIrPara, titulo, descricao, extraTitulo, children, resumo }) {
  return (
    <Layout>
      <div className="mx-auto max-w-[1440px] px-4 pb-28 pt-5 md:px-10 md:pt-8 lg:pb-12 xl:px-[100px]">
        <CheckoutStepper etapaAtual={etapaAtual} podeIrPara={podeIrPara} />

        {(titulo || extraTitulo) && (
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2 md:mb-6">
            <div>
              {titulo && (
                <h1 className="text-xl font-bold text-dark-gray md:text-2xl">{titulo}</h1>
              )}
              {descricao && (
                <p className="mt-0.5 text-xs text-dark-gray-3 md:text-sm">{descricao}</p>
              )}
            </div>
            {extraTitulo}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
          <div className="min-w-0">{children}</div>
          <aside className="hidden h-fit lg:sticky lg:top-6 lg:block">{resumo}</aside>
        </div>
      </div>
    </Layout>
  );
}

export default CheckoutShell;
