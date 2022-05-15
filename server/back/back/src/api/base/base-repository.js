class BaseRepository {
    constructor(model, options = {}) {
        this.model = model;
        this.options = options;
    }

    async get(req, res) {
        try {
            const rows = await model.findAll();
            res.status(200).json({ data: rows });
        } catch (err) {
            res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });
        }
    }

    async getOneEntity(req, res) {
        const { id } = req.params;
        try {
            const filas = await model.findOne({
                where: { id }
            });
            res.json(filas);
        } catch (err) {
            res.status(500).json({
                message: 'Something goes wrong: ' + err,
                data: {}
            });
        }
    }

    async update(req, res) {
        const { id } = req.params;
        let campos = req.body;
        const filas = await model.findAll({
            //attributes:camposText,
            attributes: req.params,
            where: { id }
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

    async delete(req, res) {
        const { id } = req.params;
        try {
            const deletedRowCount = await model.destroy({
                where: { id }
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
            let newRow = await model.create(campos, {
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