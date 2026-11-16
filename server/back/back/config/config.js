'use strict';

// Set env variables
require('dotenv').config();

const requiredEnv = [
    'EXPRESS_PORT',
    'SECRET',
    'TOKEN_CADUCITY',
    'ROUTES_WHITELIST',
    'SEQUELIZE_DB',
    'SEQUELIZE_USER',
    'SEQUELIZE_PASS',
    'SEQUELIZE_HOST'
];
const missingEnv = requiredEnv.filter((name) =>
    process.env[name] === undefined
    || (name !== 'SEQUELIZE_PASS' && process.env[name].trim() === '')
);

if (missingEnv.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
}

const config = {
    expressPort: process.env.EXPRESS_PORT,
    listLimit: process.env.LIST_LIMIT || undefined,
    secret: process.env.SECRET,
    tokenCaducity: process.env.TOKEN_CADUCITY,
    isApiSecured: process.env.API_SECURED,
    seedInitialData: process.env.SEQUELIZE_SEED_INITIAL_DATA,
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
    simulate_places: process.env.SIMULATE_PLACES
};

module.exports = config;