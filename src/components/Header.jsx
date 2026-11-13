import { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import Logo from './Logo'
import miniCart from '../assets/mini-cart.svg'
import { getUsuarioLogado, logout } from '../services/api'
import { useCart } from '../context/CartContext'

const links = [
  { text: 'Home', to: '/' },
  { text: 'Produtos', to: '/products' },
  { text: 'Categorias', to: '/categorias' },
  { text: 'Meus Pedidos', to: '/meus-pedidos' },
]

function Header() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [busca, setBusca] = useState(searchParams.get('filter') ?? '')
  const [menuAberto, setMenuAberto] = useState(false)
  const [usuario, setUsuario] = useState(() => getUsuarioLogado())
  const { quantidadeTotal } = useCart()

  // Atualiza o campo quando a busca vem pela URL
  useEffect(() => {
    setBusca(searchParams.get('filter') ?? '')
  }, [searchParams])

  // Atualiza o cabeçalho quando o usuário entra ou sai
  useEffect(() => {
    function atualizarUsuario() {
      setUsuario(getUsuarioLogado())
    }

    window.addEventListener('storage', atualizarUsuario)
    window.addEventListener('auth-change', atualizarUsuario)
    return () => {
      window.removeEventListener('storage', atualizarUsuario)
      window.removeEventListener('auth-change', atualizarUsuario)
    }
  }, [])

  function sair() {
    logout()
    setUsuario(null)
    setMenuAberto(false)
    navigate('/')
  }

  function realizarBusca(e) {
    e.preventDefault()
    const termo = busca.trim()
    navigate(termo ? `/products?filter=${encodeURIComponent(termo)}` : '/products')
    setMenuAberto(false)
  }

  function estiloLink({ isActive }) {
    return `pb-1 text-sm transition-colors md:text-base ${
      isActive
        ? 'border-b-2 border-primary font-bold text-primary'
        : 'border-b-2 border-transparent text-dark-gray-2 hover:text-primary'
    }`
  }

  return (
    <header className="bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-3 gap-y-3 px-4 pt-3 pb-3 md:gap-x-6 md:px-10 md:pt-8 md:pb-6 xl:gap-x-10 xl:px-[100px]">

        {/* Botão do menu no celular */}
        <button
          type="button"
          className="text-dark-gray-2 md:hidden"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          {menuAberto ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" aria-label="Página inicial" className="shrink-0">
          <Logo className="h-6 w-auto md:h-[34px] lg:h-11" />
        </Link>

        {/* Campo de busca */}
        <form
          role="search"
          onSubmit={realizarBusca}
          className="order-last flex h-10 w-full items-center rounded-lg bg-light-gray-3 px-3 md:h-12 md:px-5 lg:order-none lg:h-[60px] lg:w-auto lg:min-w-0 lg:flex-1 lg:basis-0"
        >
          <label htmlFor="search" className="sr-only">
            Pesquisar produto
          </label>
          <input
            id="search"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar produto..."
            className="h-full flex-1 bg-transparent text-sm text-dark-gray-2 outline-none placeholder:text-light-gray md:text-base"
          />
          <button type="submit" aria-label="Buscar" className="text-light-gray hover:text-primary">
            <Search size={18} className="md:size-[22px]" />
          </button>
        </form>

        {/* Cadastro, login (ou sair) e carrinho */}
        <div className="ml-auto flex shrink-0 items-center gap-3 md:gap-6 lg:ml-0 lg:gap-8">
          {usuario ? (
            <>
              <span className="hidden max-w-[180px] truncate text-sm text-dark-gray-2 md:inline">
                Olá, {usuario.email}
              </span>
              <button
                type="button"
                onClick={sair}
                className="hidden h-9 w-[100px] items-center justify-center rounded bg-primary text-sm font-bold text-white transition-colors hover:bg-tertiary md:flex md:h-10 md:w-[114px]"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/cadastro"
                className="hidden text-sm text-dark-gray-2 underline decoration-dark-gray-2 md:inline md:text-base"
              >
                Cadastre-se
              </Link>
              <Link
                to="/login"
                className="hidden h-9 w-[100px] items-center justify-center rounded bg-primary text-sm font-bold text-white transition-colors hover:bg-tertiary md:flex md:h-10 md:w-[114px]"
              >
                Entrar
              </Link>
            </>
          )}
          <Link to="/carrinho" aria-label="Carrinho de compras" className="relative inline-flex">
            <img src={miniCart} alt="" className="size-5 md:size-6" />
            {quantidadeTotal > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white md:-top-2 md:-right-2 md:h-5 md:min-w-5">
                {quantidadeTotal > 99 ? '99+' : quantidadeTotal}
              </span>
            )}
          </Link>
        </div>

        {/* Navegação no desktop */}
        <nav aria-label="Navegação principal" className="hidden w-full md:block">
          <ul className="flex gap-8">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/'} className={estiloLink}>
                  {link.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Menu no celular */}
      {menuAberto && (
        <nav aria-label="Navegação mobile" className="border-t border-light-gray-2 px-4 py-4 md:hidden">
          <p className="mb-3 text-sm font-bold text-dark-gray-2">Páginas</p>
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={estiloLink}
                  onClick={() => setMenuAberto(false)}
                >
                  {link.text}
                </NavLink>
              </li>
            ))}
          </ul>
          <hr className="my-4 border-light-gray-2" />
          {usuario ? (
            <>
              <p className="mb-3 truncate text-center text-sm text-dark-gray-2">
                Olá, {usuario.email}
              </p>
              <button
                type="button"
                onClick={sair}
                className="flex h-10 w-full items-center justify-center rounded bg-primary text-sm font-bold text-white"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuAberto(false)}
                className="flex h-10 items-center justify-center rounded bg-primary text-sm font-bold text-white"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                onClick={() => setMenuAberto(false)}
                className="mt-3 block text-center text-sm text-dark-gray-2 underline"
              >
                Cadastre-se
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}

export default Header
