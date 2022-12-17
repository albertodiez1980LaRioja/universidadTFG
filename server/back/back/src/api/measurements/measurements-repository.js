const { BaseRepository } = require("../base/base-repository");
import { QueryTypes } from "sequelize";
import { sequelize } from "../../database/database";


class MeasurementRepository extends BaseRepository {
    constructor(model, options = {}) {
        super(model, options);
        this.getOneEntity = async function (req, res) {
            try {
                const { latitude, longitude, date_time } = req.params;
                const params = { latitude, longitude, date_time: new Date(date_time) };
                //console.log(params);
                const filas = await this.model.findOne({
                    where: req.params
                });
                res.json(filas);
            } catch (err) {
                res.status(500).json({
                    message: 'Something goes wrong: ' + err,
                    data: {}
                });
            }
        }
    }

    getMultiple = async function () {
        return sequelize.query('select * from public.measurements where ("placeId",date_time) in (select "placeId",max(date_time) from public.measurements m2 group by "placeId")', { type: QueryTypes.SELECT });
    }

    existsMeasurement = async function (measurement) {
        try {
            let files = await this.model.findOne({ where: measurement });
            return undefined != await files;
        } catch (err) {
            res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });
        }
    }
}

exports.MeasurementRepository = (model) => new MeasurementRepository(model); 