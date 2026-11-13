import { useState } from 'react';

// Opções de tamanho (quadrado) ou cor (círculo)
// Aceita value/onChange para o pai controlar a escolha (usado na página do produto)
function ProductOptions({ options, radius = '4px', shape, type, label, value, onChange }) {
  const [interno, setInterno] = useState(null);
  const selected = value !== undefined ? value : interno;

  function escolher(option) {
    if (onChange) onChange(option);
    else setInterno(option);
  }

  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected === option;
        const isCircle = shape === 'circle';
        const isColor = type === 'color';

        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={isColor ? `Cor ${option}` : `Tamanho ${option}`}
            onClick={() => escolher(option)}
            className={`flex items-center justify-center transition-colors ${
              isCircle ? 'size-[31px] rounded-full' : 'h-[46px] min-w-[46px] px-2'
            } ${
              isSelected
                ? 'border-2 border-primary'
                : isColor
                  ? 'border-2 border-transparent'
                  : 'border border-light-gray-2'
            } ${!isColor && isSelected ? 'bg-primary text-white' : ''} ${
              !isColor && !isSelected ? 'text-dark-gray-2' : ''
            }`}
            style={{
              borderRadius: isCircle ? undefined : radius,
              backgroundColor: isColor ? option : undefined,
              boxShadow: isColor && isSelected ? 'inset 0 0 0 3px white' : undefined,
            }}
          >
            {!isColor && (
              <span className={isCircle ? 'text-sm' : 'text-2xl max-md:text-base'}>
                {option}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ProductOptions;
