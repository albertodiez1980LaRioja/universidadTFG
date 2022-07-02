const { BaseService } = require("../base/base-service");


class MeasurementService extends BaseService {



}

exports.MeasurementService = (repository) => new MeasurementService(repository);