const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserController = require('../controllers/UserController');

// Registro de usuario
router.post('/register', UserController.register);

// Login de usuario
router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/products',
    failureRedirect: '/login',
    failureFlash: true
}), UserController.login);

// Logout de usuario
router.post('/logout', UserController.logout);

module.exports = router;
