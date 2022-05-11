import { Router } from 'express';
const router = Router();

import {createProject,getProjects,getOneProyect,deleteProyect,updateProyect} from '../controllers/proyect.controller';

router.post('',createProject); // el endpoint y el manejador
router.get('',getProjects); 
router.get('/:id',getOneProyect); 
router.delete('/:id',deleteProyect); 
router.put('/:id',updateProyect); 


export default router;
