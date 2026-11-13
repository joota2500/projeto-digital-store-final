function FilterGroup({ title, inputType, options }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Título do grupo */}
      <h3 className="text-[14px] font-medium text-dark-gray-2">
        {title}
      </h3>

      {/* Lista de opções */}
      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex items-center gap-2 text-sm text-dark-gray-2 cursor-pointer"
          >
            <input
              type={inputType}
              name={inputType === "radio" ? title : undefined}
              value={option.value || option.text}
              className="w-[22px] h-[22px] accent-primary cursor-pointer"
            />

            {option.text}
          </label>
        ))}
      </div>
    </div>
  );
}

export default FilterGroup;
