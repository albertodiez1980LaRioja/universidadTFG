


class BaseController {
    constructor(service, options = {}) {
        this.service = service;
        this.options = options;

    }

    async get(req, res) {
        const rows = await this.service.get(req, res);
        res.status(200).json({ data: rows });
        return rows;
    }

    async getOneEntity(req, res) {
        const result = await this.service.getOneEntity(req, res);
        res.json(result);
        return result;
    }

    async update(req, res) {
        try {
            const result = await this.service.update(req, res);
            res.json({
                message: 'Update sucess', data: result
            });
            return result;
        } catch (err) {
            return res.status(500).json({ message: 'Something goes wrong: ' + err });
        }
    }

    async delete(req, res) {
        const deletedRowCount = await this.service.delete(req, res);
        res.json({ message: 'Deleted sucessfully', deletedRowCount: deletedRowCount });
        return deletedRowCount;
    }

    async create(req, res) {
        const newRow = await this.service.create(req, res);
        if (newRow) {
            res.json({
                message: 'Created succefully',
                data: newRow
            });
        }

        return newRow;
    }
}

exports.BaseController = (service) => new BaseController(service);
