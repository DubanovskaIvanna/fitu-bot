const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const Exercise = sequelize.define('Exercise', {
    ID: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    Exercise: {type: DataTypes.STRING, length:4000, defaultValue: null},
    ImageURL: {type: DataTypes.STRING, defaultValue: null},
})

module.exports = Exercise;