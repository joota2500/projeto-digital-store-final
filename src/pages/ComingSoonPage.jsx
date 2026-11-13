import { Link } from 'react-router-dom';
import Layout from './Layout';

// Páginas do rodapé que ainda não foram feitas (sobre, blog, etc.)
function ComingSoonPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-[1440px] px-4 py-16 text-center md:px-10 md:py-24 xl:px-[100px]">
        <h1 className="text-xl font-bold text-dark-gray md:text-2xl">
          Página em construção
        </h1>
        <p className="mt-2 text-sm text-dark-gray-3 md:text-base">
          Esta página ainda não faz parte da loja.
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

export default ComingSoonPage;
