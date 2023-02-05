const { BaseRepository } = require("../base/base-repository");

class PlaceRepository extends BaseRepository {
    read = async function (user_name, scope) {
        try {
            const object = { where: { identifier: user_name.identifier } };
            const user = await this.model.findOne(object);
            //console.log('el place', user);
            return user.dataValues;
        } catch (err) {
            console.log('Error on get place', err);
        }
        return undefined;
    }
}

exports.PlaceRepository = (model) => new PlaceRepository(model); 