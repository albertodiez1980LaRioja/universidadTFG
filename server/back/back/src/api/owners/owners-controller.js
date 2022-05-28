import { OwnerService } from './owners-service';
import { OwnerRepository } from './owners-repository';
import Owner from './owners-model';
import { Router } from 'express';
const RouterPlace = Router();

let { BaseController } = require("../base/base-controller");

class OwnerController extends BaseController {
    constructor(service, options = {}) {
        super(service, options);

        this.routerPlace = RouterPlace;
        this.routerPlace.get('/:dni', this.getOneEntity.bind(this));
        this.routerPlace.get('', this.get.bind(this));

        this.routerPlace.patch('/:dni', this.update.bind(this));
        this.routerPlace.delete('/:dni', this.delete.bind(this));
        this.routerPlace.post('', this.create.bind(this));
    }
}

export default new OwnerController(new OwnerService(new OwnerRepository(Owner)));