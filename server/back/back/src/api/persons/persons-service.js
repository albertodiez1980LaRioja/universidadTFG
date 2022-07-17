const { BaseService } = require("../base/base-service");


class PersonService extends BaseService {

}

exports.PersonService = (repository) => new PersonService(repository);