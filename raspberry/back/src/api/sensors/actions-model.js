import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Action = sequelize.define('actions', {
    date_time: {
        type: Sequelize.DATE,
        primaryKey: true
    },
    binary_values: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false
});


export default Action;  