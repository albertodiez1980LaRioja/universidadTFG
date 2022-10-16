import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const O_P = sequelize.define('o_p', {
    priority: {
        type: Sequelize.INTEGER,
    },
}, {
    timestamps: false
});


export default O_P;  