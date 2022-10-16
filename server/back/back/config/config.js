'use strict';

// Set env variables
require('dotenv').config();

const config = {
    expressPort: process.env.EXPRESS_PORT,
    listLimit: process.env.LIST_LIMIT || undefined,
    secret: process.env.SECRET,
    tokenCaducity: process.env.TOKEN_CADUCITY,
    isApiSecured: process.env.API_SECURED,
    createDatabase: process.env.SEQUELIZE_CREATE_DATABASE,
    routesWhitelist: process.env.ROUTES_WHITELIST.split(','),
    sequelize: {
        dialect: process.env.SEQUELIZE_DIALECT || 'postgres',
        db: process.env.SEQUELIZE_DB,
        user: process.env.SEQUELIZE_USER,
        pass: process.env.SEQUELIZE_PASS,
        host: process.env.SEQUELIZE_HOST,
        port: process.env.SEQUELIZE_PORT,
        schema: process.env.SEQUELIZE_SCHEMA || 'postgress',
    },
};

console.log('Configuration loaded:', config);

module.exports = config;