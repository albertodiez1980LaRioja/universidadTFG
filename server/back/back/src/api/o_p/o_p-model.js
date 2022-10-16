import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const O_P = sequelize.define('o_p', {
    /*latitude: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    longitude: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    dni: {
        type: Sequelize.STRING,
        primaryKey: true
    }
    */
}, {
    timestamps: false
});


export default O_P;  