import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'digital_store_cart';
const CHECKOUT_KEY = 'digital_store_checkout';
const CartContext = createContext(null);

const checkoutPadrao = {
  recipient: '',
  zipcode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: 'CE',
  payment_method: 'pix',
};

function lerJson(chave, fallback) {
  try {
    const bruto = localStorage.getItem(chave);
    const valor = bruto ? JSON.parse(bruto) : fallback;
    return valor ?? fallback;
  } catch {
    return fallback;
  }
}

function lerCarrinhoSalvo() {
  const lista = lerJson(STORAGE_KEY, []);
  return Array.isArray(lista) ? lista : [];
}

function lerCheckoutSalvo() {
  const salvo = lerJson(CHECKOUT_KEY, null);
  if (!salvo || typeof salvo !== 'object' || Array.isArray(salvo)) {
    return { ...checkoutPadrao };
  }
  return { ...checkoutPadrao, ...salvo };
}

export function enderecoEstaPreenchido(checkout) {
  if (!checkout) return false;
  const cep = String(checkout.zipcode || '').replace(/\D/g, '');
  return Boolean(
    String(checkout.recipient || '').trim() &&
      cep.length === 8 &&
      String(checkout.street || '').trim() &&
      String(checkout.number || '').trim() &&
      String(checkout.neighborhood || '').trim() &&
      String(checkout.city || '').trim() &&
      checkout.state
  );
}

// Identifica a mesma linha do carrinho (produto + tamanho + cor)
export function chaveItem(produtoId, size, color) {
  return `${produtoId}::${size || ''}::${color || ''}`;
}

export function CartProvider({ children }) {
  const [itens, setItens] = useState(() => lerCarrinhoSalvo());
  const [checkout, setCheckout] = useState(() => lerCheckoutSalvo());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }, [itens]);

  useEffect(() => {
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(checkout));
  }, [checkout]);

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

    function atualizarCheckout(campo, valorCampo) {
      setCheckout((atual) => ({ ...atual, [campo]: valorCampo }));
    }

    function limparCheckout() {
      setCheckout({ ...checkoutPadrao });
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
      checkout,
      atualizarCheckout,
      limparCheckout,
      enderecoPreenchido: enderecoEstaPreenchido(checkout),
    };
  }, [itens, checkout]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) {
    throw new Error('useCart precisa estar dentro de CartProvider');
  }
  return contexto;
}
