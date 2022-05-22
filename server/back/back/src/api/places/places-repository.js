const { BaseRepository } = require("../base/base-repository");

class PlaceRepository extends BaseRepository {

    constructor(model, options = {}) {
        super(model, options);
        this.getOneEntity = async function (req, res) {
            const { latitude, longitude } = req.params;
            try {
                const filas = await this.model.findOne({
                    where: { latitude, longitude }
                });
                res.json(filas);
            } catch (err) {
                res.status(500).json({
                    message: 'Something goes wrong: ' + err,
                    data: {}
                });
            }
        }

        this.update = async function (req, res) {
            const { latitude, longitude } = req.params;
            let campos = req.body;
            const filas = await this.model.findAll({
                attributes: req.params,
                where: { latitude, longitude }
            });
            try {
                if (filas.length > 0) {
                    filas.forEach(async row => {
                        await row.update(campos);
                    });
                }
                res.json({
                    message: 'Update sucess', data: filas
                });
            } catch (err) {
                res.status(500).json({ message: 'Something goes wrong: ' + err });
            }
        }

        this.delete = async function (req, res) {
            const { latitude, longitude } = req.params;
            try {
                const deletedRowCount = await this.model.destroy({
                    where: { latitude, longitude }
                });
                res.json({ message: 'Deleted sucessfully', deletedRowCount: deletedRowCount });
            } catch (err) {
                res.status(500).json({
                    message: 'Something goes wrong: ' + err,
                    data: {}
                });
            }
        }


    }




}

exports.PlaceRepository = (model) => new PlaceRepository(model); 