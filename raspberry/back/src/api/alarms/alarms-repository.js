const { BaseRepository } = require("../base/base-repository");
import { Sequelize, DataTypes } from "sequelize";

class AlarmsRepository extends BaseRepository {
    constructor(model, options = {}) {
        super(model, options);
        this.getOneEntity = async function (req, res) {
            try {
                const { latitude, longitude, date_time, id_sensor } = req.params;
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
}

exports.AlarmsRepository = (model) => new AlarmsRepository(model); 