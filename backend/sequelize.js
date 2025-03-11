const { Sequelize } = require('sequelize');
const config = require('./config/config');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelizeInstance = new Sequelize(
    dbConfig.database, 
    dbConfig.username, 
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        dialectOptions: dbConfig.dialectOptions,
        logging: true
    }
);

async function testConnection() {
    try{
        await sequelizeInstance.authenticate();
        console.log('Connection has been established successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

testConnection();

module.exports = sequelizeInstance;
