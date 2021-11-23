const {Sequelize} = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize(process.env.SQL_DB_NAME, process.env.SQL_DB_UID, process.env.SQL_DB_PASS, {
  host: process.env.SQL_DB_HOST,
  dialect: 'mssql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  dialectOptions: {
    encrypt: true
  }
});
