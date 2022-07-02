const { BaseRepository } = require("../base/base-repository");

class SensorRepository extends BaseRepository {

}

exports.SensorRepository = (model) => new SensorRepository(model); 