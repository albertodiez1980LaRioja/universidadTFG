import Entity from "../models/Asignatura";


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
    const {id}=req.params;
    try{
        const filas = await Entity.findOne({
            where:{id}
        });
        res.json(filas);
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function updateEntity(req,res){
    const {id}=req.params;
    let campos = req.body;
    const filas = await Entity.findAll({
        //attributes:camposText,
        attributes:req.params,
        where:{id}
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
    try{
        const deletedRowCount = await Entity.destroy({
            where:{id}
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