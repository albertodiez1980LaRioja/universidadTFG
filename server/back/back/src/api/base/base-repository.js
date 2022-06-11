import { Sequelize } from "sequelize";

class BaseRepository {
    constructor(model, options = {}) {
        this.model = model;
        this.options = options;
    }

    validateParams(params) {
        let ret = {};
        let keysParams = Object.keys(params);
        let modelParams = Object.keys(this.model.tableAttributes);
        keysParams.forEach(param => {
            if (modelParams.indexOf(param) > -1) {
                ret[param] = params[param];
            }
            else if (param.includes('FINISH')) {
                let initkey = param.substring(0, param.length - 6);
                if (keysParams.indexOf(initkey + 'BEGIN') > -1) {
                    ret[initkey] = {
                        [Sequelize.Op.lte]: params[param],
                        [Sequelize.Op.gte]: params[initkey + 'BEGIN']
                    }
                }
                else {
                    ret[initkey] = { [Sequelize.Op.lte]: params[param] }
                }
            }
            else if (param.includes('BEGIN')) {
                let initkey = param.substring(0, param.length - 5);
                if (keysParams.indexOf(initkey + 'FINISH') < 0) {
                    ret[initkey] = { [Sequelize.Op.gte]: params[param] }
                }
            }
        }
        );
        return ret;
    }

    async get(req, res) {
        try {
            const rows = await this.model.findAll({ where: this.validateParams(req.query) });
            res.status(200).json({ data: rows });
        } catch (err) {
            res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });
        }
    }

    async update(req, res) {
        let campos = req.body;
        const filas = await this.model.findAll({
            attributes: req.params,
            where: this.validateParams(req.query)
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

    async getOneEntity(req, res) {
        try {
            const filas = await this.model.findOne({
                where: this.validateParams(req.query)
            });
            res.json(filas);
        } catch (err) {
            res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });
        }
    }

    async delete(req, res) {
        try {
            const deletedRowCount = await this.model.destroy({
                where: this.validateParams(req.query)
            });
            res.json({ message: 'Deleted sucessfully', deletedRowCount: deletedRowCount });
        } catch (err) {
            res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });
        }
    }

    async create(req, res) {
        let campos = req.body;
        try {
            let newRow = await this.model.create(campos, {
                fields: campos['id_asignatura']
            })
            if (newRow) {
                res.json({
                    message: 'Created succefully',
                    data: newRow
                });
            }
        } catch (err) {
            res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });
        }

    }
}

exports.BaseRepository = (model) => new BaseRepository(model);