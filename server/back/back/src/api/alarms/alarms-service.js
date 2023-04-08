const { BaseService } = require("../base/base-service");
import { sequelize } from "../../database/database";
import O_P from "../o_p/o_p-model";


class AlarmsService extends BaseService {
    get = async function (req, res) {
        let ret = [];
        ret = await this.repository.get(req, res);
        if (req.user.usuario.roles == 2) {
            let indexsAux = await O_P.findAll({ where: { personId: req.user.usuario.id } });
            let indexs = [];
            indexsAux.forEach((element) => indexs.push(element.placeId));
            for (let i = ret.length - 1; i >= 0; i--) {
                if (!indexs.includes(ret[i].placeId))
                    ret.splice(i, 1);

            }
        }
        return ret;
    }


}

exports.AlarmsService = (repository) => new AlarmsService(repository); 