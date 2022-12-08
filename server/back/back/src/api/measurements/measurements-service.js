const { BaseService } = require("../base/base-service");
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');


class MeasurementService extends BaseService {

    createMultiple = async function (req, res) {
        try {
            if (req.body.mesaurements) {
                let token = req.body.token || req.query.token || req.headers["x-access-token"];
                const decoded = jwt.verify(token, config.secret);
                for (let i = 0; i < req.body.mesaurements.length; i++) {
                    if (decoded && decoded.place && decoded.place.id)
                        req.body.mesaurements[i].placeId = decoded.place.id;
                    else
                        console.log("Fail token");
                    //console.log("measurement a persistir:", i, req.body.mesaurements[i], decoded.place);
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
        catch (err) {
            /*res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });*/
            return false;
        }
        return true;

    }
}

exports.MeasurementService = (repository) => new MeasurementService(repository);