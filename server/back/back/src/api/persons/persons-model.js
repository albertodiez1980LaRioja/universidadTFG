import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Person = sequelize.define('persons', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    dni: { type: Sequelize.STRING, },
    name: { type: Sequelize.STRING, allowNull: false, },
    user_name: { type: Sequelize.STRING, allowNull: false, unique: true },
    pass: { type: Sequelize.STRING, allowNull: false, },
    telephone: { type: Sequelize.STRING, allowNull: false, },
    celular: { type: Sequelize.STRING, allowNull: false, },
    address: { type: Sequelize.STRING, allowNull: false, },
    email: { type: Sequelize.STRING, allowNull: false, },
    roles: { type: Sequelize.INTEGER, allowNull: false }
}, {
    timestamps: false
});

Person.asociate = function () {
    const alarms = sequelize.model('alarms');
    console.log('Se hacen las asociaciones de la persona');
    this.hasMany(alarms, {
        foreignKey: 'operatorId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    });

    const places = sequelize.model('places');
    this.belongsToMany(places, { through: 'o_p' });

    const action = sequelize.model('actions');
    this.hasMany(action, {
        foreignKey: 'personId'
    });
}

export default Person;  