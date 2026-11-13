// Funções de alerta da loja, usando SweetAlert2 no lugar do alert/confirm do navegador
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'sweetalert2/dist/sweetalert2.min.css';

const Alerta = withReactContent(Swal);

// Cores do @theme em src/index.css, para o alerta ficar com a cara da loja
const COR_PRINCIPAL = '#C92071';
const COR_ERRO = '#EE4266';
const COR_SUCESSO = '#52CA76';
const COR_AVISO = '#F6AA1C';

function noCelular() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
}

// Estilo padrão: botões nossos (rosa da loja) e janela mais compacta no celular
const estiloBase = {
  customClass: {
    popup: 'alerta-popup',
    title: 'alerta-titulo',
    htmlContainer: 'alerta-texto',
    confirmButton: 'alerta-botao-ok',
    cancelButton: 'alerta-botao-voltar',
    actions: 'alerta-acoes',
    timerProgressBar: 'alerta-barra',
  },
  buttonsStyling: false,
  color: '#474747',
};

export async function confirmar({
  titulo = 'Tem certeza?',
  texto = '',
  botaoConfirmar = 'Sim, cancelar',
  botaoVoltar = 'Voltar',
} = {}) {
  const resultado = await Alerta.fire({
    ...estiloBase,
    title: titulo,
    text: texto,
    icon: 'warning',
    iconColor: COR_AVISO,
    showCancelButton: true,
    confirmButtonText: botaoConfirmar,
    cancelButtonText: botaoVoltar,
    reverseButtons: true,
    focusCancel: true,
    width: noCelular() ? '20rem' : '28rem',
  });

  return resultado.isConfirmed;
}

export function toastSucesso(mensagem) {
  return Alerta.fire({
    ...estiloBase,
    toast: true,
    position: noCelular() ? 'top' : 'top-end',
    icon: 'success',
    iconColor: COR_SUCESSO,
    title: mensagem,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    width: noCelular() ? '18rem' : '22rem',
  });
}

export function toastInfo(mensagem) {
  return Alerta.fire({
    ...estiloBase,
    toast: true,
    position: noCelular() ? 'top' : 'top-end',
    icon: 'info',
    iconColor: COR_PRINCIPAL,
    title: mensagem,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    width: noCelular() ? '18rem' : '22rem',
  });
}

export function alertaErro(titulo, texto = '') {
  return Alerta.fire({
    ...estiloBase,
    title: titulo,
    text: texto,
    icon: 'error',
    iconColor: COR_ERRO,
    confirmButtonText: 'Ok',
    width: noCelular() ? '20rem' : '28rem',
  });
}

export function alertaSucesso(titulo, texto = '') {
  return Alerta.fire({
    ...estiloBase,
    title: titulo,
    text: texto,
    icon: 'success',
    iconColor: COR_SUCESSO,
    confirmButtonText: 'Ok',
    width: noCelular() ? '20rem' : '28rem',
  });
}

// Substitui o window.alert antigo, quando precisar de um aviso simples
export function alerta(mensagem, titulo = '') {
  return Alerta.fire({
    ...estiloBase,
    title: titulo || mensagem,
    text: titulo ? mensagem : '',
    confirmButtonText: 'Ok',
    width: noCelular() ? '20rem' : '28rem',
  });
}
