// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const User = sequelize.define('users', {
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },

//     username:{
//         type: Sequelize.STRING,
//         allowNull: false
//     },

//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique:true,
//     },

//     password: {
//         type: Sequelize.STRING,
//         allowNull:false,
//     },

//     totalAmount: {
//         type: Sequelize.DOUBLE,
//         defaultValue: 0
//     },

//     isPremiumUser: Sequelize.BOOLEAN

// });

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        allowNull: false,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    totalAmount: {
        type: Number,
        default: 0
    },

    isPremiumUser: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('User', userSchema);
