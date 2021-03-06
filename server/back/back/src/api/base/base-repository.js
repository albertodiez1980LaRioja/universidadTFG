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

    async getTransaction() {
        return await Sequelize.transaction();
    }

    async get(req, res, transaction = undefined) {
        try {
            let params = { where: this.validateParams(req.params) };
            if (transaction != undefined)
                params.transaction = transaction;
            const rows = await this.model.findAll(params);
            return rows;
        } catch (err) {
            res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });
        }
    }

    async update(req, res, transaction = undefined) {
        try {
            let campos = req.body;
            let objeto = {
                attributes: req.params,
                where: this.validateParams(req.params)
            }
            if (transaction != undefined)
                objeto.transaction = transaction;
            const filas = await this.model.findAll(objeto);
            if (filas.length > 0) {
                filas.forEach(async row => {
                    await row.update(campos);
                });
            }
            return filas;
        } catch (err) {
            if (transaction == undefined)
                res.status(500).json({ message: 'Something goes wrong: ' + err });
            else
                throw err; // propagate the err
        }
    }

    async getOneEntity(req, res, transaction = undefined) {
        try {
            let params = { where: this.validateParams(req.params) };
            if (transaction != undefined)
                params.transaction = transaction;
            const filas = await this.model.findOne(params);
            return filas;
        } catch (err) {
            res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });
        }
    }

    async delete(req, res, transaction = undefined) {
        try {
            let objeto = { where: this.validateParams(req.params) };
            if (transaction != undefined)
                objeto.transaction = transaction;
            const deletedRowCount = await this.model.destroy(objeto);
            return deletedRowCount;
        } catch (err) {
            if (transaction == undefined)
                res.status(500).json({
                    message: 'Something goes wrong: ' + err,
                    data: {}
                });
            else
                throw err; // propagate the err
        }
    }

    async create(req, res, transaction = undefined) {
        let campos = req.body;
        try {
            let params = {
                fields: campos['id_asignatura']
            };
            if (transaction != undefined)
                params.transaction = transaction;
            let newRow = await this.model.create(campos, params)
            return newRow;
        } catch (err) {
            if (transaction == undefined)
                res.status(500).json({
                    message: 'Something goes wrong: ' + err,
                    data: {}
                });
            else
                throw err; // propagate the err
        }

    }
}

exports.BaseRepository = (model) => new BaseRepository(model);