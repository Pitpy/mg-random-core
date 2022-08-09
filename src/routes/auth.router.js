const express = require('express')
const router = express.Router()
const { tokenCheck } = require('../middlewares/jwt')
const AuthController = require('../controllers/auth.controller')

router.post('/auth/login', tokenCheck, AuthController.Login, AuthController.loginHistory)
    .post('/auth/initial', tokenCheck, AuthController.Initial, AuthController.Logout)
    .delete('/auth/logout', tokenCheck, AuthController.Logout)
    .get('/auth/user', tokenCheck, AuthController.getUser)

module.exports = router