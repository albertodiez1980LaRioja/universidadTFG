const { BaseRepository } = require("../base/base-repository");

class PersonRepository extends BaseRepository {
    read = async function (user_name, scope) {
        try {
            const object = { where: { user_name: user_name.username } };
            const user = await this.model.findOne(object);
            return user;
        } catch (err) {
            console.log('Error on get user');
        }

        return undefined;
    }
}

exports.PersonRepository = (model) => new PersonRepository(model); 