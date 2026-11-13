import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Gallery simples com setas e thumbs (estilo carrossel da Home)
const Gallery = ({ images = [], width = '100%', height = '400px' }) => {
  const [current, setCurrent] = useState(0);

  if (!images.length) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      <img
        src={images[current].src}
        alt={images[current].alt || 'Slide'}
        className="w-full h-full object-cover"
      />

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
      >
        <ChevronLeft size={24} className="text-dark-gray" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
      >
        <ChevronRight size={24} className="text-dark-gray" />
      </button>

      {/* Thumbs */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${i === current ? 'bg-primary' : 'bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
