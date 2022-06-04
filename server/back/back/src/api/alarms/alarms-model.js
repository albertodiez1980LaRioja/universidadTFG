import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Alarm = sequelize.define('alarms', {
    date_time: {
        type: DataTypes.DATE,
        primaryKey: true,
    },
    latitude: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    longitude: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    id_sensor: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },


    dni_operator_acussated: {
        type: Sequelize.STRING, allowNull: false,
    },
    date_finish: {
        type: DataTypes.DATE, allowNull: false,
    },



}, {
    timestamps: false
});

export default Alarm;  