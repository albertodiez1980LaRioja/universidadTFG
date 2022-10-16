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
        type: Sequelize.STRING,
        allowNull: true,
    },
    range_hight: {
        type: Sequelize.STRING,
        allowNull: true,
    },


}, {
    timestamps: false
});

Sensor.asociate = function () {
    const places = sequelize.model('places');
    this.belongsToMany(places, { through: 's_p' });

    const alarms = sequelize.model('alarms');
    this.hasMany(alarms, { foreignKey: 'sensorId' });
}

export default Sensor;  