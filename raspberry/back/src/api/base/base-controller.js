


class BaseController {
    constructor(service, options = {}) {
        this.service = service;
        this.options = options;

    }

    async get(req, res) {
        return await this.service.get(req, res);
    }

    async getOneEntity(req, res) {
        return await this.service.getOneEntity(req, res);
    }

    async update(req, res) {
        return await this.service.update(req, res);
    }

    async delete(req, res) {
        return await this.service.delete(req, res);
    }

    async create(req, res) {
        return await this.service.create(req, res);
    }
}

exports.BaseController = (service) => new BaseController(service);

