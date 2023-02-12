const { BaseService } = require("../base/base-service");
const { O_pService } = require("../o_p/o_p-service");
import O_P from "../o_p/o_p-model";
import { sequelize } from "../../database/database";
const bcrypt = require('bcrypt');

class PlaceService extends BaseService {

    update = async function (req, res) {
        let ret = await this.repository.update(req, res);
        let personsBBDD = await O_P.findAll({ where: { placeId: req.body.id } });
        if (req.body.persons) {
            for (let i = 0; i < req.body.persons.length; i++) {
                let aux = personsBBDD.filter((element) => element.dataValues.personId == req.body.persons[i].id)
                if (aux == undefined || aux.length == 0) {
                    await O_P.create({
                        priority: 1, personId: req.body.persons[i].id,
                        placeId: req.body.id
                    });
                }
            }
        }
        for (let i = 0; i < personsBBDD.length; i++) {
            let aux = req.body.persons.filter((element) => element.id == personsBBDD[i].personId);
            if (aux == undefined || aux.length == 0) // delete the relation
                personsBBDD[i].destroy();
        }
        return ret;
    }

    create = async function (req, res) {
        req.body.pass = bcrypt.hashSync(req.body.pass, 10);
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
            delete ret[i].dataValues.pass;
        }
        return ret;
    }

    authenticate = async function (identifier, plainPassword) {
        if (identifier == undefined || plainPassword == undefined)
            return undefined;

        const place = await this.repository.read({ identifier: identifier }, { scope: null });
        if (!place || place == undefined) return;
        //const match = bcrypt.compareSync(plainPassword, place.pass);
        const match = plainPassword == place.pass;
        return match ? place : undefined;
    }

}

exports.PlaceService = (repository) => new PlaceService(repository); 