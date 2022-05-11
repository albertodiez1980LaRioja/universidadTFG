import { Sequelize} from "sequelize";
import { sequelize } from "../database/database"; // importamos la cadena de conexion


const Asignatura = sequelize.define('asignatura',{
    id:{
        type: Sequelize.UUIDV4,
        primaryKey:true,
        defaultValue: Sequelize.UUIDV4,
        autoIncrement: true
    },
    name:{
        type: Sequelize.TEXT
    }

},{
    timestamps:false
});


export default Asignatura;  