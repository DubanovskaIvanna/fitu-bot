const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const Question = sequelize.define('Question', {
    Identity: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    ID: {type: DataTypes.INTEGER},
    ParentID: {type: DataTypes.INTEGER, defaultValue: null},
    Question: {type: DataTypes.STRING, length:4000, defaultValue: null},
    TypeOfSet: {type: DataTypes.INTEGER, defaultValue: null},
    AdditionSet: {type: DataTypes.INTEGER, defaultValue: null},
    WorkType: {type: DataTypes.STRING, defaultValue: null},
    AgeRange: {type: DataTypes.STRING, defaultValue: null},
    Intensity: {type: DataTypes.STRING, defaultValue: null},
    Sex: {type: DataTypes.STRING, defaultValue: null},
    Iterations: {type: DataTypes.STRING, defaultValue: null},
    Times: {type: DataTypes.INTEGER, defaultValue: null},
    SpineDepartment: {type: DataTypes.STRING, defaultValue: null},
    ImageURL: {type: DataTypes.STRING, defaultValue: null},
})

module.exports = Question;