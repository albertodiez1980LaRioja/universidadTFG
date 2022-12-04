const { BaseService } = require("../base/base-service");


class MeasurementService extends BaseService {

    createMultiple = async function (req, res) {
        if (req.body.mesaurements) {
            for (let i = 0; i < req.body.mesaurements.length; i++) {
                console.log("measurement a persistir:", i, req.body.mesaurements[i]);
                let aux = {};
                aux.body = req.body.mesaurements[i];
                const exists = await this.repository.existsMeasurement(req.body.mesaurements[i])
                //console.log("existe", exists);
                if (!exists)
                    await this.repository.create(aux, res);
            }


            //return await this.repository.create(req, res);

        }
    }

}

exports.MeasurementService = (repository) => new MeasurementService(repository);