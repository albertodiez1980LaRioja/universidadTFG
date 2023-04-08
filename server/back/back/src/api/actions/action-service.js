const { BaseService } = require("../base/base-service");
import Output from '../outputs/output-model';
import O_P from "../o_p/o_p-model";


class ActionService extends BaseService {
    getByPlace = async function (req, res, isPlace) {
        let returned = undefined;
        try {
            returned = await this.repository.getLastActionByPlace(req.params.id_place);
            // set returned if it is by place
            if (isPlace)
                this.repository.setSended(returned);
        } catch (err) {
            res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });
        }
        return returned;
    }

    get = async function (req, res) {
        let ret = [];
        ret = await this.repository.get(req, res);
        if (req.user.usuario.roles != 0) {
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

exports.ActionService = (repository) => new ActionService(repository);