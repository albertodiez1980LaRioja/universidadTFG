import { Sequelize} from "sequelize";
import { sequelize } from "../database/database"; // importamos la cadena de conexion
import Estudiante from "./Estudiante"; 

const Estudiante_asignatura = sequelize.define('estudiante_asignatura',{
    id_asignatura:{
        type: Sequelize.INTEGER,  // este se ha quedado en integer
        primaryKey:true,
        //defaultValue: Sequelize.UUIDV4,
        autoIncrement: true
    },  
    asignatura:{
        type: Sequelize.TEXT
    },  
    coments: {
        type: Sequelize.TEXT
    },
    initial_date:  {
        type: Sequelize.DATE
    },
    finish_date:  {
        type: Sequelize.DATE
    },
    id_estudiante: { 
        type: Sequelize.UUIDV4,
        /*references: {
            model: Estudiante, //'estudiante',
            key: 'id',
        },*/
    },
    
},{
    timestamps:false
})

Estudiante.hasMany(Estudiante_asignatura,{
    foreignKey:'id_estudiante',sourceKey:'id'
});
Estudiante_asignatura.belongsTo(Estudiante,{
    foreignKey:'id_estudiante',sourceKey:'id'
});

export default Estudiante_asignatura;