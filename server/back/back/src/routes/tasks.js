import { Router } from 'express';
const router = Router();

import {createTask,getTasks,getOneTask,deleteTask,updateTask,getTaskByProject} from '../controllers/task.controller';

router.post('',createTask); // el endpoint y el manejador
router.get('',getTasks); 
router.get('/:id',getOneTask); 
router.get('/project/:projectId',getTaskByProject); 
router.delete('/:id',deleteTask); 
router.put('/:id',updateTask); 

export default router;
