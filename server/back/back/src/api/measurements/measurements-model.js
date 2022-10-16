import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Measurement = sequelize.define('measurements', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    date_time: {
        type: DataTypes.DATE,
        //primaryKey: true,
    },
    latitude: {
        type: Sequelize.INTEGER,
        //primaryKey: true,
    },
    longitude: {
        type: Sequelize.INTEGER,
        //primaryKey: true,
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

Measurement.asociate = function () {
    const alarms = sequelize.model('alarms');
    console.log('Se hacen las asociaciones de la medicion a la alarma');
    this.hasMany(alarms, {
        foreignKey: 'measurementId'
    });

    const places = sequelize.model('places');
    this.belongsTo(places, { foreignKey: 'placeId' });
}

export default Measurement;  