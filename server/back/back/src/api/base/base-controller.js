import { Router } from 'express';
const router = Router();

export default router;


class BaseController {
    constructor(service, options = {}) {
        this.service = service;
        this.options = options;

        router.post('', this.create); // el endpoint y el manejador
        router.get('', this.get);
        router.get('/:id', this.get);
        router.delete('/:id', this.delete);
        router.put('/:id', this.update);
    }

    async get(req, res) {
        this.service.get(req, res);
    }

    async get(req, res) {
        return await this.service.get(req, res);
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