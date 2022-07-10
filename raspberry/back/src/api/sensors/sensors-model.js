import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Sensor = sequelize.define('sensors', {
    date_time: {
        type: Sequelize.DATE,
        primaryKey: true
    },
    has_sended: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    binary_values: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    has_persons: {
        type: Sequelize.SMALLSTRING,
        allowNull: true,
    },
    has_sound: {
        type: Sequelize.SMALLSTRING,
        allowNull: true,
    },
    has_gas: {
        type: Sequelize.SMALLSTRING,
        allowNull: true,
    },
    has_oil: {
        type: Sequelize.SMALLSTRING,
        allowNull: true,
    },
    has_rain: {
        type: Sequelize.SMALLSTRING,
        allowNull: true,
    },
    has_temperature: {
        type: Sequelize.SMALLSTRING,
        allowNull: true,
    },
    humidity: {
        type: Sequelize.SMALLSTRING,
        allowNull: true,
    },








}, {
    timestamps: false
});


export default Sensor;  