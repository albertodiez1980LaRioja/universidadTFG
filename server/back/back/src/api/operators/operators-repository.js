const { BaseRepository } = require("../base/base-repository");

class OperatorRepository extends BaseRepository {

}

exports.OperatorRepository = (model) => new OperatorRepository(model); 