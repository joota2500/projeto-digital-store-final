import { useState } from "react";

function ProductOptions({ options, radius, shape, type }) {
  // Guarda a opção selecionada
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option, index) => {
        const isSelected = selected === index;

        return (
          <button
            key={index}
            type="button"
            onClick={() => setSelected(index)}
            className={`flex items-center justify-center border cursor-pointer ${
              isSelected ? "border-primary border-2" : "border-light-gray-2"
            } ${
              shape === "circle"
                ? "w-[31px] h-[31px] rounded-full"
                : "h-[46px] px-4"
            }`}
            style={{
              borderRadius: shape === "circle" ? "50%" : radius,
              backgroundColor: type === "color" ? option : "white",
            }}
          >
            {/* Mostra o texto quando o tipo for text */}
            {type === "text" && (
              <span className="text-[24px] text-dark-gray-2">
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
