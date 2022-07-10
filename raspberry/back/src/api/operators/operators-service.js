const { BaseService } = require("../base/base-service");


class OperatorService extends BaseService {

}

exports.OperatorService = (repository) => new OperatorService(repository);