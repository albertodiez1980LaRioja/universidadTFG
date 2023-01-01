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
        this.router.get('/:id', this.getOneEntity.bind(this));
        this.router.get('', this.get.bind(this));

        this.router.patch('/:id', this.update.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
        this.router.post('', this.create.bind(this));
        this.router.post('/authenticate', this.authenticate.bind(this));
        this.router.post('/validateToken', this.validateToken.bind(this));
    }

    validateToken = async function (req, res, next) {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        console.log('se decodificara');
        if (!token)
            return res.status(403).send('A token is required for authentication');
        try {

            const decoded = jwt.verify(token, config.secret);
            console.log('Usuario:', decoded.usuario.user_name, decoded.usuario.pass);
            const user = await this.service.verificate(decoded.usuario.user_name, decoded.usuario.pass);
            if (!user || user === undefined) {
                res.status(500).json({
                    message: 'User not found '
                });
                return;
            }
            delete decoded.usuario.pass;
            req.user = decoded;
            res.json({
                ok: true,
                usuario: req.user,
            })
        } catch (err) {
            return res.status(401).send('Invalid token');
        }
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

            let token = jwt.sign({
                usuario: user,
            }, config.secret, {
                expiresIn: config.tokenCaducity
            });
            delete user.dataValues.pass;
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