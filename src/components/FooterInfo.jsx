function FooterInfo({ title, informations }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Título da coluna */}
      <h3 className="text-white font-bold text-lg">
        {title}
      </h3>

      {/* Lista de informações */}
      <ul className="flex flex-col gap-3">
        {informations.map((item, index) => (
          <li key={index}>
            <a
              href={item.link}
              className="text-white text-sm hover:text-light-gray-2 transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterInfo
