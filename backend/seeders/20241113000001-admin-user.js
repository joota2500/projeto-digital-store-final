'use strict';

const bcrypt = require('bcrypt');

// Usuário administrador de demonstração
// E-mail: admin@digitalstore.com
// Senha: 123@123
module.exports = {
  async up(queryInterface) {
    const senhaHash = await bcrypt.hash('123@123', 10);
    const agora = new Date();

    await queryInterface.bulkInsert('users', [
      {
        firstname: 'Admin',
        surname: 'Digital Store',
        email: 'admin@digitalstore.com',
        password: senhaHash,
        created_at: agora,
        updated_at: agora,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@digitalstore.com' });
  },
};
