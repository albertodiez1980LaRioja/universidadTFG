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

    getMultiple = async function (req, res) {
        const placeFilter = req.query.placeId === undefined
            ? ''
            : ' WHERE "placeId" = $placeId';
        const query = 'SELECT * FROM public.measurements ' +
            'JOIN public.places ON public.measurements."placeId" = public.places.id ' +
            'WHERE ("placeId", date_time) IN (' +
            'SELECT "placeId", MAX(date_time) FROM public.measurements m2' +
            placeFilter +
            ' GROUP BY "placeId")';
        const options = { type: QueryTypes.SELECT };
        if (req.query.placeId !== undefined) {
            options.bind = { placeId: Number(req.query.placeId) };
        }
        return sequelize.query(query, options);
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