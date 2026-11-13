'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      // Nome e imagem ficam salvos no item, para o pedido não "sumir" se o produto for apagado
      product_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      size: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unit_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('order_items');
  },
};
