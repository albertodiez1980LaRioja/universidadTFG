import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Alarm = sequelize.define('alarms', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    date_time: {
        type: DataTypes.DATE,
        //primaryKey: true,
    },
    sensorId: {
        type: Sequelize.INTEGER, allowNull: true
        //primaryKey: true,
    },
    operatorId: {
        type: Sequelize.INTEGER, allowNull: true
    },
    date_finish: {
        type: DataTypes.DATE, allowNull: true,
    },
}, {
    timestamps: false
});

Alarm.asociate = function () {
    const persons = sequelize.model('persons');
    console.log('Se hacen las asociaciones de la alarma a la persona');
    this.belongsTo(persons, {
        foreignKey: 'operatorId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'

    });

    const place = sequelize.model('places');
    this.belongsTo(place, {
        foreignKey: 'placeId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    });

    const sensors = sequelize.model('sensors');
    this.belongsTo(sensors, {
        foreignKey: 'sensorId'
    });

}

export default Alarm;  