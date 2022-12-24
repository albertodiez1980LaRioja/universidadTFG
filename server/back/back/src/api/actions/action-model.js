import { Sequelize } from "sequelize";
import { sequelize } from "../../database/database"; // importamos la cadena de conexion


const Action = sequelize.define('actions', {
    date: {
        type: Sequelize.DATE,
        primaryKey: true,
    },
    placeId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    personId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    outputId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    sended: {
        type: Sequelize.BOOLEAN
    },

    value: {
        type: Sequelize.BOOLEAN
    }

}, {
    timestamps: false
});

Action.asociate = function () {
    const places = sequelize.model('places');
    this.belongsTo(places);

    const output = sequelize.model('outputs');
    this.belongsTo(output, {
        foreignKey: 'outputId'
    });

    const person = sequelize.model('persons');
    this.belongsTo(person);
}

export default Action;  