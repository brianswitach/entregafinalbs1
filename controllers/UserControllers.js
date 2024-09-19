const UserRepository = require('../repositories/UserRepository');
const UserDTO = require('../dto/UserDTO');

class UserController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const newUser = await UserRepository.createUser({ name, email, password });
            const userDTO = new UserDTO(newUser);
            res.status(201).json(userDTO);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async login(req, res) {
        res.json({ message: 'Login exitoso' });
    }

    async logout(req, res) {
        req.logout();
        res.json({ message: 'Logout exitoso' });
    }
}

module.exports = new UserController();
