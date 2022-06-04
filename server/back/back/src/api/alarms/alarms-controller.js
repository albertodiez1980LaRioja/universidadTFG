import { AlarmsService } from './alarms-service';
import { AlarmsRepository } from './alarms-repository';
import Alarm from './alarms-model';
import { Router } from 'express';
const RouterPlace = Router();
let { BaseController } = require("../base/base-controller");

class AlarmsController extends BaseController {
    constructor(service, options = {}) {
        super(service, options);

        this.router = RouterPlace;
        this.router.get('/:latitude,:longitude,:date_time,:id_sensor', this.getOneEntity.bind(this));
        this.router.get('', this.get.bind(this));
        this.router.patch('/:latitude,:longitude,:date_time,:id_sensor', this.update.bind(this));
        this.router.delete('/:latitude,:longitude,:date_time,:id_sensor', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
    }


}

export default new AlarmsController(new AlarmsService(new AlarmsRepository(Alarm)));