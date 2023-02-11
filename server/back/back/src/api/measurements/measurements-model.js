import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Measurement = sequelize.define('measurements', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    date_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    binary_values: {
        type: Sequelize.INTEGER, allowNull: true,
    },
    has_persons: {
        type: DataTypes.INTEGER, allowNull: true,
    },
    has_sound: {
        type: DataTypes.INTEGER, allowNull: true,
    },
    has_gas: {
        type: DataTypes.INTEGER, allowNull: true,
    },
    has_oil: {
        type: DataTypes.INTEGER, allowNull: true,
    },
    has_rain: {
        type: DataTypes.INTEGER, allowNull: true,
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

Measurement.asociate = function () {
    const places = sequelize.model('places');
    this.belongsTo(places, { foreignKey: 'placeId' });
}

export default Measurement;  