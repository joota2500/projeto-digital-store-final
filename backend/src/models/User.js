const { DataTypes } = require('sequelize');

// Modelo da tabela de usuários
module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      // A senha é salva já com hash (bcrypt), nunca em texto puro
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'users',
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: 'user_id',
      as: 'orders',
    });
  };

  return User;
};
