import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'digital_store_cart';
const CartContext = createContext(null);

function lerCarrinhoSalvo() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

// Identifica a mesma linha do carrinho (produto + tamanho + cor)
export function chaveItem(produtoId, size, color) {
  return `${produtoId}::${size || ''}::${color || ''}`;
}

export function CartProvider({ children }) {
  const [itens, setItens] = useState(() => lerCarrinhoSalvo());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }, [itens]);

  const valor = useMemo(() => {
    function adicionar({ product, size, color, quantity = 1 }) {
      const chave = chaveItem(product.id, size, color);
      const preco = product.priceDiscount ?? product.price;

      setItens((atual) => {
        const existe = atual.find((item) => item.key === chave);
        if (existe) {
          return atual.map((item) =>
            item.key === chave
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [
          ...atual,
          {
            key: chave,
            productId: product.id,
            name: product.name,
            image: product.image,
            unitPrice: preco,
            quantity,
            size: size || null,
            color: color || null,
          },
        ];
      });
    }

    function alterarQuantidade(chave, quantity) {
      const quantidade = Number(quantity);
      if (!Number.isInteger(quantidade) || quantidade < 1) return;

      setItens((atual) =>
        atual.map((item) => (item.key === chave ? { ...item, quantity: quantidade } : item))
      );
    }

    function remover(chave) {
      setItens((atual) => atual.filter((item) => item.key !== chave));
    }

    function limpar() {
      setItens([]);
    }

    const quantidadeTotal = itens.reduce((soma, item) => soma + item.quantity, 0);
    const subtotal = itens.reduce((soma, item) => soma + item.unitPrice * item.quantity, 0);

    return {
      itens,
      adicionar,
      alterarQuantidade,
      remover,
      limpar,
      quantidadeTotal,
      subtotal,
    };
  }, [itens]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) {
    throw new Error('useCart precisa estar dentro de CartProvider');
  }
  return contexto;
}
