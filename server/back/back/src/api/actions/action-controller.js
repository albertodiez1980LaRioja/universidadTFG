import { ActionService } from './action-service';
import { ActionRepository } from './action-repository';
import Action from './action-model';
import { Router } from 'express';
const RouterPlace = Router();
let { BaseController } = require("../base/base-controller");

class ActionController extends BaseController {

    constructor(service, options = {}) {
        super(service, options);
        this.router = RouterPlace;
        this.router.get('/:id_action', this.getOneEntity.bind(this));
        this.router.get('/place/:id_place', this.getByPlace.bind(this));
        this.router.get('', this.get.bind(this));
        this.router.patch('/:id_action', this.update.bind(this));
        this.router.delete('/:id_action', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
    }

    getByPlace = async function (req, res, next) {
        let ret = await this.service.getByPlace(req, res, next);
        res.json({ data: ret });
    }




}

export default new ActionController(new ActionService(new ActionRepository(Action)));