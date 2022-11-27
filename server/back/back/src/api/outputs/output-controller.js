import { OutputService } from './output-service';
import { OutputRepository } from './output-repository';
import Output from './output-model';
import { Router } from 'express';
const RouterPlace = Router();
let { BaseController } = require("../base/base-controller");

class OutputController extends BaseController {
    constructor(service, options = {}) {
        super(service, options);

        this.router = RouterPlace;
        this.router.get('/:id_output', this.getOneEntity.bind(this));
        this.router.get('', this.get.bind(this));
        this.router.patch('/:id_output', this.update.bind(this));
        this.router.delete('/:id_output', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
    }


}

export default new OutputController(new OutputService(new OutputRepository(Output)));