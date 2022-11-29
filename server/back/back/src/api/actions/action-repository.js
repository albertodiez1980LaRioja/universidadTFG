const { BaseRepository } = require("../base/base-repository");

class ActionRepository extends BaseRepository {
    getLastActionByPlace = async function (idPlace, idOutput) {
        return this.model.findAll({
            where: { placeId: idPlace, outputId: idOutput },
            order: [['placeId', 'DESC']],
            limit: 1
        });
    }
}

exports.ActionRepository = (model) => new ActionRepository(model); 