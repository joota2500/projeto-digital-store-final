import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import Logo from './Logo'
import miniCart from '../assets/mini-cart.svg'

function Header() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')

  // Função para realizar a busca
  function realizarBusca(e) {
    e.preventDefault()

    if (busca.trim()) {
      navigate(`/products?filter=${encodeURIComponent(busca.trim())}`)
    }
  }

  // Estilo dos links da navegação
  function estiloLink({ isActive }) {
    return `pb-2 ${
      isActive
        ? 'text-primary border-b-2 border-primary'
        : 'text-dark-gray-2'
    }`
  }

  return (
    <header className="w-full bg-white">
      {/* Parte superior do cabeçalho */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 flex items-center justify-between gap-6">

        {/* Logo */}
        <NavLink to="/">
          <Logo />
        </NavLink>

        {/* Campo de busca */}
        <form
          onSubmit={realizarBusca}
          className="flex items-center bg-light-gray-3 rounded-md px-4 h-[48px] flex-1 max-w-[550px]"
        >
          <input
            type="text"
            placeholder="Pesquisar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-transparent outline-none text-dark-gray-2 placeholder:text-light-gray-2"
          />

          {/* Botão da lupa */}
          <button type="submit" aria-label="Pesquisar">
            <Search size={22} className="text-dark-gray-2" />
          </button>
        </form>

        {/* Links de cadastro e entrada */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/cadastro"
            className="text-[16px] text-dark-gray-2 underline"
          >
            Cadastre-se
          </NavLink>

          <NavLink
            to="/entrar"
            className="w-[114px] h-[40px] bg-primary rounded-[4px] text-white font-bold text-[14px] flex items-center justify-center"
          >
            Entrar
          </NavLink>

          {/* Ícone do carrinho */}
          <img
            src={miniCart}
            alt="Carrinho"
            className="w-6 h-6"
          />
        </div>
      </div>

      {/* Navegação principal */}
      <nav className="max-w-[1200px] mx-auto px-4">
        <ul className="flex items-center gap-8">
          <li>
            <NavLink to="/" end className={estiloLink}>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/products" className={estiloLink}>
              Produtos
            </NavLink>
          </li>

          <li>
            <NavLink to="/categorias" className={estiloLink}>
              Categorias
            </NavLink>
          </li>

          <li>
            <NavLink to="/meus-pedidos" className={estiloLink}>
              Meus Pedidos
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
