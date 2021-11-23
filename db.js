const {Sequelize} = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize({
  dialect: 'mssql',
  dialectModulePath: 'msnodesqlv8/lib/sequelize',
  dialectOptions: {
    connectionString: process.env.SQL_SERVER_CONN_STRING
  },
});
