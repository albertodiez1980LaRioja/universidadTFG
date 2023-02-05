const { BaseRepository } = require("../base/base-repository");

class RangeAlarmRepository extends BaseRepository {

}

exports.RangeAlarmRepository = (model) => new RangeAlarmRepository(model); 