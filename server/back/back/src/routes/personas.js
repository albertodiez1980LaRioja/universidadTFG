import { Router } from 'express';
const router = Router();

import {createPersona,getPersonas,getOnePersona,deletePersona,updatePersona} from '../controllers/persona.controller';

router.post('',createPersona); // el endpoint y el manejador
router.get('',getPersonas); 
router.get('/:id',getOnePersona); 
router.delete('/:id',deletePersona); 
router.put('/:id',updatePersona); 
router.patch('/:id',updatePersona); 

export default router;