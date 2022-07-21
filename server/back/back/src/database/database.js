import { Sequelize } from "sequelize";
import config from '../../config/config';


// la cadena de conexion
export const sequelize = new Sequelize(
    config.sequelize.user,
    config.sequelize.db,
    config.sequelize.pass, {
    host: config.sequelize.host,
    dialect: config.sequelize.dialect,
    pool: {
        max: 5,
        min: 0,
        require: 30000,
        idle: 10000
    },
    define: {
        timestamps: true,
        freezeTableName: true // para que no ponga a plural el nombre de las tablas
    },
    logging: false
}
);