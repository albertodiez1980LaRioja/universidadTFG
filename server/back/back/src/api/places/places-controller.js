import { PlaceService } from './places-service';
import { PlaceRepository } from './places-repository';
import Place from './places-model';
import { Router } from 'express';
const RouterPlace = Router();
let { BaseController } = require("../base/base-controller");

class PlaceController extends BaseController {
    constructor(service, options = {}) {
        super(service, options);

        this.router = RouterPlace;
        this.router.get('/:latitude,:longitude', this.getOneEntity.bind(this));
        this.router.get('', this.get.bind(this));
        this.router.patch('/:latitude,:longitude', this.update.bind(this));
        this.router.delete('/:latitude,:longitude', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
    }


}

export default new PlaceController(new PlaceService(new PlaceRepository(Place)));