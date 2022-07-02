import { Sequelize} from "sequelize";
import { sequelize } from "../database/database"; // importamos la cadena de conexion
import Persona from "./Persona";


const Profesor = sequelize.define('profesor',{
    id:{
        type: Sequelize.UUIDV4,
        primaryKey:true,
        defaultValue: Sequelize.UUIDV4,
        autoIncrement: true
    },  
    branch:{
        type: Sequelize.TEXT
    },  
    coments: {
        type: Sequelize.TEXT
    },
    id_persona: {
        type: Sequelize.UUIDV4,
        /*references: {
            model: 'persona',
            key: 'id',
        },*/
    },
    
},{
    timestamps:false
})

Persona.hasOne(Profesor,{foreignKey:'id_persona',sourceKey:'id'});
Profesor.belongsTo(Persona,{foreignKey:'id_persona',sourceKey:'id'});

export default Profesor;