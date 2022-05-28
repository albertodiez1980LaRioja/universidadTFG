class BaseRepository {
    constructor(model, options = {}) {
        this.model = model;
        this.options = options;
    }

    async get(req, res) {
        try {
            const rows = await this.model.findAll();
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
            where: req.params
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

    async delete(req, res) {
        try {
            const deletedRowCount = await this.model.destroy({
                where: req.params
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