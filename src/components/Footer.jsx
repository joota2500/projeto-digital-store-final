import Logo from './Logo'
import FooterInfo from './FooterInfo'

// Importando os ícones das redes sociais
import facebook from '../assets/facebook.svg'
import instagram from '../assets/instagram.svg'
import twitter from '../assets/twitter.svg'

function Footer() {
  // Informações da primeira coluna
  const informacoes = [
    { text: 'Sobre Drip Store', link: '/about' },
    { text: 'Segurança', link: '/seguranca' },
    { text: 'Wishlist', link: '/wishlist' },
    { text: 'Blog', link: '/blog' },
    { text: 'Trabalhe conosco', link: '/trabalhe-conosco' },
    { text: 'Meus Pedidos', link: '/meus-pedidos' },
  ]

  // Informações da segunda coluna
  const categorias = [
    { text: 'Camisetas', link: '/categorias/camisetas' },
    { text: 'Calças', link: '/categorias/calcas' },
    { text: 'Bonés', link: '/categorias/bones' },
    { text: 'Headphones', link: '/categorias/headphones' },
    { text: 'Tênis', link: '/categorias/tenis' },
  ]

  // Informações da terceira coluna
  const contato = [
    {
      text: 'Av. Santos Dumont, 1510 - 1 andar - Aldeota, Fortaleza - CE, 60150-161',
      link: '#',
    },
    {
      text: '(85) 3051-3411',
      link: 'tel:8530513411',
    },
  ]

  // Pega o ano atual automaticamente
  const anoAtual = new Date().getFullYear()

  return (
    <footer className="bg-dark-gray text-white w-full">
      <div className="max-w-[1200px] mx-auto px-6 py-12">

        {/* Parte superior do footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo, descrição e redes sociais */}
          <div className="flex flex-col gap-6">
            <Logo variant="footer" />

            {/* Descrição da empresa */}
            <p className="text-sm leading-relaxed text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>

            {/* Redes sociais */}
            <div className="flex items-center gap-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={facebook}
                  alt="Facebook"
                  className="w-6 h-6"
                />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={instagram}
                  alt="Instagram"
                  className="w-6 h-6"
                />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={twitter}
                  alt="Twitter"
                  className="w-6 h-6"
                />
              </a>
            </div>
          </div>

          {/* Coluna de informações */}
          <FooterInfo
            title="Informações"
            informations={informacoes}
          />

          {/* Coluna de categorias */}
          <FooterInfo
            title="Categorias"
            informations={categorias}
          />

          {/* Coluna de contato */}
          <FooterInfo
            title="Contato"
            informations={contato}
          />

        </div>

        {/* Linha divisória */}
        <hr className="border-dark-gray-3 my-10" />

        {/* Direitos autorais */}
        <p className="text-center text-sm text-white">
          © {anoAtual} Digital Store
        </p>

      </div>
    </footer>
  )
}

export default Footer
