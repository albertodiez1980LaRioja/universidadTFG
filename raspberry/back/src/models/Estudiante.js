import { Sequelize} from "sequelize";
import { sequelize } from "../database/database"; // importamos la cadena de conexion
import Persona from "./Persona";
import Profesor from "./Profesor";
    
const Estudiante = sequelize.define('estudiante',{
    id: {
        type: Sequelize.UUIDV4,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        autoIncrement: true
    },
    branch: {
        type: Sequelize.TEXT
    },
    comments: {
        type: Sequelize.TEXT
    },
    num_hours_week: {
        type: Sequelize.INTEGER
    },
    id_persona: {
        type: Sequelize.UUIDV4,
        /*references: {
            model: 'persona',
            key: 'id',
        },*/
    },
    id_profesor: {
        type: Sequelize.UUIDV4
    },

}, {
    timestamps: false
})

Persona.hasOne(Estudiante,{foreignKey:'id_persona',sourceKey:'id'});
Estudiante.belongsTo(Persona,{foreignKey:'id_persona',sourceKey:'id'});

Profesor.hasOne(Estudiante,{foreignKey:'id_profesor',sourceKey:'id'});
Estudiante.belongsTo(Profesor,{foreignKey:'id_profesor',sourceKey:'id'});


export default Estudiante;
