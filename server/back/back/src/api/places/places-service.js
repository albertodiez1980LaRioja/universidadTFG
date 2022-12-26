const { BaseService } = require("../base/base-service");
const { O_pService } = require("../o_p/o_p-service");
import O_P from "../o_p/o_p-model";
import { sequelize } from "../../database/database";
const bcrypt = require('bcrypt');

class PlaceService extends BaseService {

    create = async function (req, res) {
        const ret = await this.repository.create(req, res);
        if (req.body.idPersons) {
            for (let i = 0; i < req.body.idPersons.length; i++) {
                let aux = {};
                aux = {
                    personId: req.body.idPersons[i],
                    placeId: ret.id,
                    priority: 1
                };
                try {
                    O_P.create(aux);
                } catch (err) {
                    res.status(500).json({
                        message: 'Something goes wrong: ' + err,
                        data: {}
                    });
                }
            }
        }
        return ret;
    }

    get = async function (req, res) {
        let ret = await this.repository.get(req, res, sequelize.model('persons'));
        for (let i = 0; i < ret.length; i++) {
            for (let i2 = 0; i2 < ret[i].dataValues.persons.length; i2++) {
                delete ret[i].dataValues.persons[i2].dataValues.pass;
                delete ret[i].dataValues.persons[i2].dataValues.user_name;
                delete ret[i].dataValues.persons[i2].dataValues.address;
                delete ret[i].dataValues.persons[i2].dataValues.roles;
                delete ret[i].dataValues.persons[i2].dataValues.id;
                delete ret[i].dataValues.persons[i2].dataValues.dni;
                delete ret[i].dataValues.persons[i2].dataValues.o_p.dataValues.personId;
            }
        }
        return ret;
    }

    authenticate = async function (username, plainPassword) {
        if (username == undefined || plainPassword == undefined)
            return undefined;
        const place = await this.repository.read({ username }, { scope: null });
        if (!place || place == undefined) return;
        const match = await bcrypt.compareSync(plainPassword, place.pass);
        return match ? place : undefined;
    }

}

exports.PlaceService = (repository) => new PlaceService(repository); 