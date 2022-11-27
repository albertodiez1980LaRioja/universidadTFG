const { BaseRepository } = require("../base/base-repository");

class OutputRepository extends BaseRepository {

}

exports.OutputRepository = (model) => new OutputRepository(model); 