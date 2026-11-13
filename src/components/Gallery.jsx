import { useState } from 'react'

// Importando as setas
import arrowLeft from '../assets/arrow-left.svg'
import arrowRight from '../assets/arrow-right.svg'

function Gallery({
  images,
  className = '',
  width,
  height,
  radius = '4px',
  showThumbs = false,
}) {
  // Guarda o índice da imagem atual
  const [index, setIndex] = useState(0)

  // Vai para a imagem anterior
  function imagemAnterior() {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  // Vai para a próxima imagem
  function proximaImagem() {
    if (index < images.length - 1) {
      setIndex(index + 1)
    }
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>

      {/* Área principal do slide */}
      <div
        className="relative overflow-hidden"
        style={{
          width: width,
          height: height,
          borderRadius: radius,
        }}
      >

        {/* Faixa com todas as imagens */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {images.map((image, i) => (
            <img
              key={i}
              src={image.src}
              alt={`Imagem ${i + 1}`}
              className="w-full h-full shrink-0 object-cover"
              style={{
                borderRadius: radius,
              }}
            />
          ))}
        </div>

        {/* Seta esquerda */}
        <button
          type="button"
          onClick={imagemAnterior}
          disabled={index === 0}
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            index === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
          }`}
        >
          <img
            src={arrowLeft}
            alt="Imagem anterior"
            className="w-6 h-6"
          />
        </button>

        {/* Seta direita */}
        <button
          type="button"
          onClick={proximaImagem}
          disabled={index === images.length - 1}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${
            index === images.length - 1
              ? 'opacity-30 cursor-not-allowed'
              : 'opacity-100'
          }`}
        >
          <img
            src={arrowRight}
            alt="Próxima imagem"
            className="w-6 h-6"
          />
        </button>

      </div>

      {/* Miniaturas das imagens */}
      {showThumbs && (
        <div className="flex gap-3 flex-wrap">
          {images.map((image, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`overflow-hidden ${
                index === i
                  ? 'border-2 border-primary'
                  : 'border-2 border-transparent'
              }`}
              style={{
                width: '117px',
                height: '95px',
                borderRadius: radius,
              }}
            >
              <img
                src={image.src}
                alt={`Miniatura ${i + 1}`}
                className="w-full h-full object-cover"
                style={{
                  borderRadius: radius,
                }}
              />
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

export default Gallery
