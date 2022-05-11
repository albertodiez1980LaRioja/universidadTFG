import { Router } from 'express';
const router = Router();

import {createEntity,getEntitys,getOneEntity,deleteEntity,updateEntity} from '../controllers/estudiante_asignatura_n_n.controller';


router.get('',getEntitys); 
router.post('',createEntity); // el endpoint y el manejador
router.get('/:id/:id_asignatura',getOneEntity); 
router.delete('/:id/:id_asignatura',deleteEntity); 
router.put('/:id/:id_asignatura',updateEntity); 
router.patch('/:id/:id_asignatura',updateEntity); 

export default router;