import Entity from "../models/Estudiante_asignatura";


var campos={asignatura:'',coments:'',finish_date:'',initial_date:''};
var camposText=['brank','coments','finish_date','initial_date'];

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
    const {id}=req.params;
    const id_asignatura=id;
    console.log(id_asignatura,req.params,id);
    try{
        const filas = await Entity.findOne({
            where:{id_asignatura}
        });
        res.json(filas);
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function updateEntity(req,res){
    const {id}=req.params;
    const id_asignatura=id;
    campos = req.body;
    const filas = await Entity.findAll({
        //attributes:camposText,
        attributes:req.params,
        where:{id_asignatura}
    });
    try{
        if(filas.length>0){
            filas.forEach(async row=>{
                await row.update(campos);
            });
        }
        res.json({
            message:'Update sucess',data:filas
        });
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err});
    }
}

export async function deleteEntity(req,res){
    const {id}=req.params;
    const id_asignatura=id;
    try{
        const deletedRowCount = await Entity.destroy({
            where:{id_asignatura}
        });
        res.json({message:'Deleted sucessfully',deletedRowCount:deletedRowCount});
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function createEntity(req,res){
    campos = req.body;
    try{
        let newRow = await Entity.create(campos,{
            fields:campos['id_asignatura']
        })
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