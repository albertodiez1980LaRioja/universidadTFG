import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Place = sequelize.define('places', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    latitude: {
        type: Sequelize.DOUBLE,
    },
    longitude: {
        type: Sequelize.DOUBLE,
    },

    address: {
        type: Sequelize.TEXT, allowNull: false,
    }

}, {
    timestamps: false
});

Place.asociate = function () {
    const alarms = sequelize.model('alarms');
    this.hasMany(alarms, {
        foreignKey: 'placeId'
    });

    const measurements = sequelize.model('measurements');
    this.hasMany(measurements, {
        foreignKey: 'placeId'
    });

    const persons = sequelize.model('persons');
    this.belongsToMany(persons, { through: 'o_p' });

    const sensors = sequelize.model('sensors');
    this.belongsToMany(sensors, { through: 's_p' });


}

export default Place;  