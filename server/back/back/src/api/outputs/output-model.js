import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Output = sequelize.define('outputs', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    name: {
        type: Sequelize.TEXT,
    },
}, {
    timestamps: false
});

Output.asociate = function () {
    const action = sequelize.model('actions');
    this.hasMany(action, {
        foreignKey: 'outputId'
    });
}


export default Output;  