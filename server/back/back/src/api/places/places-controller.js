import { PlaceService } from './places-service';
import { PlaceRepository } from './places-repository';
import Place from './places-model';
import { Router } from 'express';
const RouterPlace = Router();
let { BaseController } = require("../base/base-controller");
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');

class PlaceController extends BaseController {
    constructor(service, options = {}) {
        super(service, options);

        this.router = RouterPlace;
        this.router.get('/:id', this.getOneEntity.bind(this));
        this.router.get('', this.get.bind(this));
        this.router.patch('/:id', this.update.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
        this.router.post('/authenticate', this.authenticate.bind(this));
        this.router.get('/actualization/actualization', this.sendActualization.bind(this));
    }

    authenticate = async function (req, res, next) {
        try {
            // Check credentials. If correct, user entity is returned
            const { identifier, pass } = req.body;
            console.log(identifier, pass);
            const place = await this.service.authenticate(identifier, pass);
            if (!place || place === undefined) {
                res.status(500).json({
                    message: 'Place not found '
                });
                return;
            }

            // Genera el token de autenticación

            let token = jwt.sign({
                place: place,
            }, config.secret, {
                expiresIn: config.tokenCaducity
            });
            delete place.dataValues.pass;
            res.json({
                ok: true,
                //place: place,
                token,
            })
        } catch (err) {
            next(err);
        }
    }

    sendActualization = async function (req, res, next) {
        try {
            // Check credentials. If correct, user entity is returned
            let { identifier, pass } = req.body;
            let token = req.body.token || req.query.token || req.headers["x-access-token"];
            const decoded = jwt.verify(token, config.secret);
            if (decoded.place) {
                identifier = decoded.place.identifier;
                pass = decoded.place.place;
            }
            req.params.identifier = identifier;

            const place = await this.service.getOneEntity(req, res);
            //const place = undefined;
            if (!place || place === undefined) {
                res.status(500).json({
                    message: 'Place not found '
                });
                return;
            }

            delete place.dataValues.pass;
            res.json({
                ok: true,
                place: place,
            })
        } catch (err) {
            next(err);
        }
    }


}

export default new PlaceController(new PlaceService(new PlaceRepository(Place)));