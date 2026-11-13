import { useState, useEffect } from 'react';

import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';

// Converte o valor da prop para CSS (aceita número, "700" ou "700px")
function toCssSize(value) {
  if (typeof value === 'number') return `${value}px`;
  const texto = String(value);
  if (texto.endsWith('px') || texto.endsWith('%')) return texto;
  return `${texto}px`;
}

// Galeria / carrossel
// Props: images (string ou { src }), width, height, radius, showThumbs, showDots, showArrows, autoPlay
export default function Gallery({
  images = [],
  className = '',
  width = '100%',
  height = 681,
  radius = '0px',
  showThumbs = false,
  showArrows = true,
  showDots = false,
  slideClassName = '',
  autoPlay = false,
}) {
  const [current, setCurrent] = useState(0);
  // Quando o mouse está em cima ou o dedo está na tela, o automático pausa
  const [pausado, setPausado] = useState(false);
  // Depois do último slide usamos uma cópia do primeiro. Ao chegar nela,
  // pulamos de volta para o original sem animação, para o loop ficar suave.
  const [semAnimacao, setSemAnimacao] = useState(false);

  const total = images.length;
  const podeLoop = autoPlay && total > 1;

  // Liga de novo a animação no frame seguinte, depois do "pulo" silencioso
  useEffect(() => {
    if (!semAnimacao) return undefined;
    const id = requestAnimationFrame(() => setSemAnimacao(false));
    return () => cancelAnimationFrame(id);
  }, [semAnimacao]);

  // Autoplay a cada 5 segundos. O current nas dependências faz o timer
  // recomeçar quando a pessoa clica numa seta ou bolinha. O return limpa o intervalo.
  useEffect(() => {
    if (!autoPlay || pausado || total <= 1) return undefined;

    const id = setInterval(() => {
      setCurrent((prev) => {
        if (podeLoop) {
          if (prev >= total) return prev;
          return prev + 1;
        }
        return (prev + 1) % total;
      });
    }, 5000);

    return () => clearInterval(id);
  }, [autoPlay, pausado, total, current, podeLoop]);

  if (!images || images.length === 0) {
    return <div>Nenhuma imagem disponível</div>;
  }

  // Aceita tanto '/foto.jpg' quanto { src: '/foto.jpg' }
  const getSrc = (image) => (typeof image === 'string' ? image : image.src);

  // Com autoplay, colocamos uma cópia da primeira foto no final da faixa
  const slides = podeLoop ? [...images, images[0]] : images;
  // Na cópia do primeiro, as bolinhas e miniaturas mostram o primeiro como ativo
  const indiceAtivo = podeLoop && current === total ? 0 : current;
  const isFirst = current === 0;
  const isLast = podeLoop ? current === total : current === total - 1;

  // Proporção do slide (na Home fica 1440 / 681)
  const widthNumber = parseFloat(String(width));
  const heightNumber = parseFloat(String(height));
  const aspectRatio =
    !Number.isNaN(widthNumber) && String(width) !== '100%'
      ? `${widthNumber} / ${heightNumber}`
      : `1440 / ${heightNumber}`;

  const arrowClass =
    'absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent md:size-12';

  // Avança para o próximo. Com loop, pode ir até a cópia da primeira.
  function irParaProximo() {
    setCurrent((prev) => {
      if (podeLoop) {
        if (prev >= total) return prev;
        return prev + 1;
      }
      return Math.min(prev + 1, total - 1);
    });
  }

  function irParaAnterior() {
    setCurrent((prev) => Math.max(prev - 1, 0));
  }

  // Quando a faixa chega na cópia da primeira, voltamos para o índice 0 sem o usuário perceber
  function aoTerminarTransicao() {
    if (podeLoop && current === total) {
      setSemAnimacao(true);
      setCurrent(0);
    }
  }

  return (
    <div
      className={className}
      style={{
        width: String(width) === '100%' ? '100%' : toCssSize(width),
        maxWidth: '100%',
      }}
    >
      {/* Slide principal */}
      <div
        className={`relative w-full overflow-hidden ${slideClassName}`}
        style={{ aspectRatio, borderRadius: radius }}
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
        onTouchStart={() => setPausado(true)}
        onTouchEnd={() => setPausado(false)}
      >
        <div
          className={`flex h-full ease-in-out ${semAnimacao ? 'transition-none' : 'transition-transform duration-700'}`}
          style={{ transform: `translateX(-${current * 100}%)` }}
          onTransitionEnd={aoTerminarTransicao}
        >
          {slides.map((image, index) => (
            <img
              key={`${getSrc(image)}-${index}`}
              src={getSrc(image)}
              alt={`Imagem ${index === total ? 1 : index + 1} de ${total}`}
              aria-hidden={indiceAtivo !== (index === total ? 0 : index)}
              className="h-full w-full shrink-0 object-cover"
            />
          ))}
        </div>

        {/* Setas: param no primeiro e no último slide (não voltam ao início) */}
        {showArrows && (
          <>
            <button
              type="button"
              className={`${arrowClass} left-2 md:left-6`}
              onClick={irParaAnterior}
              disabled={isFirst}
              aria-label="Imagem anterior"
            >
              <img src={arrowLeft} alt="" />
            </button>
            <button
              type="button"
              className={`${arrowClass} right-2 md:right-6`}
              onClick={irParaProximo}
              disabled={!podeLoop && isLast}
              aria-label="Próxima imagem"
            >
              <img src={arrowRight} alt="" />
            </button>
          </>
        )}

        {/* Bolinhas na parte de baixo */}
        {showDots && images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-4 md:gap-3">
            {images.map((image, index) => (
              <button
                type="button"
                key={getSrc(image)}
                aria-label={`Ir para imagem ${index + 1}`}
                onClick={() => setCurrent(index)}
                className={`size-2.5 rounded-full transition-colors md:size-3 ${
                  index === indiceAtivo ? 'bg-primary' : 'bg-light-gray-2'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniaturas (página do produto) */}
      {showThumbs && images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:mt-5 md:gap-5">
          {images.map((image, index) => (
            <button
              type="button"
              key={getSrc(image)}
              onClick={() => setCurrent(index)}
              aria-label={`Ver imagem ${index + 1}`}
              aria-current={index === indiceAtivo}
              className={`shrink-0 overflow-hidden border-2 ${
                index === indiceAtivo ? 'border-primary' : 'border-transparent'
              }`}
              style={{ borderRadius: radius }}
            >
              <img
                src={getSrc(image)}
                alt=""
                className="h-[60px] w-[74px] object-cover md:h-[95px] md:w-[117px]"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
