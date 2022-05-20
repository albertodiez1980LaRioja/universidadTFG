import express, { json } from 'express';
import morgan from 'morgan';

// Importing routes
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import personasRoutes from './routes/personas';
import estudiantesRoutes from './routes/estudiantes';
import profesoresRoutes from './routes/profesor';
import estudiantes_asignaturasRoutes from './routes/estudiantes_asignaturas';
import estudiantes_asignaturasRoutes_n_n from './routes/estudiante_asignatura_n_n';
import asignaturasRoutes from './routes/asignatura';
import placesRoutes from './api/places/routes'

import { PlaceController } from './api/places/places-controller';
import RouterPlace from './api/places/places-controller';
import { PlaceService } from './api/places/places-service';
import { PlaceRepository } from './api/places/places-repository';
import { Place } from './api/places/places-model';

//express.json({type:"application/json"});
// initialization
var app = express();



app.disable('etag');

// middlewares 

app.use(morgan('dev')); // dev de desarrollo, imprime las llamadas
app.use(json()); // archivos en formato json

// es para que no salga fallo de CORS, si no se pone esto entonces desde el navegador no se lee el JSON
const cors = require('cors');
app.use(cors());

//app.use(bodyParser.json());                                     // parse application/json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


// routes
//console.log(RouterPlace);

//app.use('/api/proyects', projectRoutes.RouterPlace);
/*
app.use('/api/tasks',taskRoutes);
app.use('/api/personas',personasRoutes);
app.use('/api/estudiantes',estudiantesRoutes);
app.use('/api/profesores',profesoresRoutes);
app.use('/api/estudiantes_asignaturas',estudiantes_asignaturasRoutes);
app.use('/api/estudiantes_asignaturas_n_n',estudiantes_asignaturasRoutes_n_n);
app.use('/api/asignaturas',asignaturasRoutes);
*/
//app.use('/api/places', PlacesRoutes);
//let placeController = PlaceController(PlaceService(PlaceRepository(Place))).get;

// console.log(PlaceController);
//console.log(projectRoutes);
app.use('/api/places', RouterPlace.routerPlace);

export default app;  