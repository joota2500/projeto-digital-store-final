import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { cadastrarUsuario, login } from '../services/api';

const campo =
  'h-[60px] w-full rounded-lg bg-light-gray-3 px-5 text-base text-dark-gray-2 outline-none placeholder:text-light-gray';

function CadastroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  function atualizar(campoNome, valor) {
    setForm((atual) => ({ ...atual, [campoNome]: valor }));
  }

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (form.password !== form.confirmPassword) {
      setErro('A confirmação da senha não confere.');
      return;
    }

    setEnviando(true);

    try {
      await cadastrarUsuario({
        firstname: form.firstname.trim(),
        surname: form.surname.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      await login(form.email.trim(), form.password);
      setSucesso('Conta criada com sucesso!');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setErro(err.message || 'Não foi possível cadastrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto flex max-w-[1440px] justify-center px-4 py-14 md:px-10 md:py-20 xl:px-[100px]">
        <div className="w-full max-w-[480px] rounded bg-white p-8 md:p-10">
          <h1 className="text-2xl font-bold text-dark-gray">
            Crie sua conta
          </h1>
          <p className="mt-2 text-sm text-dark-gray-3">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Entrar
            </Link>
          </p>

          <form onSubmit={enviar} className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="firstname" className="mb-2 block text-sm font-bold text-dark-gray-2">
                Nome
              </label>
              <input
                id="firstname"
                type="text"
                required
                autoComplete="given-name"
                value={form.firstname}
                onChange={(e) => atualizar('firstname', e.target.value)}
                placeholder="Seu nome"
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="surname" className="mb-2 block text-sm font-bold text-dark-gray-2">
                Sobrenome
              </label>
              <input
                id="surname"
                type="text"
                required
                autoComplete="family-name"
                value={form.surname}
                onChange={(e) => atualizar('surname', e.target.value)}
                placeholder="Seu sobrenome"
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-dark-gray-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => atualizar('email', e.target.value)}
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
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => atualizar('password', e.target.value)}
                placeholder="Crie uma senha"
                className={campo}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-bold text-dark-gray-2">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => atualizar('confirmPassword', e.target.value)}
                placeholder="Repita a senha"
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
              {enviando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default CadastroPage;
