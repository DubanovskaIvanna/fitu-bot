const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('User', {
    ID: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    ChatId: {type: DataTypes.STRING, unique: true},
    TypeOfSet: {type: DataTypes.INTEGER, defaultValue: null},
    AdditionSet: {type: DataTypes.INTEGER, defaultValue: null},
    WorkType: {type: DataTypes.STRING, defaultValue: null},
    AgeRange: {type: DataTypes.STRING, defaultValue: null},
    Intensity: {type: DataTypes.STRING, defaultValue: null},
    Sex: {type: DataTypes.STRING, defaultValue: null},
    Iterations: {type: DataTypes.STRING, defaultValue: null},
    LastQuestionId: {type: DataTypes.INTEGER, defaultValue: null},
    Times: {type: DataTypes.INTEGER, defaultValue: null},
    SpineDepartment: {type: DataTypes.STRING, defaultValue: null},
    ImageURL: {type: DataTypes.STRING, defaultValue: null},
})

module.exports = User;
