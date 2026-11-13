const { DataTypes } = require('sequelize');

// Modelo da tabela de imagens do produto
module.exports = (sequelize) => {
  const ProductImage = sequelize.define(
    'ProductImage',
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
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      // Caminho relativo da imagem no servidor (ex: /uploads/foto.png)
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'product_images',
      timestamps: false,
    }
  );

  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, {
      foreignKey: 'product_id',
    });
  };

  return ProductImage;
};
