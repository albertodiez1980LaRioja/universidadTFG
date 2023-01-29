import express, { json } from 'express';
import morgan from 'morgan';

import RouterPerson from './api/persons/persons-controller';
import RouterPlace from './api/places/places-controller';
import RouterO_P from './api/o_p/o_p-controller';
import RouterS_P from './api/s_p/s_p-controller';
import RouterMeasurement from './api/measurements/measurements-controller';
import RouterSensor from './api/sensors/sensors-controller';
import SensorService from './api/sensors/sensors-model';
import OutputService from './api/outputs/output-model';
import RouterAlarm from './api/alarms/alarms-controller';
import RouterOutput from './api/outputs/output-controller';
import RouterAction from './api/actions/action-controller';
const jwt = require('../middlewares/jwt.middleware');
import { sequelize } from "./database/database";
import config from '../config/config';
let SimulatePlaces = require('./simulatePlaces');

// initialization
var app = express();


sequelize.authenticate().then(() => sequelize);

for (let table in sequelize.models) {
    const model = sequelize.model(table);
    if (model.asociate != undefined) {
        model.asociate();
    }
}
if (config.createDatabase != 'false') {
    // sync all tables
    sequelize.sync({ force: true }).then(() => {
        // add the sensors data
        console.log('add sensor data', SensorService);
        SensorService.create({
            name: 'HC-SR501', description: 'Detector de personas por infrarrojos',
            range_low: 0, range_hight: 1
        });
        SensorService.create({
            name: 'Sensor de vibración', description: "Sensor de vibración",
            range_low: 0, range_hight: 1
        });
        SensorService.create({
            name: 'Sensor de sonido', description: 'Sensor de sonido',
            range_low: 0, range_hight: 1
        });
        SensorService.create({
            name: 'Sensor de obstaculos', description: 'Detector de personas por infrarrojos',
            range_low: 0, range_hight: 1
        });
        SensorService.create({
            name: 'Sensor de gas MQ2', description: 'Detector de gas inflamable',
            range_low: 0, range_hight: 1
        });
        SensorService.create({
            name: 'Sensor de lluvia', description: 'Sensor de lluvia',
            range_low: 0, range_hight: 1
        });
        SensorService.create({
            name: 'Sensor de aceite', description: 'Sensor de aceite',
            range_low: 0, range_hight: 1
        });
        SensorService.create({
            name: 'DHT11', description: 'Detector de temperatura y humedad ambiente',
            range_low: 0, range_hight: 1
        });
        SensorService.create({
            name: 'Sensibilidad lumínica', description: 'Detector de sensibilidad lumínica',
            range_low: 0, range_hight: 1
        });
        SensorService.create({
            name: 'Sensor de incendios', description: 'Sensor de incencios',
            range_low: 0, range_hight: 1
        });

        OutputService.create({ name: 'Primero' });
        OutputService.create({ name: 'Segundo' });
        OutputService.create({ name: 'Tercero' });
        OutputService.create({ name: 'Cuarto' });

    }
    );
}
else
    sequelize.sync({ force: false }); // sync all tables

if (config.simulate_places) {
    console.log('Se van a simular lugares', SimulatePlaces);
    new SimulatePlaces().createInterval();
}

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
app.use('/api/outputs', RouterOutput.router);
app.use('/api/actions', RouterAction.router);

export default app;  