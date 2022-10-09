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
    console.log('Se hacen las asociaciones de la persona');
}

export default Person;  