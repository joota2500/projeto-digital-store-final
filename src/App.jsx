import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductViewPage from './pages/ProductViewPage';
import CategoriesPage from './pages/CategoriesPage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Sobe a página para o topo ao trocar de rota
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// /produtos leva para /products, mantendo a busca da URL
function RedirectToProducts() {
  const [params] = useSearchParams();
  const search = params.toString();
  return <Navigate to={search ? `/products?${search}` : '/products'} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/produtos" element={<RedirectToProducts />} />
        <Route path="/product/:id" element={<ProductViewPage />} />

        <Route path="/categorias" element={<CategoriesPage />} />

        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/meus-pedidos/:id" element={<OrderDetailPage />} />
        <Route path="/meus-pedidos" element={<OrdersPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/entrar" element={<Navigate to="/login" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
