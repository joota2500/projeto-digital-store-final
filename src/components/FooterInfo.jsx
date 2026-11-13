import { Link } from 'react-router-dom'

function FooterInfo({ title, informations }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white md:text-base">
        {title}
      </h3>

      <ul className="flex flex-col gap-2">
        {informations.map((item) => {
          const isExternal =
            item.link.startsWith('http') ||
            item.link.startsWith('tel:') ||
            item.link === '#'

          return (
            <li key={item.text}>
              {isExternal ? (
                <a href={item.link} className="text-sm text-white/85 hover:text-white hover:underline">
                  {item.text}
                </a>
              ) : (
                <Link to={item.link} className="text-sm text-white/85 hover:text-white hover:underline">
                  {item.text}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FooterInfo
