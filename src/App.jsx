import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductViewPage from './pages/ProductViewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/product/:id" element={<ProductViewPage />} />
        {/* rotas extras só para não dar 404 nos links do menu */}
        <Route path="/categorias" element={<HomePage />} />
        <Route path="/meus-pedidos" element={<HomePage />} />
        <Route path="/cadastro" element={<HomePage />} />
        <Route path="/entrar" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
