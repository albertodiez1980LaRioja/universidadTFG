import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Owner = sequelize.define('owners', {
    dni: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    name: { type: Sequelize.STRING },
    telephone: { type: Sequelize.STRING },
    celular: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
}, {
    timestamps: false
});

export default Owner;  