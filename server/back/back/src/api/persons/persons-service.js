const { BaseService } = require("../base/base-service");


class PersonService extends BaseService {
    async authenticate(username, plainPassword) {
        const user = await this.repository.read({ username }, { scope: null });
        if (!user) return;
        const match = await this.hash.compareStrings(plainPassword, user.password);
        return match ? user : undefined;
    }
}

exports.PersonService = (repository) => new PersonService(repository);