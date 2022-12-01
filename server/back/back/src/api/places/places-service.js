const { BaseService } = require("../base/base-service");
import { sequelize } from "../../database/database";
const bcrypt = require('bcrypt');

class PlaceService extends BaseService {

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