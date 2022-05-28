const { BaseRepository } = require("../base/base-repository");

class PlaceRepository extends BaseRepository {

}

exports.PlaceRepository = (model) => new PlaceRepository(model); 