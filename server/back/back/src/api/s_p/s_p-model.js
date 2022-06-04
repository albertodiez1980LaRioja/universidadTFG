import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const S_P = sequelize.define('s_p', {
    latitude: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    longitude: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    id_sensor: {
        type: Sequelize.INTEGER,
        primaryKey: true
    }

}, {
    timestamps: false
});


export default S_P;  