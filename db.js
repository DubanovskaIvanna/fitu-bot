const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'telega',
    'root',
    'root',
    {
        host: '5.188.129.229',
        port: '6432',
        dialect: 'postgres'
    }
    //  psql --host=5.188.129.229 \
    //  --port=6432 \
//      --user=<database user name> \
//      --dbname=<database name> \
//      --set=sslmode=verify-ca
)
