//авторизация пользователя
const express = require('express')
const router = express.Router() //наш локальный роутер
const controller = require('../controllers/auth.js')

//для теста
//localhost:5000/api/auth/login
router.post('/login', controller.login)

//localhost:5000/api/auth/register
router.post('/register', controller.register)



module.exports = router