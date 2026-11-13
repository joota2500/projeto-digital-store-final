import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import { login } from '../services/api';
import { destinoSeguro } from '../data/orders';

const campo =
  'h-[60px] w-full rounded-lg bg-light-gray-3 px-5 text-base text-dark-gray-2 outline-none placeholder:text-light-gray';

function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const destino = destinoSeguro(params.get('redirect'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setEnviando(true);

    try {
      await login(email.trim(), password);
      setSucesso('Login feito com sucesso!');
      setTimeout(() => navigate(destino), 800);
    } catch (err) {
      setErro(err.message || 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto flex max-w-[1440px] justify-center px-4 py-14 md:px-10 md:py-20 xl:px-[100px]">
        <div className="w-full max-w-[480px] rounded bg-white p-8 md:p-10">
          <h1 className="text-2xl font-bold text-dark-gray">
            Acesse sua conta
          </h1>
          <p className="mt-2 text-sm text-dark-gray-3">
            Novo por aqui?{' '}
            <Link to={destino === "/" ? "/cadastro" : `/cadastro?redirect=${encodeURIComponent(destino)}`} className="font-bold text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>

          <form onSubmit={enviar} className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-dark-gray-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-dark-gray-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className={campo}
              />
            </div>

            {erro && (
              <p role="alert" className="text-sm font-bold text-error">
                {erro}
              </p>
            )}
            {sucesso && (
              <p role="status" className="text-sm font-bold text-success">
                {sucesso}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 h-12 rounded bg-primary text-sm font-bold text-white transition-colors hover:bg-tertiary disabled:opacity-70"
            >
              {enviando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;
