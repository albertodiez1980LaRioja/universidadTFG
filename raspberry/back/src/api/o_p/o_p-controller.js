import { O_pService } from './o_p-service';
import { O_pRepository } from './o_p-repository';
import o_p from './o_p-model';
import { Router } from 'express';
const RouterPlace = Router();
let { BaseController } = require("../base/base-controller");

class O_pController extends BaseController {



    constructor(service, options = {}) {
        super(service, options);

        this.router = RouterPlace;
        this.router.get('/:latitude,:longitude,:dni', this.getOneEntity.bind(this));
        this.router.get('', this.get.bind(this));
        this.router.patch('/:latitude,:longitude,:dni', this.update.bind(this));
        this.router.delete('/:latitude,:longitude,:dni', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
    }


}

export default new O_pController(new O_pService(new O_pRepository(o_p)));