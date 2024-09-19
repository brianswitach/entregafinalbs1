const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const UserRepository = require('./repositories/UserRepository'); // Nuevo repositorio para usuarios

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            return done(null, false, { message: 'No se encontró un usuario con ese email' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
        } catch (err) {
            return done(err);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        UserRepository.findById(id).then(user => done(null, user));
    });
}

module.exports = initialize;
