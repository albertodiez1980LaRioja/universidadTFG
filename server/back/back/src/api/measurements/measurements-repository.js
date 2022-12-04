const { BaseRepository } = require("../base/base-repository");
import { Sequelize, DataTypes } from "sequelize";

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