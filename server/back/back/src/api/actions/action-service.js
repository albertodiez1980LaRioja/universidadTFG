const { BaseService } = require("../base/base-service");
import Output from '../outputs/output-model';


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


}

exports.ActionService = (repository) => new ActionService(repository);