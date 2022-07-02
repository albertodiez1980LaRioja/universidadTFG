import { Sequelize} from "sequelize";
import { sequelize } from "../database/database"; // importamos la cadena de conexion
import Estudiante from "./Estudiante"; 
import Asignatura from "./Asignatura"; 

const Estudiante_asignatura_n_n = sequelize.define('estudiante_asignatura_n_n',{
    id_asignatura:{
        type: Sequelize.UUIDV4,  // este se ha quedado en integer
        primaryKey:true,
    },  
    id_estudiante:{
        type: Sequelize.UUIDV4,  // este se ha quedado en integer
        primaryKey:true,
    },  
    
},{
    timestamps:false
}) 

Estudiante_asignatura_n_n.removeAttribute('id');
 

// habra que probar si basta con esto
Estudiante.belongsToMany(Asignatura,{through:Estudiante_asignatura_n_n,foreignKey:'id_estudiante',sourceKey:'id',onUpdate:'CASCADE'});
Asignatura.belongsToMany(Estudiante,{through:Estudiante_asignatura_n_n,foreignKey:'id_asignatura',sourceKey:'id',onUpdate:'CASCADE'});


export default Estudiante_asignatura_n_n;

/*
CREATE TABLE IF NOT EXISTS public.estudiante_asignatura_n_n
(
    id_asignatura character varying(255) COLLATE pg_catalog."default",
    id_estudiante character varying(255) COLLATE pg_catalog."default",
	primary key(id_asignatura,id_estudiante),
	foreign key (id_asignatura) references asignatura(id),
	foreign key (id_estudiante) references estudiante(id)
)

*/ 