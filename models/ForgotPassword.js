// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const ForgotPassword = sequelize.define('forgotPassword', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },

//     active: Sequelize.BOOLEAN,

// });

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotPasswordSchema = Schema({
    _id: {
        type: mongoose.Types.UUID,
        required: true
    },

    active: {
        type: Boolean,
        default: null
    },

    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }


})


module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);