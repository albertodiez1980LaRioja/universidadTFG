import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const RangeAlarmModel = sequelize.define('range_alarm', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    idSensor: { type: Sequelize.INTEGER, allowNull: true },
    idS_P: { type: Sequelize.INTEGER, allowNull: true },
    name: { type: Sequelize.TEXT, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false },
    range_low: { type: Sequelize.INTEGER, allowNull: false },
    range_high: { type: Sequelize.INTEGER, allowNull: false }

}, {
    timestamps: false
});

RangeAlarmModel.asociate = function () {
    const sensors = sequelize.model('sensors');
    this.belongsTo(sensors, {
        foreignKey: 'idSensor'
    });

    const places = sequelize.model('places');
    this.belongsTo(places, { foreignKey: 'idSensor' });
}


export default RangeAlarmModel;  