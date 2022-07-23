const { BaseService } = require("../base/base-service");
const bcrypt = require('bcrypt');


class PersonService extends BaseService {
    async authenticate(username, plainPassword) {
        const user = await this.repository.read({ username }, { scope: null });
        if (!user) return;
        const match = await this.hash.compareStrings(plainPassword, user.password);
        return match ? user : undefined;
    }

    update = async function (req, res) {
        if (req.body != undefined && req.body.pass != undefined)
            req.body.pass = bcrypt.hashSync(req.body.pass, 10);
        return await this.repository.update(req, res);
    }

    create = async function (req, res) {
        if (req.body != undefined && req.body.pass != undefined) {
            req.body.pass = bcrypt.hashSync(req.body.pass, 10);
        }
        const ret = await this.repository.create(req, res);
        delete ret.dataValues.pass;
        return ret;
    }

    get = async function (req, res) {
        let ret = await this.repository.get(req, res);
        if (ret != undefined && ret.length != undefined) {
            for (let i = 0; i < ret.length; i++) {
                delete ret[i].dataValues.pass;
            }
        }
        return ret;
    }

    getOneEntity = async function (req, res) {
        let ret = await this.repository.getOneEntity(req, res);
        if (res != undefined && ret.dataValues != undefined) {
            delete ret.dataValues.pass;
        }
        return ret;
    }

    update = async function (req, res) {
        const ret = await this.repository.update(req, res);
        if (ret != undefined && ret.length != undefined) {
            for (let i = 0; i < ret.length; i++) {
                delete ret[i].dataValues.pass;
            }
        }
        return ret;
    }

}

exports.PersonService = (repository) => new PersonService(repository);