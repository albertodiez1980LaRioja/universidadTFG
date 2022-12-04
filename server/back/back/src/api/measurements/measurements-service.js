const { BaseService } = require("../base/base-service");


class MeasurementService extends BaseService {

    createMultiple = async function (req, res) {
        if (req.body.mesaurements) {
            for (let i = 0; i < req.body.mesaurements.length; i++) {
                console.log("measurement a persistir:", req.body.mesaurements[i]);
                let aux = {};
                aux.body = req.body.mesaurements[i];
                //console.log(await this.getOneEntity(aux, res));
                await this.repository.create(aux, res);
            }


            //return await this.repository.create(req, res);

        }
    }

}

exports.MeasurementService = (repository) => new MeasurementService(repository);