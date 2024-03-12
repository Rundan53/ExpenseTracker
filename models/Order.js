// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const Order = sequelize.define('orders', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },

//     paymentId: Sequelize.STRING,

//     orderId: Sequelize.STRING,

//     status: Sequelize.STRING
// });


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = Schema({
    paymentId: {
        type: String,
        default: null,
    },

    orderId: String,

    status: String,

    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

module.exports = mongoose.model('Order', orderSchema);