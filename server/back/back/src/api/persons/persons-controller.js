import { PersonService } from './persons-service';
import { PersonRepository } from './persons-repository';
import Person from './persons-model';
import { Router } from 'express';
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');
const RouterPlace = Router();



let { BaseController } = require("../base/base-controller");

class PersonController extends BaseController {
    constructor(service, options = {}) {
        super(service, options);

        this.router = RouterPlace;
        this.router.get('/:dni', this.getOneEntity.bind(this));
        this.router.get('', this.get.bind(this));

        this.router.patch('/:dni', this.update.bind(this));
        this.router.delete('/:dni', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
        this.router.post('/authenticate', this.authenticate.bind(this));
    }

    authenticate = async function (req, res, next) {
        try {

            // Check credentials. If correct, user entity is returned
            const { user_name, pass } = req.body;
            const user = await this.service.authenticate(user_name, pass);
            if (!user || user === undefined) {
                res.status(500).json({
                    message: 'User not found '
                });
                return;
            }

            // Genera el token de autenticación
            delete user.dataValues.pass;
            let token = jwt.sign({
                usuario: user,
            }, config.secret, {
                expiresIn: config.tokenCaducity
            })
            res.json({
                ok: true,
                usuario: user,
                token,
            })
        } catch (err) {
            next(err);
        }
    }


}

export default new PersonController(new PersonService(new PersonRepository(Person)));