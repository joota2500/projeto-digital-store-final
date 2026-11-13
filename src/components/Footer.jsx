import React from 'react';
import Logo from './Logo';

// Rodapé da Digital Store - versão sem ícones de rede que o lucide não tem mais
const Footer = () => {
  const infos = [
    { title: 'Informações', items: [
      { text: 'Sobre Drip Store', link: '/about' },
      { text: 'Segurança', link: '/seguranca' },
      { text: 'Wishlist', link: '/wishlist' },
      { text: 'Blog', link: '/blog' },
    ]},
    { title: 'Categorias', items: [
      { text: 'Camisetas', link: '/categorias/camisetas' },
      { text: 'Calças', link: '/categorias/calcas' },
      { text: 'Bonés', link: '/categorias/bones' },
      { text: 'Headphones', link: '/categorias/headphones' },
    ]},
    { title: 'Contato', items: [
      { text: 'Av. Santos Dumont, 1510', link: '#' },
      { text: '(85) 3051-3411', link: 'tel:8530513411' },
    ]},
  ];

  return (
    <footer className="bg-dark-gray text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Logo className="filter brightness-0 invert" />
          <p className="mt-4 text-sm text-light-gray-2 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
          </p>
          <div className="flex gap-4 mt-6 text-sm">
            <a href="#" className="hover:text-primary">Facebook</a>
            <a href="#" className="hover:text-primary">Instagram</a>
            <a href="#" className="hover:text-primary">Twitter</a>
          </div>
        </div>

        {infos.map((col) => (
          <div key={col.title}>
            <h3 className="font-bold mb-4">{col.title}</h3>
            <ul className="space-y-2 text-sm text-light-gray-2">
              {col.items.map((item) => (
                <li key={item.text}>
                  <a href={item.link} className="hover:text-white">{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <hr className="border-dark-gray-3 mx-4" />
      <p className="text-center text-sm py-6 text-light-gray">© {new Date().getFullYear()} Digital Store</p>
    </footer>
  );
};

export default Footer;
