import { SensorService } from './sensors-service';
import { SensorRepository } from './sensors-repository';
import Sensor from './sensors-model';
import { Router } from 'express';
const RouterPlace = Router();
let { BaseController } = require("../base/base-controller");

class SensorController extends BaseController {



    constructor(service, options = {}) {
        super(service, options);

        this.router = RouterPlace;
        this.router.get('/:id', this.getOneEntity.bind(this));
        this.router.get('', this.get.bind(this));
        this.router.patch('/:id', this.update.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
    }


}

export default new SensorController(new SensorService(new SensorRepository(Sensor)));