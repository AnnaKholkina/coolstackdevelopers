const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mogoose = require('mongoose')
const User = mogoose.model('users')
const keys = require('../config/keys')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //будем брать токен из хедера
    secretOrKey: keys.jwt
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (payload, done)=>{ //паспорту добавялем новую стратегию
            try{
                const user = await User.findById(payload.userId).select('email id') //ищем пользователя в бд
                if(user){ //если нашли
                    done(null, user)
                }
                else{
                    done(null, false)
                }
            }
            catch(e){
                console.log(e)
            }
        })
    )
}