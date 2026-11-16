import { ActionService } from './action-service';
import { ActionRepository } from './action-repository';
import Action from './action-model';
import { Router } from 'express';
const RouterPlace = Router();
let { BaseController } = require("../base/base-controller");
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');

class ActionController extends BaseController {

    constructor(service, options = {}) {
        super(service, options);
        this.router = RouterPlace;
        this.router.get('/:id_action', this.getOneEntity.bind(this));
        this.router.get('/place/place', this.getByPlace.bind(this));
        this.router.get('', this.get.bind(this));
        this.router.patch('/:id_action', this.update.bind(this));
        this.router.delete('/:id_action', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
    }

    getByPlace = async function (req, res, next) {
        let token = req.body.token || req.query.token || req.headers["x-access-token"];
        try {
            const decoded = jwt.verify(token, config.secret);
            let isPlace = false;
            if (decoded) {
                if (decoded.place) {
                    req.params.id_place = decoded.place.id;
                    isPlace = true;
                }
                else {
                    req.params.id_place = req.query.id_place;
                }
                if (req.params.id_place == undefined) {
                    req.params.id_place = 1;
                }
                const idPlace = req.params.id_place;
                const validIdPlace = (typeof idPlace === 'number' && Number.isSafeInteger(idPlace))
                    || (typeof idPlace === 'string' && /^\d+$/.test(idPlace)
                        && Number.isSafeInteger(Number(idPlace)));
                if (!validIdPlace || Number(idPlace) <= 0) {
                    return res.status(400).json({ message: 'id_place must be a positive integer' });
                }
                req.params.id_place = Number(idPlace);
                let ret = await this.service.getByPlace(req, res, isPlace);
                res.json({ data: ret });
            }
            else {
                return res.status(401).send('Invalid token !is place');
            }
        } catch (err) {
            console.log('error', err);
            return res.status(500).send('Invalid token');
        }
    }




}

export default new ActionController(new ActionService(new ActionRepository(Action)));