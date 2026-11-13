const { DataTypes } = require('sequelize');

// Modelo da tabela de opções do produto (cor, tamanho, etc.)
module.exports = (sequelize) => {
  const ProductOption = sequelize.define(
    'ProductOption',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shape: {
        type: DataTypes.ENUM('square', 'circle'),
        allowNull: true,
        defaultValue: 'square',
      },
      // Valor numérico do border-radius (se vier "4px", salvamos 4)
      radius: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.ENUM('text', 'color'),
        allowNull: true,
        defaultValue: 'text',
      },
      // Todas as opções juntas, separadas por vírgula
      values: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'product_options',
      timestamps: false,
    }
  );

  ProductOption.associate = (models) => {
    ProductOption.belongsTo(models.Product, {
      foreignKey: 'product_id',
    });
  };

  return ProductOption;
};
