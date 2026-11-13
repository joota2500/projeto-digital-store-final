const { DataTypes } = require('sequelize');

// Modelo dos itens de um pedido (cada linha do carrinho vira um item)
module.exports = (sequelize) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      unit_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: 'order_items',
    }
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
    });

    OrderItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  };

  return OrderItem;
};
