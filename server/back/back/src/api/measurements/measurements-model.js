import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Measurement = sequelize.define('measurements', {
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

    binary_values: {
        type: Sequelize.INTEGER, allowNull: false,
    },
    has_persons: {
        type: DataTypes.INTEGER, allowNull: false,
    },
    has_sound: {
        type: DataTypes.INTEGER, allowNull: false,
    },
    has_gas: {
        type: DataTypes.INTEGER, allowNull: false,
    },
    has_oil: {
        type: DataTypes.INTEGER, allowNull: false,
    },
    has_rain: {
        type: DataTypes.INTEGER, allowNull: false,
    },
    temperature: {
        type: DataTypes.INTEGER, allowNull: true,
    },
    humidity: {
        type: DataTypes.INTEGER, allowNull: true,
    },



}, {
    timestamps: false
});

export default Measurement;  