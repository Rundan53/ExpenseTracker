const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.SQL_DB_NAME, process.env.SQL_DB_USER , process.env.SQL_DB_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost',
});



module.exports = sequelize;
