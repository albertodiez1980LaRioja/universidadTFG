import { MeasurementService } from './measurements-service';
import { MeasurementRepository } from './measurements-repository';
import Measurement from './measurements-model';
import { Router } from 'express';
const RouterPlace = Router();
let { BaseController } = require("../base/base-controller");

class MeasurementController extends BaseController {
    constructor(service, options = {}) {
        super(service, options);

        this.router = RouterPlace;
        this.router.get('/:latitude,:longitude,:date_time', this.getOneEntity.bind(this));
        this.router.get('', this.get.bind(this));
        this.router.patch('/:latitude,:longitude,:date_time', this.update.bind(this));
        this.router.delete('/:latitude,:longitude,:date_time', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
        this.router.post('/multiple', this.multiple.bind(this));
    }

    multiple = async function (req, res) {
        //console.log("Se ejecuta el multiple", req.body.mesaurements[0]);
        this.service.createMultiple(req, res);
        res.json({
            message: 'Created succefully',
            //data: newRow
        });
    }


}

export default new MeasurementController(new MeasurementService(new MeasurementRepository(Measurement)));