import { useState } from 'react';

// Importando as setas (importar pelo JS funciona no build da Vercel)
import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';

// Componente de Galeria de imagens (carrossel simples)
// Props: images (array de src ou de { src }), className, width, height, radius, showThumbs,
// showArrows (padrão true), showDots (padrão false)
export default function Gallery({
  images = [],
  className = '',
  width = '100%',
  height = '400px',
  radius = '8px',
  showThumbs = false,
  showArrows = true,
  showDots = false,
}) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return <div>Nenhuma imagem disponível</div>;
  }

  // Aceita tanto '/foto.jpg' quanto { src: '/foto.jpg' }
  const getSrc = (image) => (typeof image === 'string' ? image : image.src);

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const goTo = (index) => {
    setCurrent(index);
  };

  return (
    <div className={`relative ${className}`} style={{ width }}>
      {/* Slide principal */}
      <div
        className="relative overflow-hidden"
        style={{ height, borderRadius: radius }}
      >
        <img
          src={getSrc(images[current])}
          alt={`Slide ${current + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Setas de navegação */}
        {showArrows && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
              aria-label="Anterior"
            >
              <img src={arrowLeft} alt="Anterior" className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
              aria-label="Próximo"
            >
              <img src={arrowRight} alt="Próximo" className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Bolinhas (dots) centralizadas na parte de baixo */}
        {showDots && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => goTo(index)}
                className={`w-[10px] h-[10px] rounded-full transition-colors ${
                  index === current ? 'bg-primary' : 'bg-light-gray-2'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniaturas (thumbs) */}
      {showThumbs && images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              type="button"
              key={index}
              onClick={() => goTo(index)}
              className={`flex-shrink-0 border-2 rounded overflow-hidden ${
                index === current ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img
                src={getSrc(image)}
                alt={`Miniatura ${index + 1}`}
                className="w-[117px] h-[95px] object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
