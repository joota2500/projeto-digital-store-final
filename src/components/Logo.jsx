import React from 'react';

// Componente do logo da loja, tamanho fixo conforme a doc do projeto
const Logo = ({ className = '' }) => {
  return (
    <img
      src="/logo.svg"  // coloca o logo em public/ ou src/assets depois
      alt="Digital Store"
      width={253}
      height={44}
      className={className}
    />
  );
};

export default Logo;
