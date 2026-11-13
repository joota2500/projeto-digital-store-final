import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';
import Logo from './Logo';

// Header da loja - logo, busca, login e nav
const Header = () => {
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  const handleBusca = (e) => {
    e.preventDefault();
    if (busca.trim()) {
      // redireciona com o filtro na query string, como a doc pede
      navigate(`/products?filter=${encodeURIComponent(busca.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-light-gray-2 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <NavLink to="/">
          <Logo />
        </NavLink>

        {/* Campo de busca */}
        <form onSubmit={handleBusca} className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Pesquisar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-light-gray-2 rounded-lg focus:outline-none focus:border-primary"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-gray-2">
            <Search size={18} />
          </button>
        </form>

        {/* Área de login e carrinho */}
        <div className="flex items-center gap-4">
          <NavLink to="/cadastro" className="text-dark-gray-2 underline text-sm">
            Cadastre-se
          </NavLink>
          <NavLink
            to="/entrar"
            className="bg-primary text-white font-bold text-sm px-6 py-2 rounded-md hover:bg-tertiary transition"
          >
            Entrar
          </NavLink>
          <button className="text-dark-gray-2 relative">
            <ShoppingCart size={24} />
            {/* badge fictício */}
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
          </button>
        </div>
      </div>

      {/* Navegação principal */}
      <nav className="border-t border-light-gray-3">
        <div className="max-w-7xl mx-auto px-4 flex gap-8 py-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium pb-1 ${isActive ? 'text-primary border-b-2 border-primary' : 'text-dark-gray-2 hover:text-primary'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `text-sm font-medium pb-1 ${isActive ? 'text-primary border-b-2 border-primary' : 'text-dark-gray-2 hover:text-primary'}`
            }
          >
            Produtos
          </NavLink>
          <NavLink
            to="/categorias"
            className={({ isActive }) =>
              `text-sm font-medium pb-1 ${isActive ? 'text-primary border-b-2 border-primary' : 'text-dark-gray-2 hover:text-primary'}`
            }
          >
            Categorias
          </NavLink>
          <NavLink
            to="/meus-pedidos"
            className={({ isActive }) =>
              `text-sm font-medium pb-1 ${isActive ? 'text-primary border-b-2 border-primary' : 'text-dark-gray-2 hover:text-primary'}`
            }
          >
            Meus Pedidos
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;
