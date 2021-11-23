const {Sequelize} = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize({
  dialect: 'mssql',
  dialectModulePath: 'sequelize-msnodesqlv8',
  dialectOptions: {
    connectionString: process.env.SQL_SERVER_CONN_STRING
  },
});
