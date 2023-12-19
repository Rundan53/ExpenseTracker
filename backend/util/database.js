const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenses', 'root', 'Rundan@99', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
