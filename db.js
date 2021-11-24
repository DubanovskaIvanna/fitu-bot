const {Sequelize} = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize(
  process.env.SQL_DB_NAME.toString(), 
  process.env.SQL_DB_UID.toString(), 
  process.env.SQL_DB_PASS.toString(), {
  host: process.env.SQL_DB_HOST.toString(),
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
