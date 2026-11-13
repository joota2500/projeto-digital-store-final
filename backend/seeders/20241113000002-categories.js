'use strict';

// As 4 categorias usadas no front-end da loja
module.exports = {
  async up(queryInterface) {
    const agora = new Date();

    await queryInterface.bulkInsert('categories', [
      { name: 'Casual', slug: 'casual', use_in_menu: true, created_at: agora, updated_at: agora },
      { name: 'Esporte e lazer', slug: 'esporte-lazer', use_in_menu: true, created_at: agora, updated_at: agora },
      { name: 'Corrida', slug: 'corrida', use_in_menu: true, created_at: agora, updated_at: agora },
      { name: 'Utilitário', slug: 'utilitario', use_in_menu: true, created_at: agora, updated_at: agora },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', {
      slug: ['casual', 'esporte-lazer', 'corrida', 'utilitario'],
    });
  },
};
