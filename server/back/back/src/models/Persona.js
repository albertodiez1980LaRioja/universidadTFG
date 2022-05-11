import { Sequelize} from "sequelize";
import { sequelize } from "../database/database"; // importamos la cadena de conexion

//import Estudiante from './Estudiante'

const Persona = sequelize.define('persona',{
    id:{
        type: Sequelize.UUIDV4,
        primaryKey:true,
        defaultValue: Sequelize.UUIDV4,
        autoIncrement: true
    },  
    active:{
        type: Sequelize.TEXT
    },  
    city: {
        type: Sequelize.TEXT
    },
    company_email:  {
        type: Sequelize.TEXT
    },
    created_date:  {
        type: Sequelize.TEXT
    },
    imagen_url:  {
        type: Sequelize.TEXT
    },
    name:  {
        type: Sequelize.TEXT
    },
    password:  {
        type: Sequelize.TEXT
    },
    personal_email:  {
        type: Sequelize.TEXT
    },
    surname:  {
        type: Sequelize.TEXT
    },
    termination_date:  {
        type: Sequelize.DATE
    },
    usere: {
        type: Sequelize.TEXT
    },
    
},{
    timestamps:false
}) 

//Persona.hasOne(Estudiante,{foreingKey:'id_persona',sourceKey:'id'}); // uno a varios
//Estudiante.belongsTo(Persona,{foreingKey:'id_persona',sourceKey:'id'});

export default Persona;