import { Router } from 'express';
const RouterPlace = Router();

class BaseController {
    constructor(service, options = {}) {
        this.service = service;
        this.options = options;
        this.routerPlace = RouterPlace;
        this.routerPlace.get('', this.get.bind(this));
        this.routerPlace.get('/:id', this.getOneEntity.bind(this));
        this.routerPlace.patch('', this.update.bind(this));
        this.routerPlace.delete('', this.delete.bind(this));
        this.routerPlace.post('', this.create.bind(this));
    }

    async get(req, res) {
        return await this.service.get(req, res);
    }

    async getOneEntity(req, res) {
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

