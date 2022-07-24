import express, { json } from 'express';
import morgan from 'morgan';

import RouterPerson from './api/persons/persons-controller';
import RouterPlace from './api/places/places-controller';
import RouterO_P from './api/o_p/o_p-controller';
import RouterS_P from './api/s_p/s_p-controller';
import RouterMeasurement from './api/measurements/measurements-controller';
import RouterSensor from './api/sensors/sensors-controller';
import RouterAlarm from './api/alarms/alarms-controller';
const jwt = require('../middlewares/jwt.middleware');
import { sequelize } from "./database/database";


// initialization
var app = express();

sequelize.authenticate().then(() => sequelize);

app.disable('etag');

// middlewares 

app.use(morgan('dev')); // dev de desarrollo, imprime las llamadas
app.use(json()); // archivos en formato json

// es para que no salga fallo de CORS, si no se pone esto entonces desde el navegador no se lee el JSON
const cors = require('cors');
app.use(cors());

//app.use(bodyParser.json());                                     // parse application/json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

var requestTime = function (req, res, next) {
    try {
        console.log(`[REQ] ${req.method} ${req.originalUrl}`);
        next();
    } catch (err) {
        next(err);
    }
}


app.use(requestTime);
app.use(jwt);

// routes
app.use('/api/places', RouterPlace.router);
app.use('/api/persons', RouterPerson.router);
app.use('/api/o_p', RouterO_P.router);
app.use('/api/s_p', RouterS_P.router);
app.use('/api/measurements', RouterMeasurement.router);
app.use('/api/sensors', RouterSensor.router);
app.use('/api/alarms', RouterAlarm.router);

export default app;  