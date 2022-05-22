import { PlaceService } from './places-service';
import { PlaceRepository } from './places-repository';
import Place from './places-model';
import Owner from '../owners/owners-model';
import { Router } from 'express';
const RouterPlace = Router();
let { BaseController } = require("../base/base-controller");

class PlaceController extends BaseController {



    constructor(service, options = {}) {
        super(service, options);

        this.routerPlace = RouterPlace;
        this.routerPlace.get('/:latitude,:longitude', this.getOneEntity.bind(this));
        this.routerPlace.get('', this.get.bind(this));
        this.routerPlace.patch('/:latitude,:longitude', this.update.bind(this));
        this.routerPlace.delete('/:latitude,:longitude', this.delete.bind(this));
        this.routerPlace.post('', this.create.bind(this));
    }


}

export default new PlaceController(new PlaceService(new PlaceRepository(Place)));