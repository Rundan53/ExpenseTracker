// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Expense = sequelize.define('expenses',{
//     id:{
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true
//     },

//     amount:{
//         type: Sequelize.DOUBLE,
//         allowNull: false,
//     },

//     description:{
//         type: Sequelize.STRING,
//         allowNull: true
//     },

//     category:{
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = Schema({
    amount: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
        required: false
    },

    category: {
        type: String,
        required: true
    },

    userId: {type: mongoose.Types.ObjectId, ref:'User', required: true}
})

module.exports = mongoose.model('Expense', expenseSchema);