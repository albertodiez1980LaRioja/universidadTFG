import Proyect from "../models/Project";
import Task from "../models/Tasks";

const {Pool} = require('pg');
const pool = new Pool({
    host:'localhost',
    user:'postgres',
    password:'password',
    database:'node1',
    port:'5432'
})

export async function getTasks(req,res) {
    try{
        const tasks = await (await pool.query('select * from tasks')).rows;
        res.json({data:tasks});
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
} 

/*
export async function getTasks(req,res) {
    try{
        const tasks = await Task.findAll();
        res.json({data:tasks});
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
} */

export async function getOneTask(req,res){
    const {id}=req.params;
    try{
        const task = await Task.findOne({
            where:{id}
        });
        res.json(task);
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function updateTask(req,res){
    const {id}=req.params;
    const {name,done,projectId}=req.body;
    const tasks = await Task.findAll({
        attributes:['id','name','done','projectId'],
        where:{id}
    });
    try{
        if(tasks.length>0){
            tasks.forEach(async task=>{
                await task.update({
                    name,done,projectId
                });
            });
        }
        res.json({
            message:'Task update sucess',data:tasks
        });
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err});
    }
}

export async function deleteTask(req,res){
    const {id}=req.params;
    try{
        const deletedRowCount = await Task.destroy({
            where:{id}
        });
        res.json({message:'Deleted sucessfully',deletedRowCount:deletedRowCount});
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}

export async function createTask(req,res){
    const {name,done,projectId}=req.body;
    try{
        let newTask = await Task.create({
            name,done,projectId
        },{
            fields:['name','done','projectId']
        })
        //console.log(newProyect);
        if(newTask){
            res.json({
                message:'Task created succefully',
                data:newTask
            });
        }
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
} 

export async function getTaskByProject(req,res){
    const {projectId}=req.params;
    try{
        const task = await Task.findAll({
            where:{projectId}
        });
        res.json(task);
    }catch(err){
        res.status(500).json({message:'Something goes wrong: '+err,
        data:{}});
    }
}
