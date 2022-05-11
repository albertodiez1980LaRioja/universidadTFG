import { Router } from 'express';
const router = Router();

import {createEntity,getEntitys,getOneEntity,deleteEntity,updateEntity} from '../controllers/estudiante_asignatura.controller';


router.get('',getEntitys); 
router.post('',createEntity); // el endpoint y el manejador
router.get('/:id',getOneEntity); 
router.delete('/:id',deleteEntity); 
router.put('/:id',updateEntity); 
router.patch('/:id',updateEntity); 

export default router;