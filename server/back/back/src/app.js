import express, { json } from 'express';
import morgan from 'morgan';

import RouterOwner from './api/owners/owners-controller';
import RouterPlace from './api/places/places-controller';
import RouterO_P from './api/o_p/o_p-controller';
import RouterMeasurement from './api/measurements/measurements-controller';


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
app.use('/api/places', RouterPlace.router);
app.use('/api/owners', RouterOwner.router);
app.use('/api/o_p', RouterO_P.router);
app.use('/api/measurements', RouterMeasurement.router);

export default app;  