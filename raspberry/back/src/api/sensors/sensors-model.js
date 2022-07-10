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
        type: Sequelize.SMALLINT,
        allowNull: true,
    },
    has_sound: {
        type: Sequelize.SMALLINT,
        allowNull: true,
    },
    has_gas: {
        type: Sequelize.SMALLINT,
        allowNull: true,
    },
    has_oil: {
        type: Sequelize.SMALLINT,
        allowNull: true,
    },
    has_rain: {
        type: Sequelize.SMALLINT,
        allowNull: true,
    },
    temperature: {
        type: Sequelize.SMALLINT,
        allowNull: true,
    },
    humidity: {
        type: Sequelize.SMALLINT,
        allowNull: true,
    },








}, {
    timestamps: false
});


export default Sensor;  