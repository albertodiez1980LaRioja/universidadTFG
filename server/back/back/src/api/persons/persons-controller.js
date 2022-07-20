import { PersonService } from './persons-service';
import { PersonRepository } from './persons-repository';
import Person from './persons-model';
import { Router } from 'express';
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
    }

    async authenticate(req, res, next) {
        try {

            // Check credentials. If correct, user entity is returned
            const { username, password } = req.body;
            const user = await this.service.authenticate(username, password);
            if (!user) throw this.httpErrors.create(401, res.__('Invalid credentials'));

            // Create a new user token
            const payload = {};
            payload.username = user.username;
            const token = this.jwt.createToken(payload);

            res.json({
                success: true,
                message: this.successMessage(user.username, 'authenticated', res.__mf),
                result: {
                    token,
                    user: this.mapEntity(user)
                }
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new PersonController(new PersonService(new PersonRepository(Person)));