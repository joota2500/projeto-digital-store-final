const { DataTypes } = require('sequelize');

// Modelo da tabela de pedidos
module.exports = (sequelize) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pendente', 'pago', 'enviado', 'entregue', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendente',
      },
      shipping_cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      recipient: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      complement: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      neighborhood: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM('pix', 'cartao', 'boleto'),
        allowNull: false,
      },
    },
    {
      tableName: 'orders',
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'items',
      onDelete: 'CASCADE',
    });
  };

  return Order;
};
