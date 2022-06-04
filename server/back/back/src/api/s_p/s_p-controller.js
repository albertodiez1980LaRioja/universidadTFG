import { S_pService } from './s_p-service';
import { S_pRepository } from './s_p-repository';
import s_p from './s_p-model';
import { Router } from 'express';
const RouterPlace = Router();
let { BaseController } = require("../base/base-controller");

class S_pController extends BaseController {



    constructor(service, options = {}) {
        super(service, options);

        this.router = RouterPlace;
        this.router.get('/:id_sensor', this.getOneEntity.bind(this));
        this.router.get('', this.get.bind(this));
        this.router.patch('/:id_sensor', this.update.bind(this));
        this.router.delete('/:id_sensor', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
    }


}

export default new S_pController(new S_pService(new S_pRepository(s_p)));