import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Sensor = sequelize.define('sensors', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    range_low: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    range_hight: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },


}, {
    timestamps: false
});

Sensor.asociate = function () {
    const places = sequelize.model('places');
    //this.belongsToMany(places, { through: 's_p' });

    const alarms = sequelize.model('alarms');
    this.hasMany(alarms, { foreignKey: 'sensorId' });

    const rangeAlarms = sequelize.model('range_alarm');
    this.hasMany(rangeAlarms, { foreignKey: 'idSensor' });
}

export default Sensor;  