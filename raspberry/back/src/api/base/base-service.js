


class BaseService {
    constructor(repository, options = {}) {
        this.repository = repository;
        this.options = options;
    }

    async get(req, res) {
        return await this.repository.get(req, res);
    }

    async update(req, res) {
        return await this.repository.update(req, res);
    }

    async delete(req, res) {
        return await this.repository.delete(req, res);
    }

    async create(req, res) {
        return await this.repository.create(req, res);
    }

    async getOneEntity(req, res) {
        return await this.repository.getOneEntity(req, res);
    }
}

exports.BaseService = (repository) => new BaseService(repository);