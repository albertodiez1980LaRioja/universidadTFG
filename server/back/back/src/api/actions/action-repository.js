const { BaseRepository } = require("../base/base-repository");

class ActionRepository extends BaseRepository {

}

exports.ActionRepository = (model) => new ActionRepository(model); 