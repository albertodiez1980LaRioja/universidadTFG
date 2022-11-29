const { BaseService } = require("../base/base-service");
import Output from '../outputs/output-model';


class ActionService extends BaseService {
    getByPlace = async function (req, res) {
        let returned = undefined;
        try {
            returned = await Output.findAll();
        } catch (err) {
            res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });
        }
        let outputs = [];
        for (let i = 0; i < returned.length; i++) {
            let actions = (await this.repository.getLastActionByPlace(req.params.id_place, returned[i].dataValues.id));
            if (actions.length > 0) {
                outputs.push(actions[0].dataValues);
            }
        }
        return outputs;
    }


}

exports.ActionService = (repository) => new ActionService(repository);