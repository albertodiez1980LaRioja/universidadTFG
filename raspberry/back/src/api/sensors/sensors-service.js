const { BaseService } = require("../base/base-service");


class SensorService extends BaseService {



}

exports.SensorService = (repository) => new SensorService(repository);