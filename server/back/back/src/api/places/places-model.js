import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Place = sequelize.define('places', {
    latitude: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    longitude: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },

    address: {
        type: Sequelize.TEXT
    }

}, {
    timestamps: false
});

//console.log('p', Place);
export default Place;  