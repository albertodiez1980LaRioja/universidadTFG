import { Sequelize} from "sequelize";
import { sequelize } from "../database/database"; // importamos la cadena de conexion

import Task from './Tasks'

const Proyect = sequelize.define('projects',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true
    },  
    name:{
        type: Sequelize.TEXT
    },  
    priority: {
        type: Sequelize.INTEGER
    },
    description:  {
        type: Sequelize.TEXT
    },
    deliverydate: {
        type: Sequelize.DATE
    },
    
},{
    timestamps:false
})

Proyect.hasMany(Task,{foreingKey:'projectId',sourceKey:'id'}); // uno a varios
Task.belongsTo(Proyect,{foreingKey:'projectId',sourceKey:'id'});

export default Proyect;
