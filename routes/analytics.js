//авторизация пользователя
const express = require('express')
const router = express.Router() //наш локальный роутер
const controller = require('../controllers/analytics.js')

router.get('/overview', controller.overview)
router.get('/analytics', controller.analytics)


module.exports = router