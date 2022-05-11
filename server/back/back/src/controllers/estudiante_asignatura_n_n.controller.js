import Entity from "../models/Estudiante_asignatura_n_n";


///var campos={asignatura:'',coments:'',finish_date:'',initial_date:''};


export async function getEntitys(req,res) {
    try{
        const rows = await Entity.findAll();
        res.status(200).json({data:rows});
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}
 
export async function getOneEntity(req,res){
    const {id,id_asignatura}=req.params;
    const id_estudiante=id;
    console.log(id_asignatura+' '+id_estudiante);
    try{
        const filas = await Entity.findOne({
            where:{id_asignatura,id_estudiante}
        });
        res.json(filas);
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

const {Pool} = require('pg');
const pool = new Pool({
    host:'localhost',
    user:'postgres',
    password:'password',
    database:'uno',
    port:'5432'
})

export async function updateEntity(req,res) {
    const {id,id_asignatura}=req.params;
    const id_estudiante=id;
    let campos = req.body;
    try{
        const resultado = await (await pool.query("update estudiante_asignatura_n_n set id_asignatura=$1,id_estudiante=$2  where id_asignatura=$3 and id_estudiante=$4"
            ,[campos.id_asignatura,campos.id_estudiante,id_asignatura,id_estudiante]));
        const fila = await (await pool.query('select * from estudiante_asignatura_n_n where id_asignatura=$1 and id_estudiante=$2',[campos.id_asignatura,campos.id_estudiante])).rows;
        res.json({data:fila});
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}  




/*
    // por alguna razon este no funciona
export async function updateEntity(req,res){
    const {id,id_asignatura}=req.params;
    const id_estudiante=id;
    let campos = req.body;
    const filas = await Entity.findAll({
        //attributes:camposText,
        attributes:req.params,
        where:{id_asignatura,id_estudiante}
    });
    try{
        //console.log(campos);
        if(filas.length>0){ 
            filas.forEach(async row=>{
                await row.update(campos);
                //console.log(filas[0].dataValues==campos,filas[0].dataValues,campos)
            });
            res.json({
                message:'Update sucess',data:filas
            });
            
        }
        else
            res.json({message:'No se ha encontrado la fila '});
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err});
    }
}
*/
export async function deleteEntity(req,res){
    const {id,id_asignatura}=req.params;
    const id_estudiante=id;
    try{
        const deletedRowCount = await Entity.destroy({
            where:{id_asignatura,id_estudiante}
        });
        res.json({message:'Deleted sucessfully',deletedRowCount:deletedRowCount});
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function createEntity(req,res){
    let campos = req.body;
    try{
       // console.log([campos['id_asignatura'],campos['id_estudiante']]);
        let newRow = await Entity.create(campos);//,{ fields:[campos['id_asignatura'],campos['id_estudiante']]   });
        if(newRow){
            res.json({
                message:'Created succefully',
                data:newRow
            });
        }
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
} 