import Logo from './Logo'
import FooterInfo from './FooterInfo'

import facebook from '../assets/facebook.svg'
import instagram from '../assets/instagram.svg'
import twitter from '../assets/twitter.svg'

function Footer() {
  const informacoes = [
    { text: 'Sobre Digital Store', link: '/about' },
    { text: 'Segurança', link: '/seguranca' },
    { text: 'Wishlist', link: '/wishlist' },
    { text: 'Blog', link: '/blog' },
    { text: 'Trabalhe conosco', link: '/trabalhe-conosco' },
    { text: 'Meus Pedidos', link: '/meus-pedidos' },
  ]

  // Links usam as categorias reais da loja (?category=slug)
  const categorias = [
    { text: 'Casual', link: '/products?category=casual' },
    { text: 'Esporte e lazer', link: '/products?category=esporte-lazer' },
    { text: 'Corrida', link: '/products?category=corrida' },
    { text: 'Utilitário', link: '/products?category=utilitario' },
    { text: 'Todos os produtos', link: '/products' },
  ]

  const anoAtual = new Date().getFullYear()

  return (
    <footer className="bg-dark-gray text-white">
      <div className="mx-auto max-w-360 px-4 pt-8 pb-5 md:px-10 md:pt-12 md:pb-7 xl:px-25">

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-[minmax(0,1.3fr)_auto_auto_auto] lg:gap-x-12 lg:gap-y-0">

          <div className="col-span-2 max-w-md lg:col-span-1">
            <Logo variant="footer" className="h-6 w-auto md:h-8" />

            <p className="mt-4 text-sm leading-6 text-white/85 md:mt-5">
              A Digital Store é a sua loja de tênis e moda online, com as melhores marcas e preços que cabem no bolso. Compre com segurança e receba no conforto da sua casa.
            </p>

            <ul className="mt-5 flex items-center gap-5">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <img src={facebook} alt="" className="h-4 w-auto" />
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <img src={instagram} alt="" className="h-4 w-auto" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <img src={twitter} alt="" className="h-4 w-auto" />
                </a>
              </li>
            </ul>
          </div>

          <FooterInfo title="Informação" informations={informacoes} />
          <FooterInfo title="Categorias" informations={categorias} />

          <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-3 text-sm font-semibold md:text-base">Contato</h3>
            <address className="text-sm leading-6 not-italic text-white/85">
              Av. Santos Dumont, 1510 - 1 andar -<br />
              Aldeota, Fortaleza - CE, 60150-161
              <br />
              <br />
              (85) 3051-3411
            </address>
          </div>
        </div>

        <hr className="mt-8 border-dark-gray-3 md:mt-10" />

        <p className="mt-5 text-center text-xs md:mt-6 md:text-sm">
          © {anoAtual} Digital Store
        </p>
      </div>
    </footer>
  )
}

export default Footer
