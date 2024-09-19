const User = require('../models/User');

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(id) {
        return await User.findById(id);
    }

    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }
}

module.exports = new UserRepository();
