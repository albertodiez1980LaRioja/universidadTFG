const { BaseRepository } = require("../base/base-repository");

class OwnerRepository extends BaseRepository {

}

exports.OwnerRepository = (model) => new OwnerRepository(model); 