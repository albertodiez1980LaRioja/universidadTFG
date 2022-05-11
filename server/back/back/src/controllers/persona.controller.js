import Persona from "../models/Persona";

export async function getPersonas(req,res) {
    try{
        //app.disable('etag');
        //res.set({            'Content-Type': 'text/plain'          });
          //res.header('Content-Type', 'text/plain')
        const personas = await Persona.findAll();
        for(let i=0;i<personas.length;i++){
            personas[i].dataValues.user=personas[i].dataValues.usere;
            delete personas[i].dataValues.usere;
            //personas[i].imagen_url='';
        }
        res.json(personas);
        //res.send(JSON.stringify(personas));
        //res.status(200).json(personas);
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function getOnePersona(req,res){
    const {id}=req.params;
    console.log(id);
    try{
        const filas = await Persona.findOne({
            where:{id}
        });
        res.json(filas);
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function updatePersona(req,res){
    const {id}=req.params;
    //const {active,city,company_email,created_date,imagen_url,name,password,personal_email,surname,termination_date,usere}=req.body;
    //for(let campo in req.body)        console.log(campo+' '+req.body[campo]);
    const filas = await Persona.findAll({
        //attributes:['id','active','city','company_email','created_date','imagen_url','name','password','personal_email','surname','termination_date','usere'],
        attributes:req.body,
        where:{id}
    });
    try{
        if(filas.length>0){
            filas.forEach(async row=>{
                await row.update(
                    //{ activea,city,company_email,created_date,imagen_url,name,password,personal_email,surname,termination_date,usere }
                    req.body
                );
            });
        }
        res.json({
            message:'Update sucessaaa',data:filas
        });
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err});
    }
}

export async function deletePersona(req,res){
    const {id}=req.params;
    try{
        const deletedRowCount = await Persona.destroy({
            where:{id}
        });
        res.json({message:'Deleted sucessfully',deletedRowCount:deletedRowCount});
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function createPersona(req,res){
    const {active,city,company_email,created_date,imagen_url,name,password,personal_email,surname,termination_date,usere}=req.body;
    try{
        let newProyect = await Persona.create({
            active,city,company_email,created_date,imagen_url,name,password,personal_email,surname,termination_date,usere
        },{
            fields:['id','active','city','company_email','created_date','imagen_url','name','password','personal_email','surname','termination_date','usere']
        })
        //console.log(newProyect);
        if(newProyect){
            res.json({
                message:'Proyect created succefully',
                data:newProyect
            });
        }
    }catch(err){
        res.status(500).json({error:'Something goes wrong: '+err,
        data:{}});
    }
    
} 