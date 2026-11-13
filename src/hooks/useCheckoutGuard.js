import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getUsuarioLogado } from '../services/api';

// Protege as etapas de entrega e pagamento: precisa ter itens e estar logado
export function useCheckoutGuard({ exigirEndereco = false } = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { itens, enderecoPreenchido } = useCart();
  const [liberado, setLiberado] = useState(false);

  useEffect(() => {
    if (!itens.length) {
      navigate('/carrinho', { replace: true });
      return;
    }

    if (!getUsuarioLogado()) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
      return;
    }

    if (exigirEndereco && !enderecoPreenchido) {
      navigate('/carrinho/entrega', { replace: true });
      return;
    }

    setLiberado(true);
  }, [itens.length, enderecoPreenchido, exigirEndereco, navigate, location.pathname]);

  return liberado;
}
