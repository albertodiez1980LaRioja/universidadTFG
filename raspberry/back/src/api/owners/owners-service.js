const { BaseService } = require("../base/base-service");


class OwnerService extends BaseService {

}

exports.OwnerService = (repository) => new OwnerService(repository);