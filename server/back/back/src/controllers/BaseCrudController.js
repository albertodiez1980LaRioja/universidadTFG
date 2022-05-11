class BaseCrudController{
    async getEntitys(req,res) {
        let Entity;
       /* constructor(entidad){
            Entity = entidad;
        }
        */
        try{
            const rows = await Entity.findAll();
            res.status(200).json({data:rows});
        }catch(err){
            res.status(500).json({message:'Something goes wrong: '+err,
            data:{}});
        }
    }


}