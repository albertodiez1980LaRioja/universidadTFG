import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Operator = sequelize.define('operators', {
    dni: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false, },
    telephone: { type: Sequelize.STRING, allowNull: false, },
    celular: { type: Sequelize.STRING, allowNull: false, },
    address: { type: Sequelize.STRING, allowNull: false, },
    email: { type: Sequelize.STRING, allowNull: false, },
}, {
    timestamps: false
});

export default Operator;  