import { OperatorService } from './operators-service';
import { OperatorRepository } from './operators-repository';
import Operator from './operators-model';
import { Router } from 'express';
const RouterPlace = Router();

let { BaseController } = require("../base/base-controller");

class OperatorController extends BaseController {
    constructor(service, options = {}) {
        super(service, options);

        this.router = RouterPlace;
        this.router.get('/:dni', this.getOneEntity.bind(this));
        this.router.get('', this.get.bind(this));

        this.router.patch('/:dni', this.update.bind(this));
        this.router.delete('/:dni', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
    }
}

export default new OperatorController(new OperatorService(new OperatorRepository(Operator)));