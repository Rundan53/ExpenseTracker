// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const DownloadedFile = sequelize.define('downloadedFiles', {
//     id:{
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true
//     },

//     fileUrl: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downFileSchema = Schema({
    fileUrl:{
        type: String,
        required: true
    },

    updatedAt: {
        type: Date,
        default:  function() {
            return new Date();
        }
    },

    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})


module.exports = mongoose.model('DownloadedFile', downFileSchema);
