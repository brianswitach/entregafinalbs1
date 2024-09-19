const UserRepository = require('../repositories/UserRepository');

class UserService {
    async registerUser(userData) {
        return await UserRepository.createUser(userData);
    }

    async findUserByEmail(email) {
        return await UserRepository.findByEmail(email);
    }
}

module.exports = new UserService();
