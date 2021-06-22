const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/errorHandler')
//контроллеры есть функции которые вызываются в роутах
//подключаем наши модели
const keys = require('../config/keys')
const User = require('../models/User')

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({email: req.body.email})
    if (candidate){
        //проверка пароля, если он существует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult){
            //Пароли совпали, генерируем токен
            const token = jwt.sign({
                //сначала то, что хотим зашифровать
                email: candidate.email,
                userId: candidate._id
            },
                //секретный ключ
                keys.jwt,
                //время жизни токена 60 сек * 60 мин = час
                {expiresIn: 60 * 60}
                )
            res.status(200).json({
                token: `Bearer ${token}`
            })
        }
        else{
            //Ошибка: пароли не совпали
            res.status(401).json({
                message: 'Пароли не совпадают. Попробуйте снова'
            })
        }
    }
    else{
        //проверка пользователя, если он не существует
        res.status(404).json({ //404 not found
            message: 'Пользователь с таким  email не найден'
        })
    }
}

module.exports.register = async function(req, res){
    //ищем запись, имейл которой совпалает с запрошенной пользователю(то есть она уже есть в базе если да)
    //мы сделали асинхронной функцию, чтобы не обращаться каждый раз к промисам и прописывать возможные ошибки
    //то есть если код не выполнится он не навредит всему остальному
    //await обозначается элемент в функции который является выполняемым асинхронно
    const candidate = await User.findOne({email: req.body.email})
    //findOne вернет тру если найдет поэтому
    if(candidate){
        //пользователь найден
        res.status(409).json({
            message: 'email занят. попробуйте другой'
        })
    }
    else{
        //пользователь не найден
        //создаем локально
        //НАДО КОДИРОВАТЬ ПАРОЛИ!!!
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        //добавляем в базу
        try{
            //код который потенциально может вызвать ошибку
            await user.save()
            res.status(201).json(user) //created
        }
        catch (e){
            errorHandler(res, e)
        }

    }
}