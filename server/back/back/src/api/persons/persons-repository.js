const { BaseRepository } = require("../base/base-repository");

class PersonRepository extends BaseRepository {

}

exports.PersonRepository = (model) => new PersonRepository(model); 