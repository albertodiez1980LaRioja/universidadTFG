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
        this.router.get('/multiple', this.multipleGet.bind(this));
        this.router.patch('/:latitude,:longitude,:date_time', this.update.bind(this));
        this.router.delete('/:latitude,:longitude,:date_time', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
        this.router.post('/multiple', this.multiple.bind(this));
    }

    multipleGet = async function (req, res) {
        const data = await this.service.getMultiple();
        res.status(500).json({
            message: 'OK ',
            data: data
        });
    }

    multiple = async function (req, res) {
        //console.log("Se ejecuta el multiple", req.body.mesaurements[0]);
        if (this.service.createMultiple(req, res)) {
            console.log("created multiple", req.body.mesaurements.length);
            res.json({
                message: 'Created succefully',
                //data: newRow
            });
        }
        else
            res.status(500).json({
                message: 'Something goes wrong: ',
                data: {}
            });
    }


}

export default new MeasurementController(new MeasurementService(new MeasurementRepository(Measurement)));