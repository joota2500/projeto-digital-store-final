import starIcon from "../assets/star-icon.svg";

function BuyBox({
  name,
  reference,
  stars,
  rating,
  price,
  priceDiscount,
  description,
  children,
}) {
  // Formata o valor para moeda brasileira
  const formatPrice = (value) => {
    return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Nome do produto */}
      <h1 className="text-[32px] font-bold text-dark-gray">
        {name}
      </h1>

      {/* Referência do produto */}
      <p className="text-[12px] text-dark-gray-3">
        {reference}
      </p>

      {/* Avaliação */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-warning rounded-[4px] px-2 py-1">
          <span className="text-[14px] text-white">
            {stars}
          </span>

          <img
            src={starIcon}
            alt="Estrela"
            className="w-4 h-4"
          />
        </div>

        <span className="text-[14px] text-light-gray">
          ({rating} avaliações)
        </span>
      </div>

      {/* Preços */}
      <div className="flex items-center gap-3">
        {priceDiscount ? (
          <>
            <span className="text-[16px] text-light-gray-2 line-through">
              {formatPrice(price)}
            </span>

            <span className="text-[32px] font-bold text-dark-gray-2">
              {formatPrice(priceDiscount)}
            </span>
          </>
        ) : (
          <span className="text-[32px] font-bold text-dark-gray-2">
            {formatPrice(price)}
          </span>
        )}
      </div>

      {/* Descrição */}
      <p className="text-[14px] text-dark-gray-2 leading-relaxed">
        {description}
      </p>

      {/* Opções de tamanho e cor */}
      <div className="flex flex-col gap-5">
        {children}
      </div>

      {/* Botão de compra */}
      <button
        type="button"
        className="w-[220px] max-w-full h-[48px] bg-warning text-white text-[16px] font-bold rounded-[8px] cursor-pointer hover:opacity-90"
      >
        COMPRAR
      </button>

    </div>
  );
}

export default BuyBox;
