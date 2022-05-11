import Proyect from "../models/Project";

export async function getProjects(req,res) {
    try{
        const projects = await Proyect.findAll();
        res.json({data:projects});
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function getOneProyect(req,res){
    const {id}=req.params;
    try{
        const project = await Proyect.findOne({
            where:{id}
        });
        res.json(project);
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function updateProyect(req,res){
    const {id}=req.params;
    const {name,priority,description,deliverydate}=req.body;
    const proyects = await Proyect.findAll({
        attributes:['id','name','priority','description','deliverydate'],
        where:{id}
    });
    try{
        if(proyects.length>0){
            proyects.forEach(async project=>{
                await project.update({
                    name,priority,description,deliverydate
                });
            });
        }
        res.json({
            message:'Project update sucess',data:proyects
        });
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err});
    }
}

export async function deleteProyect(req,res){
    const {id}=req.params;
    try{
        const deletedRowCount = await Proyect.destroy({
            where:{id}
        });
        res.json({message:'Deleted sucessfully',deletedRowCount:deletedRowCount});
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function createProject(req,res){
    const {name,priority,description,deliverydate}=req.body;
    try{
        let newProyect = await Proyect.create({
            name,
            priority,
            description,
            deliverydate
        },{
            fields:['name','priority','description','deliverydate']
        })
        //console.log(newProyect);
        if(newProyect){
            res.json({
                message:'Proyect created succefully',
                data:newProyect
            });
        }
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
    
} 