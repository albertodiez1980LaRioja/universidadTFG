const { BaseRepository } = require("../base/base-repository");

class PlaceRepository extends BaseRepository {
    read = async function (user_name, scope) {
        try {
            console.log('en read', user_name);
            const object = { where: { identifier: user_name.username } };
            const user = await this.model.findOne(object);
            console.log('el place', user);
            return user;
        } catch (err) {
            console.log('Error on get user');
        }
        return undefined;
    }
}

exports.PlaceRepository = (model) => new PlaceRepository(model); 