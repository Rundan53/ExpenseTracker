const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expense = sequelize.define('expenses',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    amount:{
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    
    description:{
        type: Sequelize.STRING,
        allowNull: true
    },

    category:{
        type: Sequelize.STRING,
        allowNull: false
    }
});


module.exports = Expense;