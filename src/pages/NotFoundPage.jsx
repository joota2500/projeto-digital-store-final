import { Link } from 'react-router-dom';
import Layout from './Layout';

// Qualquer rota que não existe cai aqui
function NotFoundPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-[1440px] px-4 py-16 text-center md:px-10 md:py-24 xl:px-[100px]">
        <p className="text-5xl font-extrabold text-primary md:text-6xl">404</p>
        <h1 className="mt-3 text-xl font-bold text-dark-gray md:mt-4 md:text-2xl">
          Página não encontrada
        </h1>
        <p className="mt-2 text-sm text-dark-gray-3 md:text-base">
          Esse endereço não existe na loja.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center rounded bg-primary px-6 text-sm font-bold text-white hover:bg-tertiary"
        >
          Voltar para a Home
        </Link>
      </div>
    </Layout>
  );
}

export default NotFoundPage;
