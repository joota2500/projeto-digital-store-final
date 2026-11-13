const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

// Conexão com o MySQL (só conecta de verdade quando o servidor sobe ou há uma consulta)
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.User = require('./User')(sequelize);
db.Category = require('./Category')(sequelize);
db.Product = require('./Product')(sequelize);
db.ProductImage = require('./ProductImage')(sequelize);
db.ProductOption = require('./ProductOption')(sequelize);
db.ProductCategory = require('./ProductCategory')(sequelize);

// Liga os relacionamentos declarados em cada model
Object.keys(db).forEach((nome) => {
  if (db[nome].associate) {
    db[nome].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
